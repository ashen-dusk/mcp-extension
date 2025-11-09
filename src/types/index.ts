export type ToolInfo = {
  name: string;
  description: string;
  schema: any;
};

export type Category = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  servers: McpServer[];
};

export type McpServer = {
  id: string;
  name: string;
  description?: string | null;
  transport: string;
  owner?: string | null;
  url?: string | null;
  command?: string | null;
  args?: any | null;
  enabled: boolean;
  requiresOauth2: boolean;
  isPublic?: boolean;
  connectionStatus?: string | null;
  tools: ToolInfo[];
  updatedAt: string;
  createdAt?: string;
  category?: Category | null;
};

export type AuthState = {
  isAuthenticated: boolean;
  googleIdToken?: string;
  googleIdTokenExpires?: number;
  user?: {
    name: string;
    email: string;
    image: string;
  };
};

export type MessageType =
  | 'OPEN_SIDE_PANEL'
  | 'AUTH_CHECK'
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_STATE'
  | 'FETCH_SERVERS'
  | 'FETCH_CATEGORIES'
  // COMMENTED OUT: Add/Edit/Delete server features
  // | 'ADD_SERVER'
  // | 'UPDATE_SERVER'
  // | 'DELETE_SERVER'
  | 'CONNECT_SERVER'
  | 'DISCONNECT_SERVER'
  | 'TOGGLE_CONTEXT'
  | 'SERVER_ACTION'
  | 'API_REQUEST';

export type Message<T = any> = {
  type: MessageType;
  payload?: T;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
