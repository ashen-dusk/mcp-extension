import { useState, useEffect, useCallback } from 'react';
import { McpServer, Message } from '@/types';

export function useMcpServers() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chrome.runtime.sendMessage<Message>({ type: 'FETCH_SERVERS' });

      if (response.success) {
        setServers(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch servers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  }, []);

  // COMMENTED OUT: Add/Edit/Delete server features
  // const addServer = async (serverData: any) => {
  //   try {
  //     const response = await chrome.runtime.sendMessage<Message>({
  //       type: 'ADD_SERVER',
  //       payload: serverData,
  //     });

  //     if (response.success) {
  //       await fetchServers();
  //       return { success: true };
  //     } else {
  //       return { success: false, error: response.error };
  //     }
  //   } catch (err) {
  //     return { success: false, error: err instanceof Error ? err.message : 'Failed to add server' };
  //   }
  // };

  // const updateServer = async (serverData: any) => {
  //   try {
  //     const response = await chrome.runtime.sendMessage<Message>({
  //       type: 'UPDATE_SERVER',
  //       payload: serverData,
  //     });

  //     if (response.success) {
  //       await fetchServers();
  //       return { success: true };
  //     } else {
  //       return { success: false, error: response.error };
  //     }
  //   } catch (err) {
  //     return { success: false, error: err instanceof Error ? err.message : 'Failed to update server' };
  //   }
  // };

  // const deleteServer = async (serverName: string) => {
  //   try {
  //     const response = await chrome.runtime.sendMessage<Message>({
  //       type: 'DELETE_SERVER',
  //       payload: { serverName },
  //     });

  //     if (response.success) {
  //       await fetchServers();
  //       return { success: true };
  //     } else {
  //       return { success: false, error: response.error };
  //     }
  //   } catch (err) {
  //     return { success: false, error: err instanceof Error ? err.message : 'Failed to delete server' };
  //   }
  // };

  const connectServer = async (serverName: string) => {
    try {
      const response = await chrome.runtime.sendMessage<Message>({
        type: 'CONNECT_SERVER',
        payload: { serverName },
      });

      if (response.success) {
        // Update local state with server data from response
        if (response.data && response.data.server) {
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? response.data.server : server
            )
          );
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to connect server' };
    }
  };

  const disconnectServer = async (serverName: string) => {
    try {
      const response = await chrome.runtime.sendMessage<Message>({
        type: 'DISCONNECT_SERVER',
        payload: { serverName },
      });

      if (response.success) {
        // Update local state with server data from response
        if (response.data && response.data.server) {
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? response.data.server : server
            )
          );
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to disconnect server' };
    }
  };

  const toggleContext = async (serverName: string, enabled: boolean) => {
    try {
      const response = await chrome.runtime.sendMessage<Message>({
        type: 'TOGGLE_CONTEXT',
        payload: { serverName, enabled },
      });

      if (response.success) {
        // Update local state optimistically instead of refetching
        setServers(prevServers =>
          prevServers.map(server =>
            server.name === serverName ? { ...server, enabled } : server
          )
        );
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to toggle context' };
    }
  };

  const restartServer = async (serverName: string) => {
    try {
      const response = await chrome.runtime.sendMessage<Message>({
        type: 'SERVER_ACTION',
        payload: { serverName, action: 'restart' },
      });

      if (response.success) {
        // Update local state with server data from response
        if (response.data && response.data.server) {
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? response.data.server : server
            )
          );
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to restart server' };
    }
  };

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  return {
    servers,
    loading,
    error,
    fetchServers,
    // COMMENTED OUT: Add/Edit/Delete server features
    // addServer,
    // updateServer,
    // deleteServer,
    connectServer,
    disconnectServer,
    toggleContext,
    restartServer,
  };
}
