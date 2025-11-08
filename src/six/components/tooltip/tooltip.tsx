// Tooltip.tsx - Updated with tool-specific context
import React from 'react';
import './tooltip.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  optionValue?: string;
  optionType?: string;
  toolType?: 'mta' | 'saber' | 'ae';
  setPassedPrompt?: (prompt: string) => void;
}

// Define context for each tool - updated to match the natural style
const TOOL_CONTEXTS = {
  mta: `Here's some background about MTA (Multi-Threaded Analysis) to help with your explanation:

MTA is a static analysis tool that analyses value-flow specifically in multi-threaded programs. It uses FSAM (Flow-Sensitive pointer Analysis Model) for efficient handling of large, complex C programs and performs sparse analysis with thread interference checks.

It's used to detect data races (when multiple threads access shared data without proper synchronization), evaluate lock safety (ensuring proper use of locks and synchronization primitives), and optimize multithreaded performance to improve efficiency and safety of concurrent code.`,

  saber: `Here's some background about SABER to help with your explanation:

SABER is a static memory leak detector for C programs, integrated into the Open64 compiler. It utilizes full-sparse value-flow analysis to track values from allocation (e.g., malloc) to release (e.g., free) and builds a Sparse Value-Flow Graph (SVFG). It works through four main phases: Pre-Analysis, Full-Sparse SSA Form Conversion, SVFG Construction, and Leak Detection via graph reachability.

It's used for high accuracy with fewer false positives in memory leak detection, reduces debugging time by catching memory issues early in development, and uses Binary Decision Diagrams (BDDs) to efficiently manage control-flow paths and reduce redundancy.`,

  ae: `Here's some background about AE (Abstract Execution) to help with your explanation:

AE is a static analysis tool that analyses programs by examining variable states at each control point. It follows control flow to understand variable states in each statement and helps gather program semantics to identify potential issues.

It's used to detect various bugs like buffer overflows and null pointer dereferences, helps identify vulnerabilities by understanding data access and changes, and facilitates security checks while optimizing code based on variable usage patterns.`,

  wpa: `Here's some background about WPA (Whole Program Pointer Analysis) to help with your explanation:

WPA is SVF's primary pointer analysis tool that performs comprehensive pointer analysis across the entire program. It builds a complete points-to graph that tracks which memory locations each pointer may point to throughout the program. WPA typically uses Andersen's algorithm, which is flow-insensitive but field-sensitive, making it scalable for large programs while maintaining good precision.

It's used as the foundation for many other analyses by providing accurate points-to information, enables precise alias analysis which is crucial for compiler optimizations, and helps understand indirect calls and complex pointer relationships in C/C++ programs.`,

  cfl: `Here's some background about CFL (Context-Free Language Reachability Analysis) to help with your explanation:

CFL is a driver for Context-Free Language Reachability Analysis in SVF. This analysis technique models program properties as context-free grammar rules and solves reachability problems on graphs. It processes command-line arguments, sets up the analysis configuration, and executes the CFL-reachability algorithm to answer specific program analysis queries.

It's used to perform more precise analysis than traditional approaches by considering context-sensitivity, can answer specific reachability queries about program properties efficiently, and is particularly useful for problems like field-sensitive pointer analysis and type-state verification.`,

  dvf: `Here's some background about DVF (On-Demand Value Flow Analysis) to help with your explanation:

DVF performs value-flow analysis on demand, meaning it only analyses the parts of the program relevant to specific queries rather than analysing the entire program upfront. This demand-driven approach makes it highly efficient for answering targeted questions about how values flow through the program.

It's used to efficiently answer specific queries about value flow without analysing the entire program, reduces analysis time and memory usage by focusing only on relevant code paths, and is particularly useful for interactive tools and IDE integrations where quick responses to specific queries are needed.`,
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  optionValue,
  optionType,
  setPassedPrompt,
}) => {
  // Track whether onboarding is active via DOM observers (so this re-renders on close)
  const computeActive = () =>
    typeof document !== 'undefined' &&
    document.documentElement.dataset.onboardingActive === 'true' &&
    !!document.querySelector('.interactive-onboarding-overlay');
  const [onboardingActive, setOnboardingActive] = React.useState<boolean>(computeActive);
  React.useEffect(() => {
    const update = () => setOnboardingActive(computeActive());
    const moAttr = new MutationObserver(update);
    const moTree = new MutationObserver(update);
    try {
      moAttr.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-onboarding-active'],
      });
      moTree.observe(document.body, { childList: true, subtree: true });
    } catch {
      /* no-op */
    }
    return () => {
      moAttr.disconnect();
      moTree.disconnect();
    };
  }, []);

  // Function to handle Ask CodeGPT button click
  const handleAskCodeGPT = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (setPassedPrompt && optionValue && optionType) {
      // Determine context directly from the optionValue being clicked - just like graphs!
      let toolContext = '';

      // Check the optionValue to determine which context to use
      if (
        optionValue === 'mta' ||
        optionValue.includes('mta') ||
        optionValue.includes('Multi-Thread')
      ) {
        toolContext = TOOL_CONTEXTS.mta;
      } else if (
        optionValue === 'saber' ||
        optionValue.includes('saber') ||
        optionValue.includes('Memory Leak')
      ) {
        toolContext = TOOL_CONTEXTS.saber;
      } else if (
        optionValue === 'ae' ||
        optionValue.includes('ae') ||
        optionValue.includes('Buffer Overflow')
      ) {
        toolContext = TOOL_CONTEXTS.ae;
      } else {
        // For compile flags or other options
        toolContext =
          'Here is some general background about static analysis tools to help with your explanation: These tools analyse code to find potential issues, bugs, and optimization opportunities.';
      }

      const prompt = `${toolContext}

Explain what the ${optionType} "${optionValue}" does. Focus on:
- What is this executable and how does it work
- What specific problems or issues this option helps detect or solve
- When you should use this option vs when you shouldn't
- Any performance impact or trade-offs with this option

Keep the explanation concise and practical for students learning static analysis.`;

      setPassedPrompt(prompt);
    }
  };

  return (
    <div className="tooltip-container">
      <div className="tooltip-trigger">{children}</div>
      <div className="tooltip-content">
        {content}
        {setPassedPrompt && optionValue && (
          <div className="tooltip-button-container">
            <button
              onClick={handleAskCodeGPT}
              className="tooltip-button"
              disabled={onboardingActive}
            >
              <span style={{ marginRight: '5px' }}>💡</span>
              Ask CodeGPT for more details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tooltip;
