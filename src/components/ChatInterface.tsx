import { useEffect, useState, useCallback } from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import { useCoAgent } from '@copilotkit/react-core';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { ToolRenderer } from './playground/ToolRenderer';
import ChatInput from './playground/ChatInput';
import '@copilotkit/react-ui/styles.css';

interface ChatInterfaceProps {
  onBack: () => void;
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

interface AgentState {
  model: string;
  status: string | null | undefined;
  sessionId: string;
}

export function ChatInterface({ onBack, user }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize agent state with session ID
  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: "gpt-4o-mini",
      status: undefined,
      sessionId: sessionId,
    },
  });

  // Update session ID when user changes
  useEffect(() => {
    const email = user?.email;
    let id = '';
    if (email && email.endsWith("@gmail.com")) {
      id = email.replace(/@gmail\.com$/, "");
    } else {
      id = email || '';
    }
    setSessionId(id);

    setState((prevState: AgentState | undefined) => ({
      model: prevState?.model ?? "gpt-4o-mini",
      status: prevState?.status,
      sessionId: id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Wrapper component that integrates with CopilotKit's input system
  const ChatInputWrapper = useCallback((props: any) => {
    return (
      <div className="w-full">
        <ChatInput
          onSendMessage={props.onSend}
          state={state}
          setState={setState}
        />
      </div>
    );
  }, [state, setState]);

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
        />
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">MCP Chat</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="truncate">{state.model}</span>
          </div>
          <div className="flex items-center gap-3">
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
