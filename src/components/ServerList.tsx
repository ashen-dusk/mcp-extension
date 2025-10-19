import { useState } from 'react';
import { McpServer } from '@/types';
import { ServerCard } from './ServerCard';
import { Button } from './ui/button';
import { ExternalLink, RefreshCw, LogOut, Loader2, MessageSquare } from 'lucide-react';
import { BACKEND_URL } from '@/lib/utils';

interface ServerListProps {
  servers: McpServer[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onRestart: (serverName: string) => Promise<any>;
  // COMMENTED OUT: Delete feature
  // onDelete: (serverName: string) => Promise<any>;
  onConnect: (serverName: string) => Promise<any>;
  onDisconnect: (serverName: string) => Promise<any>;
  onToggleContext: (serverName: string, enabled: boolean) => Promise<any>;
  onLogout: () => Promise<void>;
  onOpenChat: () => void;
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

export function ServerList({
  servers,
  loading,
  onRefresh,
  onRestart,
  // COMMENTED OUT: Delete feature
  // onDelete,
  onConnect,
  onDisconnect,
  onToggleContext,
  onLogout,
  onOpenChat,
  user,
}: ServerListProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleRestart = async (serverName: string) => {
    await onRestart(serverName);
  };

  const handleConnect = async (serverName: string) => {
    await onConnect(serverName);
  };

  const handleDisconnect = async (serverName: string) => {
    await onDisconnect(serverName);
  };

  const handleToggleContext = async (serverName: string, enabled: boolean) => {
    await onToggleContext(serverName, enabled);
  };

  // COMMENTED OUT: Delete handler
  // const handleDelete = async (serverName: string) => {
  //   if (confirm(`Are you sure you want to delete "${serverName}"?`)) {
  //     await onDelete(serverName);
  //   }
  // };

  const openFullApp = () => {
    chrome.tabs.create({ url: BACKEND_URL });
  };

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold">MCP Assistant</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Refresh
          </Button>
          <Button variant="default" size="sm" onClick={onOpenChat}>
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat
          </Button>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={openFullApp}>
          <ExternalLink className="h-3 w-3 mr-1" />
          Open Full App
        </Button>
      </div>

      {/* Server List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <h3 className="font-medium text-sm mb-1">No MCP Servers</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Open the full app to add and configure your MCP servers
            </p>
            <Button size="sm" onClick={openFullApp}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Go to Full App
            </Button>
          </div>
        ) : (
          servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onRestart={handleRestart}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onToggleContext={handleToggleContext}
            />
          ))
        )}
      </div>
    </div>
  );
}
