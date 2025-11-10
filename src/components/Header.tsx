import { Button } from './ui/button';
import { RefreshCw, MessageSquare, ExternalLink, Sparkles, LogOut, Loader2, Home } from 'lucide-react';

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
      <div className="px-4 pt-4 pb-2 flex items-center justify-between min-w-0">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          <div className="w-8 h-8 flex items-center justify-center shadow-lg flex-shrink-0">
          <img
                src={'/icons/icon-128.png'}
                alt={'MCP Assistant Logo'}
                className="w-8 h-8 rounded-lg object-cover border-2 border-primary/20"
              />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-bold bg-white bg-clip-text text-transparent whitespace-nowrap">
              MCP Assistant
            </h1>
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || user.email}
                className="w-7 h-7 rounded-full object-cover border-2 border-primary/20 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {user?.name || user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="px-2 pb-2 flex justify-center">
        <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5 overflow-x-auto max-w-full">
          {currentView === 'servers' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 bg-accent whitespace-nowrap flex-shrink-0"
                onClick={onServers}
              >
                <Home className="h-3 w-3 mr-0.5" />
                <span className="text-[10px]">MCP's</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                onClick={onChat}
              >
                <MessageSquare className="h-3 w-3 mr-0.5" />
                <span className="text-[10px]">Chat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                onClick={handleWebClick}
              >
                <ExternalLink className="h-3 w-3 mr-0.5" />
                <span className="text-[10px]">Web</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                onClick={onWhatsNext}
              >
                <Sparkles className="h-3 w-3 mr-0.5 text-purple-500" />
                <span className="text-[10px]">What's Next</span>
              </Button>
            </>
          ) : (
            <>
              {onServers && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                  onClick={onServers}
                >
                  <Home className="h-3 w-3 mr-0.5" />
                  <span className="text-[10px]">MCP's</span>
                </Button>
              )}
              {currentView !== 'chat' && onChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                  onClick={onChat}
                >
                  <MessageSquare className="h-3 w-3 mr-0.5" />
                  <span className="text-[10px]">Chat</span>
                </Button>
              )}
              {currentView === 'chat' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 bg-accent whitespace-nowrap flex-shrink-0"
                  disabled
                >
                  <MessageSquare className="h-3 w-3 mr-0.5" />
                  <span className="text-[10px]">Chat</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                onClick={handleWebClick}
              >
                <ExternalLink className="h-3 w-3 mr-0.5" />
                <span className="text-[10px]">Web</span>
              </Button>
              {currentView !== 'whatsnext' && onWhatsNext && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                  onClick={onWhatsNext}
                >
                  <Sparkles className="h-3 w-3 mr-0.5 text-purple-500" />
                  <span className="text-[10px]">What's Next</span>
                </Button>
              )}
              {currentView === 'whatsnext' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 bg-accent whitespace-nowrap flex-shrink-0"
                  disabled
                >
                  <Sparkles className="h-3 w-3 mr-0.5 text-purple-500" />
                  <span className="text-[10px]">What's Next</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
