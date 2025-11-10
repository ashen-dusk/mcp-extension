import { useState, useMemo } from 'react';
import { McpServer, Category } from '@/types';
import { ServerCard } from './ServerCard';
// import { CategorySection } from './CategorySection';
import { Button } from './ui/button';
import { Header } from './Header';
import { ExternalLink, RefreshCw, Loader2, Filter, X, ChevronDown } from 'lucide-react';

interface ServerListProps {
  servers: McpServer[];
  categories: Category[];
  loading: boolean;
  onRefresh: (categoryId?: string) => Promise<void>;
  onRestart: (serverName: string) => Promise<any>;
  // COMMENTED OUT: Delete feature
  // onDelete: (serverName: string) => Promise<any>;
  onConnect: (serverName: string) => Promise<any>;
  onDisconnect: (serverName: string) => Promise<any>;
  onToggleContext: (serverName: string, enabled: boolean) => Promise<any>;
  onLogout: () => Promise<void>;
  onOpenChat: () => void;
  onWhatsNext: () => void;
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

export function ServerList({
  servers,
  categories,
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
  onWhatsNext,
  user,
}: ServerListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Get top 10 recently added servers
  const displayServers = useMemo(() => {
    return [...servers]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 10);
  }, [servers]);

  // Handle category selection
  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowCategoryFilter(false);
    setFilterLoading(true);
    await onRefresh(categoryId);
    setFilterLoading(false);
  };

  const handleClearFilter = async () => {
    setSelectedCategoryId(null);
    setFilterLoading(true);
    await onRefresh();
    setFilterLoading(false);
  };

  const totalServers = servers.length;
  const connectedServers = servers.filter(s => s.connectionStatus === 'CONNECTED').length;

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
    chrome.tabs.create({ url: 'https://www.mcp-assistant.in' });
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <Header
        user={user}
        onRefresh={handleRefresh}
        onChat={onOpenChat}
        onWhatsNext={onWhatsNext}
        onLogout={onLogout}
        refreshing={refreshing}
        currentView="servers"
      />

      {/* Server List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Header with filter dropdown */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {/* <Filter className="h-3.5 w-3.5" /> */}
            <span>
              {selectedCategoryId
                ? `Filtered: ${categories.find(c => c.id === selectedCategoryId)?.name}`
                : 'Showing 10 recently added servers'}
            </span>
          </div>

          {/* Refresh and Filter buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[10px] gap-1 cursor-pointer hover:bg-accent"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>

            {/* Dropdown Filter */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[10px] gap-1"
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              >
                <Filter className="h-3 w-3" />
                {selectedCategoryId ? (
                  <span className="max-w-[80px] truncate">
                    {categories.find(c => c.id === selectedCategoryId)?.name}
                  </span>
                ) : (
                  <span>All Categories</span>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Dropdown Menu */}
              {showCategoryFilter && (
                <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCategoryFilter(false)}
                />

                {/* Dropdown Content */}
                <div className="absolute right-0 top-full mt-1 w-56 border rounded-md bg-popover shadow-lg z-20 max-h-[300px] overflow-y-auto">
                  {/* Clear Filter Option */}
                  {selectedCategoryId && (
                    <>
                      <button
                        onClick={handleClearFilter}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent transition-colors border-b"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="font-medium">Clear Filter</span>
                      </button>
                    </>
                  )}

                  {/* Category Options */}
                  <div className="p-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left text-xs hover:bg-accent transition-colors ${
                          selectedCategoryId === category.id ? 'bg-accent' : ''
                        }`}
                      >
                        <img
                          src={`/categories/${category.icon}`}
                          alt={category.name}
                          className="w-4 h-4 object-contain flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="flex-1 truncate">{category.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {category.servers.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
              )}
            </div>
          </div>
        </div>

        {(loading && servers.length === 0) || filterLoading ? (
          <div className="space-y-2">
            {/* Loading skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 animate-pulse">
                <div className="grid grid-cols-[minmax(130px,160px)_1fr] gap-3">
                  {/* Left Side Skeleton */}
                  <div className="min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-muted rounded-md"></div>
                    </div>

                    <div className="h-3 bg-muted rounded w-20"></div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <div className="h-2 bg-muted rounded w-24"></div>
                      <div className="h-2 bg-muted rounded w-16"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        <div className="h-6 bg-muted rounded flex-1"></div>
                        <div className="h-6 bg-muted rounded flex-1"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-full"></div>
                    </div>
                  </div>

                  {/* Right Side Skeleton - Description */}
                  <div className="flex items-start py-1 min-w-0">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-2.5 bg-muted rounded w-full"></div>
                      <div className="h-2.5 bg-muted rounded w-5/6"></div>
                      <div className="h-2.5 bg-muted rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <h3 className="font-medium text-sm mb-1">No MCP Servers Available</h3>
            <p className="text-xs text-muted-foreground mb-4">
              No public servers available at the moment
            </p>
            <Button size="sm" onClick={openFullApp}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Web App
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayServers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onRestart={handleRestart}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onToggleContext={handleToggleContext}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">v0.1.2</span>
            <span className="text-muted-foreground/60">•</span>
            <span>{totalServers} {totalServers === 1 ? 'server' : 'servers'}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-green-400">{connectedServers} connected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => chrome.tabs.create({ url: 'https://modelcontextprotocol.io' })}
              className="hover:text-foreground transition-colors"
            >
              MCP
            </button>
            <button
              onClick={() => chrome.tabs.create({ url: 'https://ashen-dusk.github.io/mcp-extension/privacy.html' })}
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </button>
            {/* <button
              onClick={() => chrome.tabs.create({ url: 'https://www.mcp-assistant.in/docs' })}
              className="hover:text-foreground transition-colors"
            >
              Docs
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
