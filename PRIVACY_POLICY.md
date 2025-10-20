# Privacy Policy for MCP Assistant

**Last Updated:** October 20, 2024

## Introduction

MCP Assistant ("we", "our", or "the extension") is a Chrome extension that helps users manage MCP (Model Context Protocol) servers and interact with AI assistants. This privacy policy explains how we collect, use, and protect your information.

## Information We Collect

### 1. Authentication Information
- **Google Account Information**: When you sign in using Google OAuth, we collect:
  - Your email address
  - Your profile information (name, profile picture)
  - Google user ID

This information is used solely for authentication purposes and to provide you with a personalized experience.

### 2. MCP Server Configuration
- Server names, URLs, and connection settings you configure
- This data is stored locally in your browser using Chrome's storage API
- No server configuration data is transmitted to us or any third parties

### 3. Usage Data
- The extension may store usage preferences locally in your browser
- No analytics or tracking data is collected or transmitted

## How We Use Your Information

We use the collected information to:
- Authenticate you with your Google account
- Maintain your session across browser restarts
- Store your MCP server configurations locally
- Provide access to connected MCP servers and AI assistant features

## Data Storage

- **Local Storage**: All MCP server configurations and preferences are stored locally in your browser using Chrome's storage API
- **Backend Services**: Authentication tokens are securely transmitted to our backend services to validate your identity
- **No Third-Party Storage**: We do not store your personal information or configurations on third-party servers

## Data Sharing

We do **NOT**:
- Sell your personal information to third parties
- Share your data with advertisers
- Use your data for marketing purposes
- Track your browsing activity outside the extension

We **MAY** share data only in these circumstances:
- When required by law or legal process
- To protect the rights, property, or safety of users or others
- With your explicit consent

## Third-Party Services

### Google OAuth
We use Google OAuth for authentication. When you sign in:
- Google's Privacy Policy applies: https://policies.google.com/privacy
- We receive only the minimum information necessary for authentication

### MCP Servers
When you connect to MCP servers:
- You are responsible for the privacy policies of those servers
- We do not control or monitor the data exchanged with third-party MCP servers

### Backend API
Our extension communicates with:
- `https://mcpassistant.vercel.app/*` - Main application backend
- `https://api.quicklit.in/*` - API services
- `https://express-copilotkit-runtime.vercel.app/*` - AI assistant runtime

These services process authentication tokens and facilitate MCP server connections.

## Permissions Explained

MCP Assistant requests the following Chrome permissions:

- **storage**: Store your MCP server configurations and preferences locally
- **identity**: Enable Google OAuth authentication
- **sidePanel**: Display the assistant interface in Chrome's side panel
- **host_permissions**: Communicate with our backend services and configured MCP servers

## Data Security

We implement security measures including:
- HTTPS encryption for all network communications
- Secure token handling for authentication
- No plaintext storage of sensitive credentials
- OAuth 2.0 industry-standard authentication

## Your Rights

You have the right to:
- **Access**: Review your stored data in Chrome's extension storage
- **Delete**: Uninstall the extension to remove all locally stored data
- **Revoke Access**: Disconnect your Google account at any time
- **Export**: Your data is stored locally and accessible through Chrome DevTools

## Children's Privacy

MCP Assistant is not intended for children under 13. We do not knowingly collect information from children under 13.

## Changes to This Policy

We may update this privacy policy from time to time. When we do:
- The "Last Updated" date will be revised
- Material changes will be communicated through the extension or our website
- Continued use of the extension constitutes acceptance of changes

## Data Retention

- **Local Data**: Stored until you uninstall the extension or clear Chrome's storage
- **Authentication Tokens**: Expire according to Google's OAuth token lifetime
- **No Server-Side Retention**: We do not retain your personal data on our servers

## Contact Us

If you have questions about this privacy policy or your data:

- **GitHub Issues**: https://github.com/ashen-dusk/chrome-extension/issues
- **Email**: [Your contact email]
- **Repository**: https://github.com/ashen-dusk/chrome-extension

## Open Source

MCP Assistant is open source. You can review our code at:
https://github.com/ashen-dusk/chrome-extension

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Google API Services User Data Policy
- General Data Protection Regulation (GDPR) principles

---

**Your Privacy Matters**: We are committed to protecting your privacy and being transparent about our data practices. This extension is designed to keep your data local and secure.
