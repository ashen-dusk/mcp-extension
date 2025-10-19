# MCP Assistant - Chrome Extension

A Chrome Extension for managing your MCP (Model Context Protocol) servers and interacting with your AI assistant from anywhere.

## Features

- **Authentication**: Secure login with Google OAuth
- **MCP Server Management**: View, restart, and delete your configured MCP servers
- **Real-time Status**: Monitor connection status of your servers
- **Quick Access**: Access your servers without opening the full web app
- **Seamless Integration**: Works with your existing MCP Assistant account

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Chrome browser (version 88+)
- Active MCP Assistant account at [mcpassistant.vercel.app](https://mcpassistant.vercel.app)

## Installation & Development

### 1. Install Dependencies

```bash
cd chrome-extension
npm install
```

### 2. Configure Google OAuth

To enable authentication, you need to configure Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your extension ID to authorized JavaScript origins
6. Update `manifest.json` with your OAuth client ID

### 3. Build the Extension

For development with hot reload:
```bash
npm run dev
```

For production build:
```bash
npm run build
```

The built extension will be in the `dist/` folder.

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist/` folder from your project

## Project Structure

```
chrome-extension/
├── public/
│   └── icons/           # Extension icons
├── src/
│   ├── background/      # Service worker
│   │   └── service-worker.ts
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── LoginScreen.tsx
│   │   ├── ServerList.tsx
│   │   └── ServerCard.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useMcpServers.ts
│   ├── lib/            # Utilities and API
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   ├── styles/         # Global styles
│   │   └── globals.css
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── manifest.json       # Extension manifest
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Architecture

### Background Service Worker

The service worker (`src/background/service-worker.ts`) handles:
- Authentication with Google OAuth via Chrome Identity API
- Message passing between popup and background
- API requests to the MCP Assistant backend
- Token storage and management

### Popup UI

The popup UI is built with React and includes:
- **LoginScreen**: Google OAuth authentication
- **ServerList**: List of configured MCP servers
- **ServerCard**: Individual server management (restart, delete)

### State Management

State is managed using:
- React hooks (`useState`, `useEffect`)
- Custom hooks (`useAuth`, `useMcpServers`)
- Chrome Storage API for persistence

### API Communication

All API requests go through:
1. Popup sends message to background worker
2. Background worker makes authenticated GraphQL request
3. Response sent back to popup via message passing

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Extension Permissions

The extension requires the following permissions:

- `storage` - Store authentication tokens and user data
- `identity` - Google OAuth authentication
- Host permissions for:
  - `https://mcpassistant.vercel.app/*` - MCP Assistant backend
  - `https://*.googleapis.com/*` - Google OAuth

## Building for Production

1. Update version in `manifest.json` and `package.json`
2. Run production build:
   ```bash
   npm run build
   ```
3. The `dist/` folder contains the production-ready extension
4. Test the built extension in Chrome
5. Create a ZIP file of the `dist/` folder for distribution

## Publishing to Chrome Web Store

### Prerequisites

1. Create a [Chrome Web Store Developer Account](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time $5 developer registration fee
3. Prepare extension assets:
   - Extension icons (16x16, 32x32, 48x48, 128x128)
   - Screenshots (1280x800 or 640x400)
   - Promotional images (optional)

### Publishing Steps

1. **Prepare Your Extension**
   ```bash
   npm run build
   cd dist
   zip -r mcp-assistant-extension.zip .
   ```

2. **Upload to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Click "New Item"
   - Upload your ZIP file
   - Fill in store listing information:
     - Name: MCP Assistant
     - Description: Manage your MCP servers from anywhere
     - Category: Productivity
     - Language: English
   - Upload screenshots and promotional images
   - Set privacy settings and pricing (free)

3. **Submit for Review**
   - Review all information
   - Click "Submit for Review"
   - Wait for Chrome Web Store review (typically 1-3 business days)

4. **After Approval**
   - Extension will be published and available in the Chrome Web Store
   - You can track installs and reviews in the developer dashboard

### Important Notes

- Extensions with OAuth require domain verification
- Ensure all screenshots show actual extension functionality
- Privacy policy may be required depending on permissions
- Keep extension updated with security patches

## Troubleshooting

### Extension Not Loading

- Ensure you've built the extension (`npm run build`)
- Check Chrome DevTools console for errors
- Verify all dependencies are installed

### Authentication Failing

- Check that Google OAuth credentials are properly configured
- Verify manifest.json has correct OAuth scopes
- Ensure backend URL is accessible

### API Requests Failing

- Check network tab in Chrome DevTools
- Verify authentication token is being sent
- Confirm backend is running and accessible

## Security Considerations

- Never commit OAuth credentials to version control
- Store sensitive data using Chrome Storage API (encrypted)
- Use HTTPS for all API requests
- Validate all user inputs
- Keep dependencies updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MCP Assistant application.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact support at your MCP Assistant account
- Visit [mcpassistant.vercel.app](https://mcpassistant.vercel.app)

## Changelog

### Version 1.0.0
- Initial release
- Google OAuth authentication
- View and manage MCP servers
- Restart and delete server functionality
- Real-time status monitoring
