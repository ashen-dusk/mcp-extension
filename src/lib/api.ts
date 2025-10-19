import { GRAPHQL_ENDPOINT } from './utils';
import { storage } from './storage';
import { McpServer } from '@/types';

export const SAVE_MCP_SERVER_MUTATION = `
  mutation SaveMcpServer(
    $name: String!
    $transport: String!
    $url: String
    $command: String
    $args: JSON
    $headers: JSON
    $queryParams: JSON
    $requiresOauth2: Boolean
    $isPublic: Boolean
  ) {
    saveMcpServer(
      name: $name
      transport: $transport
      url: $url
      command: $command
      args: $args
      headers: $headers
      queryParams: $queryParams
      requiresOauth2: $requiresOauth2
      isPublic: $isPublic
    ) {
      id
      name
      transport
      url
      command
      args
      enabled
      requiresOauth2
      connectionStatus
      updatedAt
      createdAt
      owner
      isPublic
    }
  }
`;

export const REMOVE_MCP_SERVER_MUTATION = `
  mutation RemoveMcpServer($serverName: String!) {
    removeMcpServer(name: $serverName)
  }
`;

export const MCP_SERVERS_QUERY = `
  query GetMcpServers {
    mcpServers {
      id
      name
      transport
      url
      command
      args
      enabled
      requiresOauth2
      connectionStatus
      tools {
        name
        description
        schema
      }
      updatedAt
      owner
      isPublic
    }
  }
`;

export const RESTART_MCP_SERVER_MUTATION = `
  mutation RestartMcpServer($name: String!) {
    restartMcpServer(name: $name) {
      success
      message
      connectionStatus
      server {
        id
        name
        transport
        url
        command
        args
        enabled
        requiresOauth2
        connectionStatus
        tools {
          name
          description
          schema
        }
        updatedAt
        createdAt
        owner
        isPublic
      }
    }
  }
`;

export const CONNECT_MCP_SERVER_MUTATION = `
  mutation ConnectMcpServer($name: String!) {
    connectMcpServer(name: $name) {
      success
      message
      connectionStatus
      server {
        id
        name
        transport
        url
        command
        args
        enabled
        requiresOauth2
        connectionStatus
        tools {
          name
          description
          schema
        }
        updatedAt
        createdAt
        owner
        isPublic
      }
    }
  }
`;

export const DISCONNECT_MCP_SERVER_MUTATION = `
  mutation DisconnectMcpServer($name: String!) {
    disconnectMcpServer(name: $name) {
      success
      message
      server {
        id
        name
        transport
        url
        command
        args
        enabled
        requiresOauth2
        connectionStatus
        tools {
          name
          description
          schema
        }
        updatedAt
        createdAt
        owner
        isPublic
      }
    }
  }
`;

export const TOGGLE_CONTEXT_MUTATION = `
  mutation SetServerEnabled($serverName: String!, $enabled: Boolean!) {
    setMcpServerEnabled(name: $serverName, enabled: $enabled) {
      id
      name
      transport
      url
      command
      args
      enabled
      requiresOauth2
      connectionStatus
      tools {
        name
        description
        schema
      }
      updatedAt
      createdAt
      owner
      isPublic
    }
  }
`;

async function makeGraphQLRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const token = await storage.getGoogleIdToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  // Check content type before parsing
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error('Backend server returned non-JSON response. Please check your GraphQL endpoint configuration.');
  }

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || 'Request failed');
  }

  return result.data;
}

export const api = {
  async fetchServers(): Promise<McpServer[]> {
    const data = await makeGraphQLRequest<{ mcpServers: McpServer[] }>(MCP_SERVERS_QUERY);
    return data.mcpServers;
  },

  // COMMENTED OUT: Add/Edit/Delete server features
  // async addServer(serverData: any): Promise<McpServer> {
  //   const data = await makeGraphQLRequest<{ saveMcpServer: McpServer }>(
  //     SAVE_MCP_SERVER_MUTATION,
  //     serverData
  //   );
  //   return data.saveMcpServer;
  // },

  // async updateServer(serverData: any): Promise<McpServer> {
  //   const data = await makeGraphQLRequest<{ saveMcpServer: McpServer }>(
  //     SAVE_MCP_SERVER_MUTATION,
  //     serverData
  //   );
  //   return data.saveMcpServer;
  // },

  // async deleteServer(serverName: string): Promise<boolean> {
  //   const data = await makeGraphQLRequest<{ removeMcpServer: boolean }>(
  //     REMOVE_MCP_SERVER_MUTATION,
  //     { serverName }
  //   );
  //   return data.removeMcpServer;
  // },

  async restartServer(serverName: string): Promise<any> {
    const data = await makeGraphQLRequest(RESTART_MCP_SERVER_MUTATION, { name: serverName });
    return data.restartMcpServer;
  },

  async connectServer(serverName: string): Promise<any> {
    const data = await makeGraphQLRequest(CONNECT_MCP_SERVER_MUTATION, { name: serverName });
    return data.connectMcpServer;
  },

  async disconnectServer(serverName: string): Promise<any> {
    const data = await makeGraphQLRequest(DISCONNECT_MCP_SERVER_MUTATION, { name: serverName });
    return data.disconnectMcpServer;
  },

  async toggleContext(serverName: string, enabled: boolean): Promise<any> {
    const data = await makeGraphQLRequest(TOGGLE_CONTEXT_MUTATION, { serverName, enabled });
    return data.setMcpServerEnabled;
  },
};
