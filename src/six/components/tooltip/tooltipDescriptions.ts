// TooltipDescriptions.ts
// Contains all tooltip descriptions for compiler flags and executable options

export const compileOptionDescriptions: Record<string, string> = {
  '-g': 'Generate debug information. This includes variable names, line numbers, and other information that helps with debugging.',
  '-c': 'Compile without linking. Produces object files (.o) that can be linked separately.',
  '-S': 'Generate assembly code. Outputs the assembly representation instead of binary object code.',
  '-fno-discard-value-names':
    'Preserves variable names in LLVM IR, making the IR more readable for humans.',
  '-emit-llvm':
    'Generate LLVM Intermediate Representation (IR) instead of native assembly or object code.',
  '-E': "Preprocess only. Runs the preprocessor but doesn't compile, assemble, or link.",
  '-v': 'Verbose mode. Shows commands executed by the compiler and additional information.',
  '-pipe': 'Use pipes rather than temporary files for communication between compiler stages.',
  '--help': 'Display available options and exit.',
};

export const executableOptionDescriptions: Record<string, string> = {
  mta: 'Multi-Thread Analysis. Analyses concurrent programs to detect potential thread-related issues like race conditions and deadlocks.',
  saber:
    'Memory Leak Detector. Identifies memory that is allocated but never freed, causing memory leaks in your program.',
  'ae -overflow':
    'Buffer Overflow Detector. Identifies potential buffer overflow vulnerabilities where a program writes data beyond the allocated memory buffer.',
  'ae -null-deref':
    'Null Dereference Detector. Identifies places where a null pointer could be dereferenced in your program, helping prevent crashes and undefined behavior.',
  wpa: 'Whole Program Pointer Analysis. Performs comprehensive pointer analysis across the entire program to build accurate points-to relationships.',
  dvf: 'On-Demand Value Flow Analysis. Performs value-flow analysis on demand, analysing only the parts of the program relevant to specific queries for efficiency.',
};

// Helper function to add descriptions to option objects
export const addDescriptionsToOptions = <T extends { value: string; label: string }>(
  options: T[],
  descriptions: Record<string, string>
): (T & { description?: string })[] => {
  return options.map((option) => ({
    ...option,
    description: descriptions[option.value],
  }));
};
