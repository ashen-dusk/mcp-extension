import { useState } from 'react';
import { McpServer } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Switch } from './ui/switch';
import { RefreshCw, Server, WifiOff, Brain, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ServerCardProps {
  server: McpServer;
  onRestart: (serverName: string) => Promise<void>;
  // COMMENTED OUT: Delete feature
  // onDelete: (serverName: string) => Promise<void>;
  onConnect: (serverName: string) => Promise<void>;
  onDisconnect: (serverName: string) => Promise<void>;
  onToggleContext: (serverName: string, enabled: boolean) => Promise<void>;
}

export function ServerCard({ server, onRestart, onConnect, onDisconnect, onToggleContext }: ServerCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isTogglingContext, setIsTogglingContext] = useState(false);

  const isConnected = server.connectionStatus === 'CONNECTED';
  const isFailed = server.connectionStatus === 'FAILED';

  const getStatusBadge = () => {
    if (isConnected) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Connected
        </Badge>
      );
    }
    if (isFailed) return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="secondary">Disconnected</Badge>;
  };

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

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{server.name}</h3>
              <p className="text-xs text-muted-foreground">{server.transport.toUpperCase()}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          {server.url && (
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-medium">URL:</span> {server.url}
            </p>
          )}
          {server.command && (
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-medium">Command:</span> {server.command}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Tools:</span> {server.tools.length}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Updated:</span> {formatDate(server.updatedAt)}
          </p>
        </div>

        {/* Connection, Restart Buttons, and Context Toggle */}
        <div className="flex gap-2 items-center">
          {isConnected ? (
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 border-0"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <WifiOff className="h-3 w-3 mr-1" />
              )}
              Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 border-0"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              {isFailed ? 'Retry' : 'Connect'}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 border-0"
            onClick={handleRestart}
            disabled={!isConnected || isRestarting}
          >
            {isRestarting ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Restart
          </Button>
          <div className="flex-1 flex items-center justify-center gap-1.5 px-2" title="Assistant Context">
            <Brain className="h-3.5 w-3.5 text-blue-400" />
            <Switch
              checked={server.enabled}
              onCheckedChange={handleContextToggle}
              disabled={!isConnected || isTogglingContext}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
