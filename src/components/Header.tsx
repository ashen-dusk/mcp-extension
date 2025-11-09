import { Button } from './ui/button';
import { RefreshCw, MessageSquare, ExternalLink, Sparkles, LogOut, Loader2 } from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    image: string;
  };
  onServers?: () => void;
  onRefresh?: () => void;
  onChat?: () => void;
  onWeb?: () => void;
  onWhatsNext?: () => void;
  onLogout: () => void;
  refreshing?: boolean;
  currentView?: 'servers' | 'chat' | 'whatsnext';
}

export function Header({
  user,
  onServers,
  onRefresh,
  onChat,
  onWeb,
  onWhatsNext,
  onLogout,
  refreshing = false,
  currentView = 'servers'
}: HeaderProps) {
  const openFullApp = () => {
    chrome.tabs.create({ url: 'https://www.mcp-assistant.in' });
  };

  const handleWebClick = () => {
    if (onWeb) {
      onWeb();
    } else {
      openFullApp();
    }
  };

  return (
    <div className="border-b bg-gradient-to-r from-background to-muted/20">
      {/* Top Row - Branding & Profile */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MCP Assistant
            </h1>
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || user.email}
                className="w-7 h-7 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {user?.name || user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="px-4 pb-3 flex justify-center">
        <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
          {currentView === 'servers' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-4"
                onClick={onRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-4"
                onClick={onChat}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-xs">Chat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-4"
                onClick={handleWebClick}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="text-xs">Web</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-4"
                onClick={onWhatsNext}
              >
                <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                <span className="text-xs">What's Next</span>
              </Button>
            </>
          ) : (
            <>
              {onServers && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-4"
                  onClick={onServers}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="text-xs">Servers</span>
                </Button>
              )}
              {currentView !== 'chat' && onChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-4"
                  onClick={onChat}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-xs">Chat</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-4"
                onClick={handleWebClick}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="text-xs">Web</span>
              </Button>
              {currentView !== 'whatsnext' && onWhatsNext && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-4"
                  onClick={onWhatsNext}
                >
                  <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                  <span className="text-xs">What's Next</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
