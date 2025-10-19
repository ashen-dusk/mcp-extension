import { Message, AuthState } from '../types';
import { storage } from '../lib/storage';
import { api } from '../lib/api';

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('MCP Assistant Extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
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
  return { success: true, authState };
}

async function handleAuthLogin(): Promise<{ success: boolean; authState?: AuthState; error?: string }> {
  try {
    // Use Chrome Identity API to authenticate with Google
    const token = await new Promise<string>((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error('Failed to get auth token'));
        }
      });
    });

    // Fetch user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
    );
    const userInfo = await userInfoResponse.json();

    // Exchange the access token for an ID token
    // In production, you'd call your backend to validate and exchange tokens
    const authState: AuthState = {
      isAuthenticated: true,
      googleIdToken: token, // In production, this should be the ID token from your backend
      user: {
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
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
    const token = await storage.getGoogleIdToken();

    if (token) {
      // Remove cached auth token
      await new Promise<void>((resolve, reject) => {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }

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
