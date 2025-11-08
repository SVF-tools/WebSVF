import { OnboardingStep } from './InteractiveOnboarding';

// Sample code for tutorial
const DEMO_CODE = `#include <stdio.h>
#include <stdlib.h>

int *createArray(int size) {
    int *arr = malloc(size * sizeof(int));
    for (int i = 0; i < size; i++) {
        arr[i] = i * 2;
    }
    return arr;
}

int main() {
    int *numbers = createArray(5);
    
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    
    free(numbers);
    return 0;
}`;

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';

interface CompileOption {
  value: string;
  label: string;
}

interface TutorialStepsConfig {
  setCode?: (code: string) => void;
  setCurrentOutput?: (output: OutputType) => void;
  submitCode?: () => void;
  selectedCompileOptions?: CompileOption[];
  setSelectedCompileOptions?: (options: CompileOption[]) => void;
  selectedExecutableOptions?: CompileOption[];
  setSelectedExecutableOptions?: (options: CompileOption[]) => void;
}

export const createTutorialSteps = (config: TutorialStepsConfig): OnboardingStep[] => {
  const {
    setCode,
    setCurrentOutput,
    submitCode: _submitCode,
    selectedCompileOptions: _selectedCompileOptions,
    setSelectedCompileOptions: _setSelectedCompileOptions,
    selectedExecutableOptions: _selectedExecutableOptions,
    setSelectedExecutableOptions,
  } = config;

  return [
    // Step 1: Welcome
    {
      title: 'Welcome to WebSVF 6.0! 🎉',
      content:
        'Welcome to WebSVF 6.0 - a powerful static analysis tool for C/C++ programs. This interactive tutorial will guide you through all the features. You can skip at any time or replay this tutorial from the help button.',
      position: 'center',
    },

    // Step 2: Code Editor
    {
      title: 'The Code Editor',
      content:
        'This is where you write or paste your C/C++ code. The editor supports syntax highlighting and line numbers.',
      targetElement: '#graph-page-code-container',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
      action: () => {
        if (setCode) {
          setCode(DEMO_CODE);
        }
      },
    },

    // Step 3: Sessions Sidebar
    {
      title: 'Project Sessions',
      content:
        'The sidebar shows your projects (sessions). Each session saves your code, settings, and analysis results independently. Click the "+" button to create new sessions.',
      targetElement: '.sessions-sidebar',
      position: 'right',
      arrow: true,
      highlightPulse: true,
    },

    // Step 4: Compiler Options
    {
      title: 'Compiler Options',
      content:
        'Select how your code should be compiled. The default options include -g (debug info), -c (compile only), -emit-llvm (generate LLVM IR), and more. These options are already selected for you!',
      targetElement: '#submit-codeBar-compile-options-container',
      position: 'left',
      arrow: true,
      highlightPulse: true,
      allowInteraction: true,
    },

    // Step 5: Executable Options
    {
      title: 'Analysis Tools (Executable Options)',
      content:
        "Choose which SVF analysis to run:\n• mta: Multi-Thread Analysis\n• saber: Memory Leak Detection\n• wpa: Pointer Analysis\n• ae: Buffer Overflow/Null Dereference\n\nWe'll use 'ae' for this demo!",
      targetElement: '#submit-codeBar-compile-options-container',
      position: 'left',
      arrow: true,
      highlightPulse: true,
      allowInteraction: true,
      action: () => {
        // Auto-select wpa if available
        if (setSelectedExecutableOptions) {
          setSelectedExecutableOptions([{ value: 'ae', label: 'ae (Buffer Overflow Detector)' }]);
        }
      },
    },

    // Step 6: Run Button
    {
      title: 'Run Your Analysis',
      content:
        "Now click the 'Run' button to compile your code and run the selected analysis. The button will show a loading indicator while processing.",
      targetElement: '.action-button.run-button',
      position: 'top',
      arrow: true,
      highlightPulse: true,
      allowInteraction: true,
      requireClick: true,
      waitForAction: true,
      clickMessage: 'Click the Run button to start. Next will enable after the analysis finishes.',
      nextLabel: 'Continue',
    },

    // Step 7: Output Tabs
    {
      title: 'Output Tabs',
      content:
        'After running, results appear in different tabs:\n• Graph: Visual analysis results\n• Terminal Output: Compilation logs\n• LLVM IR: Intermediate representation\n• CodeGPT: AI assistant\n\n',
      targetElement: '.output-menu-bar',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
      action: () => {
        if (setCurrentOutput) {
          setCurrentOutput('Graph');
        }
      },
    },

    // Step 8: Graph View
    {
      title: 'Understanding Graphs',
      content:
        'Graphs visualize your analysis results. Nodes represent program elements (functions, variables, pointers), and edges show relationships. Use your mouse to zoom and pan. Click nodes to highlight corresponding code!',
      targetElement: '#graph-page-output-container',
      position: 'top',
      arrow: true,
      highlightPulse: false,
      forcePreferredSide: true,
    },

    // Step 9: Switch to Terminal Output (required)
    {
      title: 'Switch to Terminal Output',
      content:
        "Now switch to the 'Terminal Output' tab to view compilation logs and analysis messages.",
      targetElement: '.output-menu-bar',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
      allowInteraction: true,
      requireOutput: 'Terminal Output',
      clickMessage: 'Click the Terminal Output tab to continue',
    },

    // Step 10: Terminal Output Overview
    {
      title: 'Terminal Output',
      content:
        'The Terminal Output tab shows compilation messages, errors, and analysis results. This is helpful for debugging compilation issues or understanding analysis warnings.',
      targetElement: '#graph-page-output-container',
      position: 'left',
      arrow: true,
      highlightPulse: true,
      action: () => {
        if (setCurrentOutput) {
          setCurrentOutput('Terminal Output');
        }
      },
    },

    // Step 11: LLVM IR Tab
    {
      title: 'LLVM IR View',
      content:
        'LLVM IR shows the intermediate representation of your compiled code. Click on the LLVMIR tab to view it.',
      targetElement: '.output-menu-bar',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      requireOutput: 'LLVMIR',
      subSteps: [
        {
          content:
            "First, let's switch to the LLVM IR tab. Click on 'LLVMIR' in the menu bar above.",
          targetElement: '.output-menu-bar',
          requireClick: true,
          allowInteraction: true,
          requireOutput: 'LLVMIR',
        },
        {
          content:
            'Great! This is the LLVM IR (Intermediate Representation) - the low-level code that SVF analyses. The IR shows how your C code is transformed for analysis.',
          targetElement: '#graph-page-output-container',
        },
      ],
      clickMessage: 'Click the LLVMIR tab to continue',
    },

    // Step 11: CodeGPT Tab
    {
      title: 'CodeGPT AI Assistant',
      content: "CodeGPT is your AI-powered code analysis assistant. Let's explore it!",
      targetElement: '.output-menu-bar',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      requireOutput: 'CodeGPT',
      subSteps: [
        {
          content: "Click on the 'CodeGPT' tab to open the AI assistant.",
          targetElement: '.output-menu-bar',
          requireClick: true,
          allowInteraction: true,
          requireOutput: 'CodeGPT',
        },
        {
          content:
            'This is CodeGPT! You can ask questions about your code, get explanations of analysis results, and receive suggestions.',
          targetElement: '#graph-page-output-container',
        },
        {
          content:
            'Try it out! Click one of the suggestion buttons (e.g., "Explain the code") or type your own question in the input box below. Then click the Send button to submit your message. You\'ll see the response appear above. Note: You\'ll need an OpenAI API key configured in Settings for actual AI responses.',
          targetElement: '#graph-page-output-container',
          allowInteraction: true,
          requireClick: true,
          clickMessage: 'Click the Send button to continue',
        },
      ],
      clickMessage: 'Click the CodeGPT tab to continue',
    },

    // New: Terminal (placed after CodeGPT)
    {
      title: 'Interactive Terminal',
      content:
        'Open the built-in Terminal to run shell commands in the analysis environment. Core backend files are protected from edits.',
      targetElement: '.output-menu-bar',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      requireOutput: 'Terminal',
      subSteps: [
        {
          content: "Click on the 'Terminal' tab to open the interactive shell.",
          targetElement: '.output-menu-bar',
          requireClick: true,
          allowInteraction: true,
          requireOutput: 'Terminal',
        },
        {
          content:
            'This is a real shell connected to the backend. Try commands like `ls`, `pwd`, or `clang --version`. Use Clear/Reconnect from the header if needed.',
          targetElement: '#graph-page-output-container',
        },
        {
          content:
            "You can also send your current editor code to the Terminal. Use 'Paste Code' to insert it into the shell input (not executed), or 'Write code to terminal' to create a file.",
          targetElement: '#real-terminal-header',
        },
        {
          content: "Click 'Write code to terminal' to send your editor code to the terminal.",
          targetElement: '#terminal-write-file-btn',
          requireClick: true,
          allowInteraction: true,
        },
        {
          content:
            'Great! Now, you can perform actions such as compiling it manually, shell commands or uploading it to git. ',
          targetElement: '#graph-page-output-container',
          allowInteraction: true,
        },
      ],
      clickMessage: 'Click the `Write code to terminal` button to continue',
    },

    // Step 12: Keyboard Shortcuts Button
    {
      title: 'Keyboard Shortcuts',
      content:
        'Click the keyboard icon to view, and edit, all available keyboard shortcuts! These can speed up your workflow significantly!',
      targetElement: '#shortcuts-icon',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
    },

    // Step 13: Import/Export
    {
      title: 'Import & Export Code',
      content:
        'Use the import icon to load .c files from your computer, or the export icon to save your code locally. Great for working with existing projects!',
      targetElement: '#export-icon, #import-icon',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
    },

    // Step 14: Share Feature
    {
      title: 'Share Your Work',
      content:
        'Click the share icon to generate a link to your current session. Share it with teammates or use it to demonstrate your analysis to others. The link includes your code, settings, and results!',
      targetElement: '#share-icon',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
    },

    // Step 15: Settings
    {
      title: 'Settings & Customization',
      content:
        'In Settings, you can:\n• Adjust font sizes for the code editor\n• Configure LLVM IR font size\n• Set terminal output font size\n• Add your OpenAI API key for CodeGPT\n\nFeel free to explore these options, then close the settings to continue.',
      targetElement: '#settings-icon',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
      allowInteraction: true,
    },

    // Step 16: Help Button
    {
      title: 'Need Help?',
      content:
        'Click the help icon (?) anytime to replay this tutorial. You can also visit the About page for documentation and community resources.',
      targetElement: '#help-icon',
      position: 'top',
      forcePreferredSide: true,
      arrow: true,
      highlightPulse: true,
    },

    // Step 17: Final
    {
      title: "You're Ready to Go! 🚀",
      content:
        'Great job! You now know how to use WebSVF 6.0.\n\nQuick recap:\n✓ Write code in the editor\n✓ Select compiler & analysis options\n✓ Run analysis and view results\n✓ Switch between different output tabs\n✓ Share, import, and export your work\n✓ Customize keyboard shortcuts\n\nStart analysing your code now, or replay this tutorial anytime!',
      position: 'center',
    },
  ];
};
