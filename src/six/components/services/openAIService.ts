import OpenAI from 'openai';

const ENV_API_KEY = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_OPENAI_API_KEY ?? '') as string;
const DEFAULT_MODEL = 'gpt-5-mini';

const STORAGE_KEY = 'websvf-openai-api-key';

export const getApiKey = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    return stored || ENV_API_KEY || '';
  } catch {
    return ENV_API_KEY || '';
  }
};

export const setApiKey = (key: string) => {
  try {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  } catch {
    // no-op
  }
};

export const clearApiKey = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
};

export const hasUserApiKey = (): boolean => {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
};

export const doOpenAICall = async (
  messages: { role: string; content: string }[],
  model: string = DEFAULT_MODEL,
  context?: string
) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not set. Add it in Settings.');
  }

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Flatten chat messages into a single input string compatible with the Responses API
  const chatBlock = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const input = context
    ? [`### Context`, context.trim(), ``, `### Chat`, chatBlock].join('\n')
    : chatBlock;

  const request: Record<string, unknown> = {
    model,
    input,
  };

  request.tools = [{ type: 'web_search' }];
  request.tool_choice = 'auto';

  const response = await client.responses.create(request);

  const outputText = (response as unknown as { output_text?: string }).output_text ?? '';

  // Shim to match existing callers which expect chat-completions shape
  return {
    choices: [
      {
        message: {
          content: outputText,
        },
      },
    ],
  };
};
