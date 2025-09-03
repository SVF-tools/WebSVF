#!/usr/bin/env python3
"""
Python SVF API Backend
This replaces the C# backend with Python SVF bindings
"""

import glob
import os
import shlex
import subprocess
import tempfile
from typing import List, Optional

import pysvf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

TOOL_NAMES = frozenset(["ae", "cfl", "dvf", "mta", "saber", "svf_ex", "wpa"])

# Models
class DotGraph(BaseModel):
    """Model for dot graph representation."""
    name: str = ""
    graph: str = ""

class RequestBody(BaseModel):
    """Model for API request body."""
    input: Optional[str] = None
    compileOptions: Optional[str] = None
    extraExecutables: Optional[List[str]] = None

class ScriptOutput(BaseModel):
    """Model for script output."""
    output: str = ""
    error: str = ""

class SvfResult(BaseModel):
    """Model for SVF analysis result."""
    name: str = ""
    output: str = ""
    graphs: List[DotGraph] = []
    error: str = ""
    llvm: str = ""

# FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_dot_graphs() -> List[DotGraph]:
    """
    Collect and return all generated dot graphs
    """
    dot_graphs: List[DotGraph] = []

    # Mapping from SVF output names to simplified names
    file_name_mappings = {
        "svfir_initial.dot": "pag",
        "svfir_final.dot": "pag",
        "callgraph_initial.dot": "callgraph",
        "callgraph_final.dot": "callgraph",
        "icfg_initial.dot": "icfg",
        "icfg_final.dot": "icfg",
        "vfg_final.dot": "vfg",
        "svfg_final.dot": "svfg", # SABER slice graph
    }

    # Track which simplified names we've already added
    added_names = set()

    for dot_file in glob.glob("*.dot"):
        base_name = os.path.basename(dot_file)

        try:
            with open(dot_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if this file should be mapped to a simpler name
            if base_name in file_name_mappings:
                simple_name = file_name_mappings[base_name]
                # For duplicate mappings (initial vs final), prefer the final version
                if "final" in base_name or simple_name not in added_names:
                    # Remove any previous version with same name
                    dot_graphs = [d for d in dot_graphs if d.name != simple_name]
                    dot_graphs.append(DotGraph(name=simple_name, graph=content))
                    added_names.add(simple_name)
            else:
                # For unmapped files, keep original name without .dot extension
                name_without_ext = base_name[:-4] if base_name.endswith(".dot") else base_name
                dot_graphs.append(DotGraph(name=name_without_ext, graph=content))
        except IOError as e:
            raise IOError(f"Error reading {dot_file}: {str(e)}") from e

    return dot_graphs

def run_svf_tools(ll_file: str, extra_executables: List[str]) -> tuple[str, str]:
    """
    Run SVF analysis tools with specified options, similar to C# SetCompileOptions
    but using Python bindings instead of shell scripts
    """

    # Clean up existing .dot files
    for dot_file in glob.glob("*.dot"):
        try:
            os.unlink(dot_file)
        except OSError:
            pass
    output_lines = ["=== Running SVF Analysis with Graph Dumps ==="]
    errors = []

    # First run the base SVF analysis with graph dumps
    base_options = ['-dump-callgraph', '-dump-icfg', '-dump-pag', '-dump-vfg', ll_file]
    output, error = pysvf.run_svf_tool('svf_ex', base_options)
    output_lines.append(output)
    errors.append(error)

    # Run extra executables if provided
    for executable in extra_executables:
        # Parse the executable string, allowing additional flags after the tool name
        parts = shlex.split(executable)
        if not parts:
            continue
        tool = parts[0].lower()
        args = parts[1:]
        if tool in TOOL_NAMES:
            output_lines.append(f"\n=== Running {tool.upper()} Analysis ===")
            cmd: List[str] = []
            # Add dump/options based on executable if not provided by user
            if tool == 'saber':
                if '-leak' not in args:
                    cmd.extend(['-leak'])  # Enable leak detection
            elif tool == 'mta':
                if '-race' not in args:
                    cmd.extend(['-race'])  # Enable race detection
            elif tool == 'wpa':
                # Ensure a pointer analysis is specified; default to Andersen if none
                has_pta_flag = any(
                    flag.startswith('-')
                    and ('pta' in flag or flag in ['-ander', '-fspta', '-steens'])
                    for flag in args
                )
                if not has_pta_flag:
                    cmd.append('-ander')
            elif tool == 'ae':
                # Pass through AE-specific subtool (e.g., -bo, -nd) if provided
                # If user provided no extra arg, we will just run base AE
                pass
            # Preserve user-provided flags
            cmd.extend(args)
            cmd.append(ll_file)
            try:
                output, error = pysvf.run_svf_tool(tool, cmd)
            except BaseException as e:
                # Capture tool failures without aborting the request
                output = ''
                error = f"{tool} failed: {str(e)}"
            output_lines.append(output)
            errors.append(error)
        else:
            supported_tools = ', '.join(TOOL_NAMES)
            raise ValueError(
                f"Warning: Unknown executable '{executable}'. "
                f"Supported tools are: {supported_tools}"
            )

    return "\n".join(output_lines), "\n".join(errors)

def compile_c_to_llvm(c_code: str, compile_options: str = "") -> tuple[bool, str, str]:
    """
    Compile C code to LLVM IR
    Returns: (success, output, error)
    """
    output_lines: List[str] = []
    try:
        # Write C code to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
            f.write(c_code)
            c_file = f.name

        # Output LLVM file
        ll_file = c_file.replace('.c', '.ll')

        # Use system clang in Docker container, or LLVM 16 on macOS
        clang_path = "/opt/homebrew/opt/llvm@16/bin/clang"

        # Check if LLVM 16 is available, otherwise fall back to system clang
        if not os.path.exists(clang_path):
            clang_path = "clang"  # Use system clang

        # Compile command
        cmd = f"{clang_path} {compile_options} -emit-llvm -S {c_file} -o {ll_file}"

        # Run compilation
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True,
                              check=False)

        if result.returncode != 0:
            return False, result.stdout, result.stderr

        # Read LLVM IR
        with open(ll_file, 'r', encoding='utf-8') as f:
            llvm_content = f.read()

        # Clean up temporary files
        os.unlink(c_file)
        os.unlink(ll_file)
        return True, llvm_content, "\n".join(output_lines)

    except (OSError, IOError) as e:
        output_lines.append(f"Compilation error: {str(e)}")
        return False, "\n".join(output_lines), str(e)

@app.post("/api/controller")
async def analyse_code(request_body: RequestBody) -> SvfResult:
    """
    Analyze code using SVF tools and return results with graphs.
    """
    # Clean up existing .dot files
    for dot_file in glob.glob("*.dot"):
        os.unlink(dot_file)

    # Compile C code to LLVM IR
    if request_body.input is None:
        raise HTTPException(
            status_code=400,
            detail={
                "Error": "No input C code provided.",
                "Name": "Input Error"
            }
        )
    success, llvm_ir, compile_output = compile_c_to_llvm(
        request_body.input, request_body.compileOptions or ""
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail={
                "Error": compile_output,
                "Name": "Clang Error"
            }
        )

    # Create temporary file for LLVM IR
    with tempfile.NamedTemporaryFile(mode='w', suffix='.ll', delete=False) as f:
        f.write(llvm_ir)
        ll_file = f.name

    try:
        output, errors = run_svf_tools(ll_file, request_body.extraExecutables or [])
        result = SvfResult(
            name="Resultant Graphs",
            output=output,
            graphs=get_dot_graphs(),
            error=errors,
            llvm=llvm_ir
        )

        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "name": "SVF Analysis Error"
            }
        )
    finally:
        os.unlink(ll_file)

@app.get("/api/controller")
async def health_check():
    """
    Health check endpoint
    """
    return {"message": "Hello World from the SVF Python controller :D\n"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
