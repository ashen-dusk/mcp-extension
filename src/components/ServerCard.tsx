import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { McpServer } from '@/types';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Server, Square, Brain, Loader2, Play, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

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
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-500/10 text-green-600 border border-green-500/20">
          <span className="w-1 h-1 rounded-full bg-green-500"></span>
          Connected
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-500/10 text-red-600 border border-red-500/20">
          <span className="w-1 h-1 rounded-full bg-red-500"></span>
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-500/10 text-gray-600 border border-gray-500/20">
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
        Disconnected
      </span>
    );
  };

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <div className="p-3">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {/* Left Side - Server Info & Actions */}
          <div className="min-w-[180px] space-y-3">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Server className="w-4 h-4 text-primary" />
                  </div>
                  {isConnected && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs truncate">{server.name}</h3>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-1 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Transport</span>
                <span>{server.transport.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Tools</span>
                <span>{server.tools.length}</span>
              </div>
              {server.url && (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">URL</span>
                  <span
                    className="flex-1 truncate max-w-[100px] cursor-pointer hover:text-foreground transition-colors"
                    title={`${server.url} (Click to copy)`}
                    onClick={() => {
                      navigator.clipboard.writeText(server.url!);
                    }}
                  >
                    {server.url}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {isConnected ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-6 text-[10px] px-2 justify-start"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Square className="h-3 w-3 mr-1" />
                    )}
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-6 text-[10px] px-2 justify-start"
                    onClick={handleConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    {isFailed ? 'Retry' : 'Connect'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-6 text-[10px] px-2 justify-start"
                  onClick={handleRestart}
                  disabled={!isConnected || isRestarting}
                >
                  {isRestarting ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3 mr-1" />
                  )}
                  Restart
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 px-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-3 w-3 text-blue-400 flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground">Context</span>
                  <Switch
                    checked={server.enabled}
                    onCheckedChange={handleContextToggle}
                    disabled={!isConnected || isTogglingContext}
                    className="scale-75"
                  />
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Right Side - Description */}
          <div className="flex items-start py-1">
            {server.description ? (
              <div className="flex-1">
                <div className={`text-[11px] leading-relaxed text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
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
                {server.description.length > 150 && (
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
              <p className="text-[10px] text-muted-foreground truncate">{server.url}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground italic">No description available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
