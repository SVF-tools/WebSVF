import React, { useState, useRef, useEffect, useCallback } from 'react';
import { doOpenAICall } from '../../services/openAIService';
import styles from './codeGPT.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CodeGPT = ({
  code,
  graphs = {},
  terminalOutput,
  llvmIR,
  savedMessages,
  onSaveMessages,
  passedPrompt,
}: {
  code: string;
  graphs: Record<string, string>;
  terminalOutput: string;
  llvmIR: string;
  savedMessages: { role: string; content: string }[];
  onSaveMessages: (messages: { role: string; content: string }[]) => void;
  passedPrompt: string;
}) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [gptInputQuery, setGptInputQuery] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState('code');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [syntaxTheme, setSyntaxTheme] = useState(oneLight);
  type Attachment = {
    type: 'code' | 'graph' | 'llvm' | 'terminal';
    name?: string;
    context: string;
    pillHtml: string;
  };
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);

  // Load messages from props
  useEffect(() => {
    setMessages(savedMessages || []);
  }, [savedMessages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  };

  // Check scroll position and show/hide scroll button
  const handleScroll = () => {
    if (responseContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = responseContainerRef.current;
      // Show button if not at bottom (with some margin)
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 50;
      setShowScrollToBottom(isNotAtBottom);
    }
  };

  // Always scroll to bottom when component mounts or becomes visible
  useEffect(() => {
    // Scroll to bottom when component mounts
    scrollToBottom();

    // Set up resize observer to handle layout changes
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    const containerEl = responseContainerRef.current;
    if (containerEl) {
      resizeObserver.observe(containerEl);
      containerEl.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerEl) {
        resizeObserver.unobserve(containerEl);
        containerEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Keep code block theme in sync with app theme
  useEffect(() => {
    const updateSyntaxTheme = () => {
      const mode =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setSyntaxTheme(mode === 'dark' ? vscDarkPlus : oneLight);
    };
    updateSyntaxTheme();
    const observer = new MutationObserver(updateSyntaxTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  // Scroll to bottom whenever tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Small delay to ensure DOM is rendered
        setTimeout(scrollToBottom, 50);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Allow language- class on code/pre for syntax highlighting when sanitized
  const sanitizeSchema = React.useMemo(() => {
    const schema = {
      ...(defaultSchema as unknown as Record<string, unknown>),
    } as Record<string, unknown> & {
      attributes?: Record<string, unknown> & { code?: unknown[]; pre?: unknown[] };
    };
    schema.attributes = schema.attributes || {};
    const codeAttrs = (schema.attributes.code as unknown[] | undefined) || [];
    const preAttrs = (schema.attributes.pre as unknown[] | undefined) || [];
    (schema.attributes as Record<string, unknown> & { code?: unknown[]; pre?: unknown[] }).code = [
      ...codeAttrs,
      ['className', /^language-[\w-]+$/],
    ];
    (schema.attributes as Record<string, unknown> & { code?: unknown[]; pre?: unknown[] }).pre = [
      ...preAttrs,
      ['className', /^language-[\w-]+$/],
    ];
    // Allow pills rendered as spans with classes and data- attributes
    const spanAttrs = (schema.attributes.span as unknown[] | undefined) || [];
    (schema.attributes as Record<string, unknown> & { span?: unknown[] }).span = [
      ...spanAttrs,
      ['className', /^(attachmentPill|attachmentPill--(code|graph|llvm|terminal))(\s.*)?$/],
      ['data-type'],
      ['data-name'],
      ['title'],
    ];
    return schema;
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // When messages change, scroll to bottom
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    // If there are staged attachments, send them with the visible prompt and pills
    if (pendingAttachments.length > 0) {
      const visiblePrompt = gptInputQuery.trim();
      if (!visiblePrompt) return;

      const pills = pendingAttachments.map((a) => a.pillHtml).join(' ');
      const userDisplay = `${visiblePrompt}\n\n${pills}`;
      const updatedMessages = [
        ...messages,
        { role: 'user', content: userDisplay },
        { role: 'assistant', content: 'Loading response...' },
      ];
      setMessages(updatedMessages);
      onSaveMessages(updatedMessages);

      try {
        const combinedContext = pendingAttachments.map((a) => a.context).join('\n\n');
        // Include full history (without the temporary loading message)
        const history = messages.filter((m) => m.content !== 'Loading response...');
        const response = await doOpenAICall(
          [...history, { role: 'user', content: visiblePrompt }],
          undefined,
          combinedContext
        );
        const assistantMessage = {
          role: 'assistant',
          content: response.choices[0].message.content,
        };
        const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage];
        setMessages(finalMessages);
        onSaveMessages(finalMessages);
      } catch (error: unknown) {
        const err = error as { message?: string };
        const errorMessage = {
          role: 'assistant',
          content: 'Error: ' + (err?.message || 'Unknown error'),
        };
        const errorMessages = [...updatedMessages.slice(0, -1), errorMessage];
        setMessages(errorMessages);
        onSaveMessages(errorMessages);
      }

      setPendingAttachments([]);
      setGptInputQuery('');
      setTimeout(scrollToBottom, 100);
      return;
    }

    // No attachment: normal text send
    await callChatGPT(gptInputQuery);
  };

  const callChatGPT = useCallback(
    async (inputOrContext: string, asHiddenContext = false) => {
      if (!inputOrContext.trim()) return;

      const userInput = asHiddenContext ? '' : inputOrContext;
      const context = asHiddenContext ? inputOrContext : undefined;

      const updatedMessages = userInput
        ? [
            ...messages,
            { role: 'user', content: userInput },
            { role: 'assistant', content: 'Loading response...' },
          ]
        : [...messages, { role: 'assistant', content: 'Loading response...' }];

      // Update local state and parent immediately
      setMessages(updatedMessages);
      onSaveMessages(updatedMessages);

      setGptInputQuery('');

      try {
        // Include full history (without the temporary loading message)
        const history = messages.filter((m) => m.content !== 'Loading response...');
        const response = await doOpenAICall(
          userInput ? [...history, { role: 'user', content: userInput }] : [...history],
          undefined,
          context
        );
        const assistantMessage = {
          role: 'assistant',
          content: response.choices[0].message.content,
        };
        const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage];

        setMessages(finalMessages);
        onSaveMessages(finalMessages);
      } catch (error: unknown) {
        const err = error as { message?: string };
        const errorMessage = {
          role: 'assistant',
          content: 'Error: ' + (err?.message || 'Unknown error'),
        };
        const errorMessages = [...updatedMessages.slice(0, -1), errorMessage];
        setMessages(errorMessages);
        onSaveMessages(errorMessages);
      }

      setTimeout(scrollToBottom, 100);
    },
    [messages, onSaveMessages]
  );

  // Removed unused helper (sending handled in handleSubmit)

  // Ensure a single stage per passedPrompt value (no auto-send)
  const lastPromptRef = useRef<string>('');
  const isProcessingPromptRef = useRef(false);
  useEffect(() => {
    if (!passedPrompt) return;
    if (isProcessingPromptRef.current) return;
    if (lastPromptRef.current === passedPrompt) return;

    isProcessingPromptRef.current = true;
    lastPromptRef.current = passedPrompt;
    try {
      // Support special graph attach syntax: ATTACH_GRAPH::graphKey\n<visiblePrompt>
      const attachGraphPrefix = 'ATTACH_GRAPH::';
      if (passedPrompt.startsWith(attachGraphPrefix)) {
        const rest = passedPrompt.slice(attachGraphPrefix.length);
        const firstNl = rest.indexOf('\n');
        const graphKey = firstNl === -1 ? rest.trim() : rest.slice(0, firstNl).trim();
        const visiblePrompt = firstNl === -1 ? 'Explain the graph' : rest.slice(firstNl + 1);
        const graphDot = graphs?.[graphKey] || '';
        if (graphDot) {
          setGptInputQuery(visiblePrompt);
          setPendingAttachments((prev) => {
            const next: Attachment[] = prev.slice();
            const exists = next.some((a) => a.type === 'graph' && a.name === graphKey);
            if (!exists) {
              next.push({
                type: 'graph',
                name: graphKey,
                context: `### Graph (${graphKey})\n${graphDot}`,
                pillHtml: `<span class='attachmentPill attachmentPill--graph' data-type='graph' data-name='${graphKey}' title='Attached ${graphKey} graph'>📎 Graph: ${graphKey}</span>`,
              });
            }
            return next;
          });
        } else {
          setGptInputQuery(visiblePrompt);
          setPendingAttachments((prev) => prev);
        }
      } else if (/```[\s\S]*```/.test(passedPrompt)) {
        // Treat as code attachment: strip code block from prompt, attach current code as context
        const visiblePrompt =
          passedPrompt.replace(/```[\s\S]*?```/g, '').trim() || 'Explain the code';
        setGptInputQuery(visiblePrompt);
        setPendingAttachments((prev) => {
          const exists = prev.some((a) => a.type === 'code');
          if (exists) return prev;
          return [
            ...prev,
            {
              type: 'code',
              context: `### Code\n${code}`,
              pillHtml:
                "<span class='attachmentPill attachmentPill--code' data-type='code' title='Attached program code'>📎 Code attached</span>",
            },
          ];
        });
      } else {
        // Plain prompt: stage into the input without sending
        setGptInputQuery(passedPrompt);
        setPendingAttachments((prev) => prev);
      }
    } finally {
      isProcessingPromptRef.current = false;
    }
    // Intentionally exclude callChatGPT to avoid refiring due to its identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [gptInputQuery]);

  // Removed: inlined code/graph in messages is replaced by attachment pills

  // Deprecated: replaced by sendUserMessageWithContext in suggestions

  const handleReset = () => {
    setMessages([]);
    onSaveMessages([]);
  };

  const handleResetClick = () => {
    if (confirm('Reset this conversation? This will clear all messages.')) {
      handleReset();
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  const renderMessageContent = (content: string, role: string) => {
    return (
      <div className={styles[role === 'user' ? 'userMessage' : 'assistantMessage']}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || '');
              const raw = String(children);
              if (!inline) {
                const lang = match?.[1] || 'text';
                return (
                  <SyntaxHighlighter
                    // react-syntax-highlighter language typing is broad; cast to string to avoid any
                    language={lang as unknown as string}
                    style={syntaxTheme as unknown as { [key: string]: React.CSSProperties }}
                    className={styles.syntaxHighlighter}
                    {...(props as Record<string, unknown>)}
                  >
                    {raw.replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              return <code className={styles.inlineCode}>{children}</code>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Stage attachment (do not send) and place pill preview
  const stageAttachment = (
    visiblePrompt: string,
    type: 'code' | 'graph' | 'llvm' | 'terminal',
    context: string,
    name?: string
  ) => {
    const pillHtml =
      type === 'graph'
        ? `<span class='attachmentPill attachmentPill--graph' data-type='graph' data-name='${
            name ?? ''
          }' title='Attached ${name ?? 'graph'}'>📎 Graph: ${name ?? ''}</span>`
        : type === 'code'
        ? "<span class='attachmentPill attachmentPill--code' data-type='code' title='Attached program code'>📎 Code attached</span>"
        : type === 'llvm'
        ? "<span class='attachmentPill attachmentPill--llvm' data-type='llvm' title='Attached LLVM IR'>📎 LLVM IR attached</span>"
        : "<span class='attachmentPill attachmentPill--terminal' data-type='terminal' title='Attached terminal output'>📎 Terminal output attached</span>";
    setGptInputQuery(visiblePrompt);
    setPendingAttachments((prev) => {
      // De-dupe: unique by (type, name) where name may be undefined
      const exists = prev.some((a) => a.type === type && a.name === name);
      if (exists) return prev;
      return [...prev, { type, name, context, pillHtml }];
    });
  };

  const removeAttachment = (attachment: Attachment) => {
    setPendingAttachments((prev) =>
      prev.filter(
        (a) =>
          !(
            a.type === attachment.type &&
            a.name === attachment.name &&
            a.context === attachment.context
          )
      )
    );
  };

  const renderSuggestions = () => {
    switch (suggestionCategory) {
      case 'code':
        return (
          <>
            {code && (
              <button
                onClick={() => stageAttachment('Explain the code', 'code', `### Code\n${code}`)}
                className={styles.suggestionButton}
              >
                Explain the code
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  stageAttachment(
                    'What improvements can be made to the code?',
                    'code',
                    `### Code\n${code}`
                  )
                }
                className={styles.suggestionButton}
              >
                Suggest improvements
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  stageAttachment('Are there any bugs in my code?', 'code', `### Code\n${code}`)
                }
                className={styles.suggestionButton}
              >
                Find bugs
              </button>
            )}
          </>
        );
      case 'graphs':
        return (
          <>
            {Object.keys(graphs).map((graph) => (
              <button
                key={graph}
                onClick={() =>
                  stageAttachment(
                    `Explain the ${graph} graph`,
                    'graph',
                    `### Graph (${graph})\n${graphs[graph]}`,
                    graph
                  )
                }
                className={styles.suggestionButton}
              >
                Explain {graph}
              </button>
            ))}
            {code && (
              <button
                onClick={() =>
                  stageAttachment(
                    'Looking at the graphs, can I make any improvements to the code?',
                    'code',
                    `### Code\n${code}`
                  )
                }
                className={styles.suggestionButton}
              >
                Improvements from graphs
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  stageAttachment(
                    'Are there any dead functions in my code?',
                    'code',
                    `### Code\n${code}`
                  )
                }
                className={styles.suggestionButton}
              >
                Find dead functions
              </button>
            )}
          </>
        );
      case 'terminal':
        return (
          <>
            {terminalOutput !== 'Run the code to see the terminal output here' && (
              <button
                onClick={() =>
                  stageAttachment(
                    'Explain the terminal output',
                    'terminal',
                    `### Terminal Output\n${terminalOutput}`
                  )
                }
                className={styles.suggestionButton}
              >
                Explain terminal output
              </button>
            )}
          </>
        );
      case 'llvm':
        return (
          <>
            {llvmIR !== 'Run the code to see the LLVM IR of your here' && (
              <button
                onClick={() =>
                  stageAttachment('Explain the LLVM IR', 'llvm', `### LLVM IR\n${llvmIR}`)
                }
                className={styles.suggestionButton}
              >
                Explain LLVM IR
              </button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.codegptContainer}>
      <div className={styles.codegptResponse} ref={responseContainerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageRow} ${
              message.role === 'user' ? styles.user : styles.assistant
            }`}
          >
            <div className={styles.message}>
              {message.role === 'assistant' && <div className={styles.assistantLabel}>CodeGPT</div>}
              <button
                className={styles.copyButton}
                title="Copy message"
                onClick={() => handleCopy(message.content)}
              >
                <ContentCopyIcon fontSize="small" />
              </button>
              {renderMessageContent(message.content, message.role)}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button
          className={styles.scrollToBottomButton}
          onClick={scrollToBottom}
          title="Jump to bottom"
        >
          <KeyboardDoubleArrowDownIcon />
        </button>
      )}

      <div className={styles.stickyContainer}>
        <div className={styles.suggestionCategory}>
          <button
            onClick={() => setSuggestionCategory('code')}
            className={`${styles.suggestionCategoryButton} ${
              suggestionCategory === 'code' ? styles.active : ''
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setSuggestionCategory('graphs')}
            className={`${styles.suggestionCategoryButton} ${
              suggestionCategory === 'graphs' ? styles.active : ''
            }`}
          >
            Graphs
          </button>
          <button
            onClick={() => setSuggestionCategory('terminal')}
            className={`${styles.suggestionCategoryButton} ${
              suggestionCategory === 'terminal' ? styles.active : ''
            }`}
          >
            Terminal Output
          </button>
          <button
            onClick={() => setSuggestionCategory('llvm')}
            className={`${styles.suggestionCategoryButton} ${
              suggestionCategory === 'llvm' ? styles.active : ''
            }`}
          >
            LLVM IR
          </button>
        </div>
        <div className={styles.suggestions}>{renderSuggestions()}</div>
        <div className={styles.codegptInputContainer}>
          <div className={styles.inputLeft}>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Enter your query here..."
              value={gptInputQuery}
              onChange={(e) => setGptInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.codegptTextarea}
            />
            {pendingAttachments.length > 0 && (
              <div className={styles.attachmentPreview}>
                {pendingAttachments.map((a, idx) => (
                  <span
                    key={`${a.type}:${a.name ?? ''}:${idx}`}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <ReactMarkdown rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}>
                      {a.pillHtml}
                    </ReactMarkdown>
                    <button
                      type="button"
                      className={styles.attachmentRemoveButton}
                      title="Remove attachment"
                      onClick={() => removeAttachment(a)}
                      aria-label="Remove attachment"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.inputActions}>
            <button
              onClick={handleResetClick}
              className={`${styles.iconActionButton} ${styles.iconResetButton}`}
              title="Reset conversation"
            >
              <RefreshIcon fontSize="medium" />
            </button>
            <button
              id="codegpt-send-button"
              onClick={handleSubmit}
              className={`${styles.iconActionButton} ${styles.iconSendButton}`}
              ref={buttonRef}
              title="Send"
              disabled={!gptInputQuery.trim()}
              aria-disabled={!gptInputQuery.trim()}
            >
              <SendIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGPT;
