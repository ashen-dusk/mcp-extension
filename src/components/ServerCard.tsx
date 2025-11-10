import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { McpServer } from '@/types';
import { Button } from './ui/button';
import { Server, Square, Brain, Loader2, Play, RotateCcw, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface ServerCardProps {
  server: McpServer;
  onRestart: (serverName: string) => Promise<void>;
  onConnect: (serverName: string) => Promise<void>;
  onDisconnect: (serverName: string) => Promise<void>;
  onToggleContext: (serverName: string, enabled: boolean) => Promise<void>;
}

export function ServerCard({ server, onRestart, onConnect, onDisconnect, onToggleContext }: ServerCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isTogglingContext, setIsTogglingContext] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const isConnected = server.connectionStatus === 'CONNECTED';
  const isFailed = server.connectionStatus === 'FAILED';

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(server.name);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect(server.name);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      await onRestart(server.name);
    } finally {
      setIsRestarting(false);
    }
  };

  const handleContextToggle = async (checked: boolean) => {
    setIsTogglingContext(true);
    try {
      await onToggleContext(server.name, checked);
    } finally {
      setIsTogglingContext(false);
    }
  };

  const getStatusBadge = () => {
    if (isConnected) {
      return (
        <span className="text-[9px] font-medium text-green-500">
          Connected
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="text-[9px] font-medium text-red-500">
          Failed
        </span>
      );
    }
    return (
      <span className="text-[9px] font-medium text-gray-500">
        Disconnected
      </span>
    );
  };

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <div className="py-1">
        <div className="grid grid-cols-[minmax(130px,160px)_1fr] gap-3">
          {/* Left Side - Server Info & Actions */}
          <div className="space-y-2 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                {isConnected && (
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Server className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
              {server.requiresOauth2 ? (
                <span className="text-[8px] font-medium text-orange-400 flex-shrink-0">
                  OAuth
                </span>
              ) : (
                <span className="text-[8px] font-medium text-blue-400 flex-shrink-0">
                  Open
                </span>
              )}
            </div>

            <h3 className="font-semibold text-xs break-words leading-tight">{server.name}</h3>

            {/* Metadata */}
            <div className="space-y-1 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-medium text-[9px]">Transport</span>
                <span className="text-[9px]">{server.transport.toUpperCase()}</span>
              </div>
              {server.url && (
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-medium flex-shrink-0 text-[9px]">URL</span>
                  <span
                    className="flex-1 truncate cursor-pointer hover:text-foreground transition-colors min-w-0 text-[8px]"
                    title={`${server.url} (Click to copy)`}
                    onClick={() => {
                      navigator.clipboard.writeText(server.url!);
                      setUrlCopied(true);
                      setTimeout(() => setUrlCopied(false), 2000);
                    }}
                  >
                    {server.url}
                  </span>
                  {urlCopied && (
                    <Check className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              )}
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => setShowTools(!showTools)}
                title="Click to view tools schema"
              >
                <span className="font-medium text-[9px]">Tools</span>
                <span className="text-[9px]">{server.tools.length}</span>
                {showTools ? (
                  <ChevronUp className="h-2.5 w-2.5" />
                ) : (
                  <ChevronDown className="h-2.5 w-2.5" />
                )}
              </div>
            </div>

            {/* Tools Schema - Shown below left column */}
            {showTools && server.tools.length > 0 && (
              <div className="rounded p-1.5 max-h-32 overflow-y-auto bg-muted/20 w-full">
                <div className="space-y-1.5">
                  {server.tools.map((tool, idx) => (
                    <div key={idx} className="text-[9px] space-y-0.5 pb-1.5 border-b border-border/20 last:border-b-0 last:pb-0">
                      <div className="font-semibold text-foreground break-words">{tool.name}</div>
                      {tool.description && (
                        <div className="text-muted-foreground italic break-words text-[8px]">{tool.description}</div>
                      )}
                      {tool.schema && (
                        <pre className="bg-muted p-1 rounded-sm text-[7px] overflow-x-auto whitespace-pre-wrap break-all w-full">
                          {JSON.stringify(tool.schema, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions - Back on Left Side */}
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {isConnected ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-6 text-[10px] px-1 justify-start"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
                    ) : (
                      <Square className="h-3 w-3 mr-0.5" />
                    )}
                    <span className="text-[9px]">Disconnect</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-6 text-[10px] px-1 justify-start"
                    onClick={handleConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3 mr-0.5" />
                    )}
                    <span className="text-[9px]">{isFailed ? 'Retry' : 'Connect'}</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-6 text-[10px] px-1.5 justify-start"
                  onClick={handleRestart}
                  disabled={!isConnected || isRestarting}
                >
                  {isRestarting ? (
                    <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3 mr-0.5" />
                  )}
                  <span className="text-[9px]">Restart</span>
                </Button>
              </div>
              <div className="flex items-center justify-between gap-1 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={server.enabled}
                    onChange={(e) => handleContextToggle(e.target.checked)}
                    disabled={!isConnected || isTogglingContext}
                    className="w-3 h-3 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Brain className="h-3 w-3 text-blue-400 flex-shrink-0" />
                  <span className="text-[9px] text-muted-foreground">Context</span>
                </label>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Right Side - Description Only */}
          <div className="flex items-start py-1 min-w-0">
            {server.description ? (
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] leading-relaxed text-muted-foreground break-words ${!isExpanded ? 'line-clamp-5' : ''}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="mb-1 last:mb-0 ml-3 list-disc">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-1 last:mb-0 ml-3 list-decimal">{children}</ol>,
                      li: ({ children }) => <li className="mb-0.5">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground/80">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">{children}</code>,
                      a: ({ children, href }) => (
                        <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      h1: ({ children }) => <h1 className="text-sm font-bold mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xs font-bold mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xs font-semibold mb-1">{children}</h3>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/30 pl-2 italic">{children}</blockquote>,
                    }}
                  >
                    {server.description}
                  </ReactMarkdown>
                </div>
                {server.description.length > 200 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Expand <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : server.url ? (
              <p className="text-[10px] text-muted-foreground truncate min-w-0">{server.url}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground italic min-w-0">No description available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
