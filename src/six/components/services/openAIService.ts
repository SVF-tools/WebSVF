import OpenAI from 'openai';

// Support both Vite-style and generic env var names
const API_KEY = (process.env.REACT_APP_OPENAI_API_KEY || '') as string;
const DEFAULT_MODEL = 'gpt-5-mini';

// Create a browser-allowed client. The key is expected to be provided via Vite env.
const client = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export const doOpenAICall = async (
  messages: { role: string; content: string }[],
  model: string = DEFAULT_MODEL,
  context?: string
) => {
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
