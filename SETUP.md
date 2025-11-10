# Setup Instructions - MCP Assistant Chrome Extension

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18 or higher
- ✅ npm, yarn, or pnpm
- ✅ Google Chrome browser
- ✅ Active MCP Assistant account at mcpassistant.vercel.app

## Step-by-Step Setup

### Step 1: Install Dependencies

Navigate to the chrome-extension directory and install packages:

```bash
cd chrome-extension
npm install
```

This will install all required dependencies including React, TypeScript, Vite, and Chrome extension tools.

### Step 2: Create Extension Icons (Optional but Recommended)

Create PNG icons in the following sizes and place them in `public/icons/`:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)

**Temporary Solution**: For testing, you can use any 128x128 PNG and duplicate it with different names.

### Step 3: Build the Extension

Build the extension for the first time:

```bash
npm run build
```

This creates a `dist/` folder with your compiled extension. You should see output similar to:

```
✓ built in 3.45s
dist/manifest.json
dist/index.html
dist/assets/...
```

### Step 4: Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **Developer mode** using the toggle in the top-right
3. Click **Load unpacked** button
4. Navigate to and select the `chrome-extension/dist` folder
5. The MCP Assistant extension should now appear in your extensions list

### Step 5: Pin the Extension (Optional)

1. Click the extensions puzzle icon in Chrome toolbar
2. Find "MCP Assistant"
3. Click the pin icon to keep it visible

### Step 6: Test the Extension

1. Click the MCP Assistant icon in your Chrome toolbar
2. You should see the login screen
3. Click "Sign in with Google"
4. Complete the Google authentication
5. You should see your MCP servers list

## Development Mode

For active development with hot module replacement:

```bash
npm run dev
```

Then load the extension from `dist/` folder. Changes will automatically rebuild.

**Note**: You may need to click the reload icon in `chrome://extensions/` after some changes.

## Troubleshooting

### Build Errors

**Issue**: `npm install` fails
```bash
# Solution: Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript errors during build
```bash
# Solution: Check TypeScript version and config
npm run type-check
```

### Extension Not Loading

**Issue**: Extension shows errors in Chrome
- Check the `dist/` folder was created
- Verify `manifest.json` exists in `dist/`
- Look at error messages in Chrome extensions page

**Issue**: Extension icon not showing
- Create placeholder icons in `public/icons/`
- Rebuild with `npm run build`
- Reload extension in Chrome

### Authentication Issues

**Issue**: "Sign in with Google" not working
- The extension uses Chrome Identity API
- For development, authentication is handled through the Identity API
- Make sure you're signed into Chrome with your Google account

**Issue**: "Not authenticated" error when viewing servers
- Try logging out and logging in again
- Check browser console (right-click extension icon > Inspect)
- Verify you can access mcpassistant.vercel.app

### API Connection Issues

**Issue**: Servers not loading
- Check network tab in DevTools (Inspect popup)
- Verify you're authenticated
- Ensure backend at mcpassistant.vercel.app is accessible
- Check for CORS issues in console

## Configuration

### Changing Backend URL

Edit `src/lib/utils.ts`:

```typescript
export const BACKEND_URL = 'https://your-backend-url.com';
```

Then rebuild:
```bash
npm run build
```

### Updating Permissions

Edit `manifest.json` to add/remove permissions:

```json
{
  "permissions": ["storage", "identity"],
  "host_permissions": [
    "https://www.mcp-assistant.in/*"
  ]
}
```

## Available Commands

### Development
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Testing Checklist

Before considering the extension ready:

- [ ] Extension loads without errors
- [ ] Icons display correctly
- [ ] Login flow works
- [ ] Servers list displays
- [ ] Can refresh servers
- [ ] Can restart a server
- [ ] Can delete a server
- [ ] User info displays correctly
- [ ] Logout works
- [ ] "Open App" button works
- [ ] Status badges show correctly
- [ ] No console errors

## Debugging

### View Popup Logs
1. Right-click extension icon
2. Select "Inspect popup"
3. Check Console tab

### View Background Worker Logs
1. Go to `chrome://extensions/`
2. Find MCP Assistant
3. Click "service worker" link
4. Check Console tab

### Network Debugging
1. Inspect popup
2. Go to Network tab
3. Perform action (login, fetch servers)
4. Check request/response

## Production Checklist

Before publishing to Chrome Web Store:

- [ ] Icons created (16, 32, 48, 128px)
- [ ] OAuth credentials configured
- [ ] All features tested
- [ ] No console errors
- [ ] Build succeeds without warnings
- [ ] Version number updated in manifest.json
- [ ] Screenshots prepared
- [ ] Description written
- [ ] Privacy policy created (if needed)

## File Structure

```
chrome-extension/
├── public/icons/        # Extension icons
├── src/
│   ├── background/      # Service worker
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── styles/         # Global CSS
│   └── types/          # TypeScript types
├── dist/               # Build output (gitignored)
├── manifest.json       # Extension manifest
├── package.json        # Dependencies
└── vite.config.ts      # Build config
```

## Next Steps

1. **Test thoroughly** - Try all features
2. **Create icons** - Use your brand colors
3. **Configure OAuth** - Set up Google Cloud Console
4. **Add features** - Enhance with chat, notifications, etc.
5. **Publish** - Submit to Chrome Web Store

## Getting Help

- Check `README.md` for detailed documentation
- See `QUICKSTART.md` for quick reference
- Review `PROJECT_SUMMARY.md` for architecture overview
- Check Chrome Extension documentation: https://developer.chrome.com/docs/extensions/

## Success!

If you've followed all steps, you should now have a working Chrome extension! 🎉

Try clicking the extension icon and managing your MCP servers.
