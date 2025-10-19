import { useEffect, useCallback } from 'react';
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
  status: string | null;
  sessionId: string;
}

export function ChatInterface({ onBack, user }: ChatInterfaceProps) {
  // Initialize agent state with session ID
  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: "gpt-4o-mini",
      status: null,
      sessionId: user?.email?.replace(/@gmail\.com$/, '') || user?.email || '',
    },
  });

  // Update session ID when user changes
  useEffect(() => {
    const sessionId = user?.email?.replace(/@gmail\.com$/, '') || user?.email || '';
    setState((prevState: AgentState | undefined) => ({
      model: prevState?.model ?? "gpt-4o-mini",
      status: prevState?.status ?? null,
      sessionId,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Wrapper component that integrates with CopilotKit's input system
  // setState is stable from useCoAgent, so we only need state in deps
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
  }, [state]);

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-background">
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
    </div>
  );
}
