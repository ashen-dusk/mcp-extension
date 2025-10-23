import { AuthState } from '@/types';

const STORAGE_KEYS = {
  AUTH_STATE: 'auth_state',
  GOOGLE_ID_TOKEN: 'google_id_token',
  GOOGLE_ID_TOKEN_EXPIRES: 'google_id_token_expires',
  USER_DATA: 'user_data',
} as const;

export const storage = {
  async getAuthState(): Promise<AuthState | null> {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.AUTH_STATE,
      STORAGE_KEYS.GOOGLE_ID_TOKEN,
      STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES,
      STORAGE_KEYS.USER_DATA,
    ]);

    if (!result[STORAGE_KEYS.AUTH_STATE]) {
      return null;
    }

    return {
      isAuthenticated: result[STORAGE_KEYS.AUTH_STATE],
      googleIdToken: result[STORAGE_KEYS.GOOGLE_ID_TOKEN],
      googleIdTokenExpires: result[STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES],
      user: result[STORAGE_KEYS.USER_DATA],
    };
  },

  async setAuthState(authState: AuthState): Promise<void> {
    await chrome.storage.local.set({
      [STORAGE_KEYS.AUTH_STATE]: authState.isAuthenticated,
      [STORAGE_KEYS.GOOGLE_ID_TOKEN]: authState.googleIdToken,
      [STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES]: authState.googleIdTokenExpires,
      [STORAGE_KEYS.USER_DATA]: authState.user,
    });
  },

  async clearAuthState(): Promise<void> {
    await chrome.storage.local.remove([
      STORAGE_KEYS.AUTH_STATE,
      STORAGE_KEYS.GOOGLE_ID_TOKEN,
      STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  async getGoogleIdToken(): Promise<string | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.GOOGLE_ID_TOKEN);
    return result[STORAGE_KEYS.GOOGLE_ID_TOKEN] || null;
  },

  async isTokenExpired(): Promise<boolean> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES);
    const expiry = result[STORAGE_KEYS.GOOGLE_ID_TOKEN_EXPIRES];

    if (!expiry) return true;

    return Date.now() >= expiry;
  },
};
