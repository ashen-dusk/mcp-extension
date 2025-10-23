import { Message, AuthState } from '../types';
import { storage } from '../lib/storage';
import { api } from '../lib/api';

function decodeJwtExpiry(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('MCP Assistant Extension installed');

  // Configure side panel to open when action icon is clicked
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Failed to set panel behavior:', error));
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((error) => {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    });

  // Return true to indicate async response
  return true;
});

async function handleMessage(message: Message): Promise<any> {
  switch (message.type) {
    case 'AUTH_CHECK':
      return await handleAuthCheck();

    case 'AUTH_LOGIN':
      return await handleAuthLogin();

    case 'AUTH_LOGOUT':
      return await handleAuthLogout();

    case 'FETCH_SERVERS':
      return await handleFetchServers();

    // COMMENTED OUT: Add/Edit/Delete server features
    // case 'ADD_SERVER':
    //   return await handleAddServer(message.payload);

    // case 'UPDATE_SERVER':
    //   return await handleUpdateServer(message.payload);

    // case 'DELETE_SERVER':
    //   return await handleDeleteServer(message.payload);

    case 'CONNECT_SERVER':
      return await handleConnectServer(message.payload);

    case 'DISCONNECT_SERVER':
      return await handleDisconnectServer(message.payload);

    case 'TOGGLE_CONTEXT':
      return await handleToggleContext(message.payload);

    case 'SERVER_ACTION':
      return await handleServerAction(message.payload);

    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

async function handleAuthCheck(): Promise<{ success: boolean; authState: AuthState | null }> {
  const authState = await storage.getAuthState();

  // If authenticated, check if token is expired
  if (authState?.isAuthenticated) {
    const isExpired = await storage.isTokenExpired();
    if (isExpired) {
      console.log(`[Auth] Token expired at ${authState.googleIdTokenExpires ? new Date(authState.googleIdTokenExpires).toISOString() : 'unknown'}. Session cleared.`);
      await storage.clearAuthState();
      return { success: true, authState: null };
    }
  }

  return { success: true, authState };
}

async function handleAuthLogin(): Promise<{ success: boolean; authState?: AuthState; error?: string }> {
  try {
    // Get the client ID from manifest
    const manifest = chrome.runtime.getManifest();
    const clientId = manifest.oauth2?.client_id;

    if (!clientId) {
      throw new Error('OAuth2 client ID not configured in manifest');
    }

    // Create OAuth2 authorization URL to get ID token
    const redirectUrl = chrome.identity.getRedirectURL();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'id_token');
    authUrl.searchParams.set('redirect_uri', redirectUrl);
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('nonce', crypto.randomUUID());

    // Launch OAuth2 flow to get ID token
    const responseUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: true,
        },
        (callbackUrl) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (callbackUrl) {
            resolve(callbackUrl);
          } else {
            reject(new Error('Failed to get callback URL'));
          }
        }
      );
    });

    // Parse ID token from the callback URL fragment
    const urlParams = new URL(responseUrl);
    const fragment = urlParams.hash.substring(1); // Remove the #
    const params = new URLSearchParams(fragment);
    const idToken = params.get('id_token');

    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    // Decode the ID token to get user info and expiry
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const tokenExpiry = decodeJwtExpiry(idToken);

    const authState: AuthState = {
      isAuthenticated: true,
      googleIdToken: idToken,
      googleIdTokenExpires: tokenExpiry || undefined,
      user: {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      },
    };

    await storage.setAuthState(authState);

    return { success: true, authState };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

async function handleAuthLogout(): Promise<{ success: boolean }> {
  try {
    // Clear stored auth state
    await storage.clearAuthState();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}

async function handleFetchServers(): Promise<any> {
  try {
    const servers = await api.fetchServers();
    return { success: true, data: servers };
  } catch (error) {
    console.error('Fetch servers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch servers'
    };
  }
}

// COMMENTED OUT: Add/Edit/Delete server features
// async function handleAddServer(payload: any): Promise<any> {
//   try {
//     const server = await api.addServer(payload);
//     return { success: true, data: server };
//   } catch (error) {
//     console.error('Add server error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to add server'
//     };
//   }
// }

// async function handleUpdateServer(payload: any): Promise<any> {
//   try {
//     const server = await api.updateServer(payload);
//     return { success: true, data: server };
//   } catch (error) {
//     console.error('Update server error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to update server'
//     };
//   }
// }

// async function handleDeleteServer(payload: { serverName: string }): Promise<any> {
//   try {
//     await api.deleteServer(payload.serverName);
//     return { success: true };
//   } catch (error) {
//     console.error('Delete server error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to delete server'
//     };
//   }
// }

async function handleConnectServer(payload: { serverName: string }): Promise<any> {
  try {
    const result = await api.connectServer(payload.serverName);
    return { success: true, data: result };
  } catch (error) {
    console.error('Connect server error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect server'
    };
  }
}

async function handleDisconnectServer(payload: { serverName: string }): Promise<any> {
  try {
    const result = await api.disconnectServer(payload.serverName);
    return { success: true, data: result };
  } catch (error) {
    console.error('Disconnect server error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect server'
    };
  }
}

async function handleToggleContext(payload: { serverName: string; enabled: boolean }): Promise<any> {
  try {
    const result = await api.toggleContext(payload.serverName, payload.enabled);
    return { success: true, data: result };
  } catch (error) {
    console.error('Toggle context error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle context'
    };
  }
}

async function handleServerAction(payload: { serverName: string; action: string }): Promise<any> {
  try {
    if (payload.action === 'restart') {
      const result = await api.restartServer(payload.serverName);
      return { success: true, data: result };
    }
    return { success: false, error: 'Unknown action' };
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Action failed'
    };
  }
}

export {};
