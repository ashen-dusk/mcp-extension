import { GRAPHQL_ENDPOINT } from './utils';
import { storage } from './storage';
import { McpServer, Category } from '@/types';

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

export const TOOL_INFO_FRAGMENT = `
  fragment ToolInfoFields on ToolInfo {
    name
    description
    schema
  }
`;

export const MCP_SERVER_FRAGMENT = `
  fragment McpServerFields on MCPServerType {
    id
    name
    transport
    url
    command
    categories {
      id
      name
      slug
    }
    args
    enabled
    description
    requiresOauth2
    connectionStatus
    tools { ...ToolInfoFields }
    updatedAt
    createdAt
    owner
    isPublic
  }
  ${TOOL_INFO_FRAGMENT}
`;

export const MCP_SERVERS_QUERY = `
  query McpServers($first: Int, $after: String, $order: MCPServerOrder, $filters: MCPServerFilter) {
    mcpServers(first: $first, after: $after, order: $order, filters: $filters) {
      totalCount
      edges {
        node {
          ...McpServerFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const CATEGORIES_QUERY = `
  query Categories($first: Int, $after: String) {
    categories(first: $first, after: $after) {
      edges {
        node {
          id
          name
          icon
          color
          description
          slug
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const RESTART_MCP_SERVER_MUTATION = `
  mutation RestartMcpServer($serverName: String!) {
    restartMcpServer(name: $serverName) {
      success
      message
      connectionStatus
      requiresAuth
      authorizationUrl
      state
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const CONNECT_MCP_SERVER_MUTATION = `
  mutation ConnectServer($serverName: String!) {
    connectMcpServer(name: $serverName) {
      success
      message
      connectionStatus
      requiresAuth
      authorizationUrl
      state
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const DISCONNECT_MCP_SERVER_MUTATION = `
  mutation DisconnectServer($serverName: String!) {
    disconnectMcpServer(name: $serverName) {
      success
      message
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const TOGGLE_CONTEXT_MUTATION = `
  mutation SetServerEnabled($serverName: String!, $enabled: Boolean!) {
    setMcpServerEnabled(name: $serverName, enabled: $enabled) {
      ...McpServerFields
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

async function makeGraphQLRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
  requiresAuth: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await storage.getGoogleIdToken();

    if (!token) {
      throw new Error('Not authenticated. Please sign in again.');
    }

    // Check if token is expired
    const isExpired = await storage.isTokenExpired();
    if (isExpired) {
      throw new Error('Session expired. Please sign in again.');
    }

    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
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
    const errorMessage = result.errors?.[0]?.message || 'Request failed';

    // Check if it's an authentication error
    if (errorMessage.includes('Token expired') || errorMessage.includes('Authentication')) {
      throw new Error('Session expired. Please sign in again.');
    }

    throw new Error(errorMessage);
  }

  return result.data;
}

export const api = {
  async fetchServers(categoryId?: string): Promise<McpServer[]> {
    const filters: any = {
      isPublic: { exact: true },
      requiresOauth2: { exact: false }
    };

    // Add category filter if provided
    if (categoryId) {
      filters.categories = {
        id: { exact: categoryId }
      };
    }

    const data = await makeGraphQLRequest<{
      mcpServers: {
        edges: Array<{ node: McpServer }>
      }
    }>(
      MCP_SERVERS_QUERY,
      { filters },
      true // Auth required to get session-specific connection status
    );
    return data.mcpServers.edges.map(edge => edge.node);
  },

  async fetchCategories(): Promise<Category[]> {
    const data = await makeGraphQLRequest<{
      categories: {
        edges: Array<{ node: Omit<Category, 'servers'> }>
      }
    }>(CATEGORIES_QUERY, undefined, true); // Auth required for session-specific connection status

    // Fetch servers and group them by category
    const servers = await this.fetchServers();

    // Map categories with their servers
    return data.categories.edges
      .map(edge => {
        const category = edge.node;
        const categoryServers = servers.filter(
          server => server.categories?.some(cat => cat.id === category.id)
        );
        return {
          ...category,
          servers: categoryServers
        };
      })
      .filter(category => category.servers.length > 0); // Only return categories with servers
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
    const data = await makeGraphQLRequest(RESTART_MCP_SERVER_MUTATION, { serverName }, true);
    return data.restartMcpServer;
  },

  async connectServer(serverName: string): Promise<any> {
    const data = await makeGraphQLRequest(CONNECT_MCP_SERVER_MUTATION, { serverName }, true);
    return data.connectMcpServer;
  },

  async disconnectServer(serverName: string): Promise<any> {
    const data = await makeGraphQLRequest(DISCONNECT_MCP_SERVER_MUTATION, { serverName }, true);
    return data.disconnectMcpServer;
  },

  async toggleContext(serverName: string, enabled: boolean): Promise<any> {
    const data = await makeGraphQLRequest(TOGGLE_CONTEXT_MUTATION, { serverName, enabled }, true);
    return data.setMcpServerEnabled;
  },
};
