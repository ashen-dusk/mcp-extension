import { useState, useEffect, useCallback } from 'react';
import { McpServer, Category, Message } from '@/types';

export function useMcpServers() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const fetchServers = useCallback(async (categoryId?: string) => {
    // Fetch public servers even without authentication
    try {
      setLoading(true);
      setError(null);

      // Only fetch categories on initial load (when not yet loaded)
      if (!categoriesLoaded) {
        // Fetch both servers and categories in parallel on initial load
        const [serversResponse, categoriesResponse] = await Promise.all([
          chrome.runtime.sendMessage<Message>({
            type: 'FETCH_SERVERS',
            payload: categoryId ? { categoryId } : undefined
          }),
          chrome.runtime.sendMessage<Message>({ type: 'FETCH_CATEGORIES' })
        ]);

        if (serversResponse.success) {
          setServers(serversResponse.data || []);
        } else {
          setError(serversResponse.error || 'Failed to fetch servers');
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
          setCategoriesLoaded(true);
        }
      } else {
        // Only fetch servers when filtering (categories already loaded)
        const serversResponse = await chrome.runtime.sendMessage<Message>({
          type: 'FETCH_SERVERS',
          payload: categoryId ? { categoryId } : undefined
        });

        if (serversResponse.success) {
          setServers(serversResponse.data || []);
        } else {
          setError(serversResponse.error || 'Failed to fetch servers');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [categoriesLoaded]);

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
          const updatedServer = response.data.server;

          // Update servers array
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? updatedServer : server
            )
          );

          // Also update servers inside categories
          setCategories(prevCategories =>
            prevCategories.map(category => ({
              ...category,
              servers: category.servers.map(server =>
                server.name === serverName ? updatedServer : server
              )
            }))
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
          const updatedServer = response.data.server;

          // Update servers array
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? updatedServer : server
            )
          );

          // Also update servers inside categories
          setCategories(prevCategories =>
            prevCategories.map(category => ({
              ...category,
              servers: category.servers.map(server =>
                server.name === serverName ? updatedServer : server
              )
            }))
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

        // Also update servers inside categories
        setCategories(prevCategories =>
          prevCategories.map(category => ({
            ...category,
            servers: category.servers.map(server =>
              server.name === serverName ? { ...server, enabled } : server
            )
          }))
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
          const updatedServer = response.data.server;

          // Update servers array
          setServers(prevServers =>
            prevServers.map(server =>
              server.name === serverName ? updatedServer : server
            )
          );

          // Also update servers inside categories
          setCategories(prevCategories =>
            prevCategories.map(category => ({
              ...category,
              servers: category.servers.map(server =>
                server.name === serverName ? updatedServer : server
              )
            }))
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
    categories,
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
