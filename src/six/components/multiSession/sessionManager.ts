export type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';
export type Language = 'c' | 'cpp';

export interface LabeledOption {
  value: string;
  label: string;
}

export interface Shortcuts {
  save: string;
  run: string;
  toggle_sidebar: string;
  import: string;
  light_mode: string;
  dark_mode: string;
}

export interface Session {
  id: string;
  title: string;
  lastUpdated: number;
  code: string;
  selectedCompileOptions: LabeledOption[];
  selectedExecutableOptions: LabeledOption[];
  lineNumDetails: { [key: string]: { nodeOrllvm: string[]; colour: string } };
  graphs: Record<string, string>;
  terminalOutput: string;
  llvmIR: string;
  savedMessages: { role: string; content: string }[];
  currentOutput: OutputType; // Now using the defined type
  lineNumToHighlight: number[];
  tabPositions: Record<OutputType, string>;
  language: Language;
}

const SessionManager = {
  // Get all sessions
  getSessions: (): Session[] => {
    const raw = localStorage.getItem('websvf-sessions');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      // Ensure we always return an array and that each session has a language (migrate older sessions)
      if (!Array.isArray(parsed)) return [];
      return parsed.map((s: any) => ({
        ...s,
        language: s.language || 'c',
      })) as Session[];
    } catch {
      // If parsing fails (corrupted storage), reset the key and return [] to avoid crashes
      localStorage.removeItem('websvf-sessions');
      return [];
    }
  },

  // Get a specific session
  getSession: (sessionId: string): Session | null => {
    const sessions = SessionManager.getSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  },

  // Create a new session
  createSession: (title = 'New Project'): Session => {
    const sessions = SessionManager.getSessions();

    const defaultCode = `#include <stdio.h>
  #include <stdlib.h>
  
  typedef struct {
      int *data;
      int size;
  } IntArray;
  
  IntArray* createIntArray(int size) {
      IntArray *arr = malloc(sizeof(IntArray));
      arr->size = size;
      arr->data = malloc(size * sizeof(int));
      for (int i = 0; i < size; i++) {
          arr->data[i] = i; // Initialize the array
      }
      return arr;
  }
  
  void useIntArray(IntArray *arr) {
      for (int i = 0; i < arr->size; i++) {
          printf("%d ", arr->data[i]);
      }
      printf("\\n");
  }
  
  int main() {
      IntArray *array1 = createIntArray(5);
      IntArray *array2 = createIntArray(10);
  
      useIntArray(array1);
      useIntArray(array2);
  
      return 0;
  }`;

    const newSession: Session = {
      id: `session-${Date.now()}`,
      title,
      code: defaultCode,
      selectedCompileOptions: [
        { value: '-g', label: '-g' },
        { value: '-c', label: '-c' },
        { value: '-S', label: '-S' },
        { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
        { value: '-emit-llvm', label: '-emit-llvm' },
      ],
      selectedExecutableOptions: [],
      lineNumDetails: {},
      graphs: {},
      terminalOutput: 'Run the code to see the terminal output here',
      llvmIR: 'Run the code to see the LLVM IR of your here',
      savedMessages: [], // Initialize empty messages
      lastUpdated: Date.now(),
      currentOutput: 'Graph',
      lineNumToHighlight: [],
      tabPositions: {
        Graph: 'main',
        'Terminal Output': 'main',
        CodeGPT: 'main',
        LLVMIR: 'main',
        Terminal: 'main',
      },
      language: 'c',
    };

    sessions.unshift(newSession);
    localStorage.setItem('websvf-sessions', JSON.stringify(sessions));
    return newSession;
  },

  // Update an existing session
  updateSession: (sessionId: string, updates: Partial<Session>): Session | null => {
    const sessions = SessionManager.getSessions();
    const index = sessions.findIndex((s) => s.id === sessionId);

    if (index !== -1) {
      sessions[index] = {
        ...sessions[index],
        ...updates,
        lastUpdated: Date.now(),
      };
      localStorage.setItem('websvf-sessions', JSON.stringify(sessions));
      return sessions[index];
    }
    return null;
  },

  // Delete a session
  deleteSession: (sessionId: string): void => {
    let sessions = SessionManager.getSessions();
    sessions = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem('websvf-sessions', JSON.stringify(sessions));
  },
};

export default SessionManager;
