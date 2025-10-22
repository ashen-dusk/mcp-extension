import { useCallback } from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { ToolRenderer } from './playground/ToolRenderer';
import ChatInput from './playground/ChatInput';
import '@copilotkit/react-ui/styles.css';
import { AssistantMessage } from './playground/ChatMessage';

interface ChatInterfaceProps {
  onBack: () => void;
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

export function ChatInterface({ onBack, user }: ChatInterfaceProps) {
  // Wrapper component that integrates with CopilotKit's input system
  const ChatInputWrapper = useCallback((props: any) => {
    return (
      <div className="w-full">
        <ChatInput
          onSendMessage={props.onSend}
          user={user}
        />
      </div>
    );
  }, [user]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <ToolRenderer />
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-2 bg-background">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">MCP Assistant</h1>
          <span className="text-xs text-muted-foreground truncate block">
            {user?.email}
          </span>
        </div>
      </div>

      {/* CopilotChat Component with Custom Input */}
      <div className="flex-1 overflow-hidden">
        <CopilotChat
          labels={{
            initial: "Hello! I'm your MCP assistant. How can I help you today?",
            title: "MCP Assistant",
            placeholder: "Ask about your connected servers...",
          }}
          className="h-full"
          Input={ChatInputWrapper}
          AssistantMessage={AssistantMessage}
        />
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">MCP Chat</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => chrome.tabs.create({ url: 'https://modelcontextprotocol.io' })}
              className="hover:text-foreground transition-colors"
            >
              MCP
            </button>
            <button
              onClick={() => chrome.tabs.create({ url: 'https://ashen-dusk.github.io/mcp-extension/privacy.html' })}
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => chrome.tabs.create({ url: 'https://mcpassistant.vercel.app/docs' })}
              className="hover:text-foreground transition-colors"
            >
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
