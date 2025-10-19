# Architecture Overview - MCP Assistant Chrome Extension

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Chrome Browser                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Extension Popup                      │ │
│  │                    (400x600 React App)                  │ │
│  │                                                          │ │
│  │  ┌──────────────┐         ┌──────────────┐             │ │
│  │  │ LoginScreen  │   or    │ ServerList   │             │ │
│  │  │              │         │              │             │ │
│  │  │ [Google      │         │ [Servers]    │             │ │
│  │  │  Sign-in]    │         │ [Refresh]    │             │ │
│  │  │              │         │ [Open App]   │             │ │
│  │  └──────────────┘         └──────────────┘             │ │
│  │                                 │                        │ │
│  │         React Hooks             │                        │ │
│  │    ┌──────────────┐    ┌───────┴────────┐             │ │
│  │    │   useAuth    │    │ useMcpServers  │             │ │
│  │    └──────┬───────┘    └───────┬────────┘             │ │
│  └───────────┼────────────────────┼──────────────────────┘ │
│              │                     │                         │
│              │  chrome.runtime     │                         │
│              │    .sendMessage     │                         │
│              └──────────┬──────────┘                         │
│                         │                                     │
│  ┌──────────────────────┴──────────────────────────────────┐│
│  │           Background Service Worker                      ││
│  │         (src/background/service-worker.ts)               ││
│  │                                                           ││
│  │  Message Handler:                                        ││
│  │  • AUTH_CHECK    → Check stored auth state              ││
│  │  • AUTH_LOGIN    → Google OAuth via Identity API        ││
│  │  • AUTH_LOGOUT   → Clear tokens                         ││
│  │  • FETCH_SERVERS → Get servers from backend             ││
│  │  • ADD_SERVER    → Create new server                    ││
│  │  • UPDATE_SERVER → Modify existing server               ││
│  │  • DELETE_SERVER → Remove server                        ││
│  │  • SERVER_ACTION → Restart/activate/deactivate          ││
│  │                                                           ││
│  │  ┌─────────────────────────────────────────────────┐   ││
│  │  │         Chrome APIs                              │   ││
│  │  │  • chrome.identity  (Google OAuth)              │   ││
│  │  │  • chrome.storage   (Token persistence)         │   ││
│  │  │  • chrome.tabs      (Open web app)              │   ││
│  │  └─────────────────────────────────────────────────┘   ││
│  │                         │                                 ││
│  └─────────────────────────┼─────────────────────────────┘ │
└────────────────────────────┼───────────────────────────────┘
                             │ HTTPS
                             │ GraphQL API
                             │ Authorization: Bearer {token}
                             ▼
         ┌───────────────────────────────────────────┐
         │     MCP Assistant Backend                 │
         │   (mcpassistant.vercel.app)              │
         │                                           │
         │  ┌─────────────────────────────────────┐ │
         │  │     API Routes                      │ │
         │  │  • /api/graphql                     │ │
         │  │  • /api/auth/[...nextauth]          │ │
         │  └─────────────────────────────────────┘ │
         │                                           │
         │  ┌─────────────────────────────────────┐ │
         │  │     GraphQL Operations              │ │
         │  │  • mcpServers (Query)               │ │
         │  │  • saveMcpServer (Mutation)         │ │
         │  │  • removeMcpServer (Mutation)       │ │
         │  │  • restartMcpServer (Mutation)      │ │
         │  └─────────────────────────────────────┘ │
         │                                           │
         │  ┌─────────────────────────────────────┐ │
         │  │     Database (MongoDB/PostgreSQL)   │ │
         │  │  • User accounts                    │ │
         │  │  • MCP server configurations        │ │
         │  │  • Connection status                │ │
         │  └─────────────────────────────────────┘ │
         └───────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Sign in"
      │
      ▼
chrome.identity.getAuthToken()
      │
      ▼
Google OAuth Consent Screen
      │
      ▼
Access Token Received
      │
      ▼
Fetch User Info from Google API
      │
      ▼
Store in chrome.storage.local:
  • isAuthenticated: true
  • googleIdToken: "token..."
  • user: { name, email, image }
      │
      ▼
Update UI → Show ServerList
```

### 2. Fetch Servers Flow

```
Component mounts
      │
      ▼
useMcpServers() hook
      │
      ▼
chrome.runtime.sendMessage({
  type: 'FETCH_SERVERS'
})
      │
      ▼
Background Worker receives message
      │
      ▼
Get token from chrome.storage
      │
      ▼
fetch(GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: { query: MCP_SERVERS_QUERY }
})
      │
      ▼
Backend validates token & returns servers
      │
      ▼
Background sends response to popup
      │
      ▼
Hook updates state
      │
      ▼
UI re-renders with server list
```

### 3. Server Action Flow (Restart/Delete)

```
User clicks "Restart" or "Delete"
      │
      ▼
Event handler in component
      │
      ▼
chrome.runtime.sendMessage({
  type: 'SERVER_ACTION',
  payload: { serverName, action }
})
      │
      ▼
Background Worker
      │
      ▼
Make authenticated GraphQL request
      │
      ▼
Backend processes action
      │
      ▼
Response sent back to popup
      │
      ▼
Refresh server list
      │
      ▼
UI updates with new status
```

## Component Hierarchy

```
App
├── LoginScreen (if not authenticated)
│   ├── Card
│   ├── Button (Sign in with Google)
│   └── Error message
│
└── ServerList (if authenticated)
    ├── Header
    │   ├── Logo
    │   ├── User info
    │   └── Logout button
    │
    ├── Action buttons
    │   ├── Refresh
    │   └── Open App
    │
    └── Server cards list
        └── ServerCard (for each server)
            ├── Server icon & name
            ├── Status badge
            ├── Server details
            └── Actions
                ├── Restart button
                └── Delete button
```

## State Management

### Local State (React)
- `authState` - Authentication status and user info
- `servers` - List of MCP servers
- `loading` - Loading states
- `error` - Error messages

### Persistent State (Chrome Storage)
- `auth_state` - Is user authenticated
- `google_id_token` - OAuth token
- `user_data` - User profile info

### Background State
- Active service worker
- Message queue
- API request cache

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│             Security Layers                     │
├─────────────────────────────────────────────────┤
│ 1. OAuth 2.0                                    │
│    ✓ Google authentication                      │
│    ✓ Secure token exchange                      │
│    ✓ Automatic token refresh                    │
├─────────────────────────────────────────────────┤
│ 2. Chrome Storage API                           │
│    ✓ Encrypted local storage                    │
│    ✓ Sandboxed per extension                    │
│    ✓ No direct script access                    │
├─────────────────────────────────────────────────┤
│ 3. Content Security Policy                      │
│    ✓ script-src 'self'                          │
│    ✓ No inline scripts                          │
│    ✓ No eval()                                  │
├─────────────────────────────────────────────────┤
│ 4. HTTPS Only                                   │
│    ✓ All API calls over HTTPS                   │
│    ✓ Secure WebSocket connections               │
├─────────────────────────────────────────────────┤
│ 5. Manifest V3                                  │
│    ✓ Service worker (no persistent background)  │
│    ✓ Limited permissions                        │
│    ✓ Host permission restrictions               │
└─────────────────────────────────────────────────┘
```

## Build Process

```
Source Files (TypeScript + React)
      │
      ▼
Vite + TypeScript Compiler
      │
      ├─→ Type checking
      ├─→ React JSX transformation
      ├─→ CSS processing (Tailwind)
      └─→ Asset optimization
      │
      ▼
@crxjs/vite-plugin
      │
      ├─→ Manifest processing
      ├─→ Background script bundling
      ├─→ Content script splitting
      └─→ Asset copying
      │
      ▼
dist/ folder
      │
      ├── manifest.json
      ├── index.html
      ├── assets/
      │   ├── index-[hash].js
      │   ├── index-[hash].css
      │   └── service-worker-[hash].js
      └── icons/
```

## Performance Optimization

### Bundle Splitting
- Main popup bundle (~300KB)
- Background worker bundle (~100KB)
- Shared chunks for common code

### Code Splitting
- React components lazy loaded
- UI components tree-shaken
- Unused Tailwind classes purged

### Caching Strategy
- Service worker caches API responses
- Chrome storage for auth state
- Session-based server list cache

### Load Time
- Initial load: <100ms
- Authentication check: <50ms
- Server list fetch: <500ms

## Error Handling

```
Error Types:
├── Authentication Errors
│   ├── Token expired → Re-authenticate
│   ├── Invalid credentials → Show error
│   └── Network error → Retry with backoff
│
├── API Errors
│   ├── 401 Unauthorized → Clear auth & redirect to login
│   ├── 404 Not Found → Show error message
│   ├── 500 Server Error → Show retry option
│   └── Network timeout → Retry with exponential backoff
│
└── Extension Errors
    ├── Storage quota exceeded → Clear old data
    ├── Permission denied → Request permissions
    └── Runtime error → Log and show generic error
```

## Monitoring & Debugging

### Available Tools
1. **Chrome DevTools** - Inspect popup
2. **Service Worker Console** - Background logs
3. **Network Tab** - API requests
4. **Storage Tab** - Check chrome.storage
5. **Extensions Page** - View errors and reload

### Logging Strategy
- Console logs in development
- Error tracking in production
- User action analytics (optional)

## Future Architecture Enhancements

### Potential Additions
1. **CopilotKit Integration** - Chat interface in popup
2. **Side Panel API** - Larger chat interface
3. **Notifications API** - Server status alerts
4. **Alarms API** - Periodic server health checks
5. **Offline Support** - Service worker caching
6. **Sync API** - Cross-device settings sync

### Scalability
- Component lazy loading
- Virtual scrolling for large server lists
- Background sync for server updates
- Worker threads for heavy computations

---

This architecture provides a solid foundation for a modern Chrome Extension with room for future enhancements while maintaining security, performance, and user experience.
