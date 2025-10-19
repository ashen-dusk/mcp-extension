# Chat Feature Setup Guide

The Chrome extension now includes an AI chat assistant powered by CopilotKit.

## Setup Instructions

### 1. Install Dependencies

Dependencies are already included in package.json:
- `@copilotkit/react-core`: Core CopilotKit functionality
- `@copilotkit/react-ui`: UI components (already installed)
- `@copilotkit/runtime-client-gql`: GraphQL runtime client

### 2. Environment Variables (Optional)

Create a `.env` file in the `chrome-extension` folder:

```bash
cp .env.example .env
```

Then add your CopilotKit API key (optional, for premium features):

```
VITE_COPILOTKIT_PUBLIC_API_KEY=your_key_here
```

Get a free key at: https://cloud.copilotkit.ai/

**Note:** The chat will work without the API key, but some premium features may be limited.

### 3. Backend Configuration

The extension connects to:
```
https://api.quicklit.in/gen-ai/api/langgraph-agent
```

This endpoint should:
- Accept POST requests with CopilotKit message format
- Return streaming responses in CopilotKit format
- Include CORS headers for Chrome extension origins

### 4. Permissions

The manifest.json already includes the necessary permissions:
- `https://api.quicklit.in/*` for API access
- Storage and identity for authentication

## Features

### Chat Interface
- **Clean, minimal UI** with message bubbles
- **Real-time streaming** responses
- **Loading indicators** while assistant is typing
- **Auto-scroll** to latest message
- **Multi-line input** with Shift+Enter support

### Navigation
- Click the **"Chat"** button in server list to open chat
- Click the **back arrow** in chat to return to server list
- Seamless transitions between views

### Message Display
- User messages appear on the right (blue)
- Assistant messages appear on the left (gray)
- Typing indicator with animated dots
- Empty state with helpful prompt

## Usage

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Load the extension** from the `dist` folder

3. **Log in** with your Google account

4. **Click "Chat"** button to start chatting

5. **Type your message** and press Enter (or click Send)

## How It Works

### CopilotKit Integration

The app is wrapped with `CopilotKit` provider in `App.tsx`:

```typescript
<CopilotKit
  runtimeUrl="https://api.quicklit.in/gen-ai/api/copilotkit"
  publicApiKey={import.meta.env.VITE_COPILOTKIT_PUBLIC_API_KEY}
>
  <AppContent />
</CopilotKit>
```

### Chat Component

`ChatInterface.tsx` uses the `useCopilotChatHeadless_c` hook:

```typescript
const { messages, sendMessage, isLoading } = useCopilotChatHeadless_c();
```

This provides:
- `messages`: Array of all messages (user + assistant)
- `sendMessage`: Function to send new messages
- `isLoading`: Boolean indicating if assistant is responding

### State Management

- View state managed in `AppContent` component
- Chat state managed by CopilotKit internally
- Server state managed by `useMcpServers` hook

## Troubleshooting

### Chat not loading
- Check that backend URL is accessible
- Verify CORS headers on backend
- Check browser console for errors

### Messages not sending
- Ensure you're authenticated
- Check network tab for failed requests
- Verify backend is returning proper response format

### Streaming not working
- Backend must support streaming responses
- Check that Content-Type headers are correct
- Verify WebSocket connection if applicable

## Customization

### Styling
All components use Tailwind CSS classes. Modify in:
- `ChatInterface.tsx` for chat UI
- `ServerList.tsx` for button placement
- `App.tsx` for layout

### Backend
To use a different endpoint, update the `runtimeUrl` in `App.tsx`.

### Message Format
CopilotKit uses this format:
```typescript
{
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
```

## Next Steps

- Add context from MCP servers to chat
- Implement tool calling
- Add message history persistence
- Add markdown rendering for responses
- Add file upload support
