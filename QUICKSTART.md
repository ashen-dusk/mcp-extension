# Quick Start Guide - MCP Assistant Chrome Extension

## Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
cd chrome-extension
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with your compiled extension.

### 3. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder
5. The MCP Assistant icon should appear in your extensions toolbar

### 4. Test the Extension

1. Click the MCP Assistant icon in your Chrome toolbar
2. Click "Sign in with Google"
3. Authorize the extension
4. You should see your MCP servers list

## Development Mode

For active development with hot reload:

```bash
npm run dev
```

Then load the extension from the `dist/` folder. Changes will auto-reload.

## Common Issues

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Extension Not Appearing

- Make sure you loaded the `dist/` folder, not the root folder
- Check that "Developer mode" is enabled
- Look for errors in `chrome://extensions/`

### Authentication Issues

The extension uses Chrome's Identity API for Google OAuth. For development:

1. The extension needs to be loaded in Chrome
2. You may need to configure OAuth credentials in Google Cloud Console
3. For now, the extension uses the main app's authentication

## Next Steps

- **Add Icons**: Place PNG icons in `public/icons/` (16, 32, 48, 128px)
- **Customize**: Edit components in `src/components/`
- **Test**: Try restarting and deleting servers
- **Deploy**: Follow the README for publishing to Chrome Web Store

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build

# Code Quality
npm run lint         # Check for errors
npm run format       # Format code
npm run type-check   # Check TypeScript

# Extension Management
# Load: chrome://extensions/ > Load unpacked > select dist/
# Reload: Click reload icon on extension card
# Debug: Right-click extension icon > Inspect popup
```

## File Structure Overview

```
src/
├── background/         # Service worker (handles API calls)
├── components/         # React UI components
│   ├── ui/            # Reusable components (Button, Card, etc.)
│   ├── LoginScreen.tsx
│   ├── ServerList.tsx
│   └── ServerCard.tsx
├── hooks/             # Custom hooks (useAuth, useMcpServers)
├── lib/               # Utilities (API, storage, utils)
├── types/             # TypeScript definitions
└── styles/            # Global CSS
```

## Debugging

### View Extension Logs

1. Right-click extension icon
2. Select "Inspect popup"
3. Check Console tab for errors

### View Background Worker Logs

1. Go to `chrome://extensions/`
2. Find MCP Assistant
3. Click "service worker" link
4. Check Console for background script logs

### Network Requests

1. Inspect popup (right-click icon > Inspect)
2. Go to Network tab
3. Perform actions (login, fetch servers)
4. Check API requests and responses

## What's Working

- ✅ Authentication with Google
- ✅ Fetch and display MCP servers
- ✅ Restart server functionality
- ✅ Delete server functionality
- ✅ Real-time status display
- ✅ Open full app in new tab
- ✅ Persistent login state

## What's Next

You can enhance the extension with:

- Add new server functionality in the popup
- Chat interface with CopilotKit
- Server health monitoring
- Notifications for server status changes
- Keyboard shortcuts
- Dark mode toggle
- Settings page

Happy building! 🚀
