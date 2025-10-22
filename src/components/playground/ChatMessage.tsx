import { UserMessageProps, AssistantMessageProps } from "@copilotkit/react-ui";
import { Markdown } from "@copilotkit/react-ui";
import { User, Bot } from "lucide-react";

export function UserMessage({ message }: UserMessageProps) {
  // Extract message content safely - handle both string and object cases
  const getMessageContent = () => {
    if (typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object') {
      // Try multiple possible properties
      const msg = message as any;
      return msg.content || msg.text || msg.body || msg.message || '';
    }

    return '';
  };

  return (
    <div className="flex items-start gap-3 px-4 py-3 flex-row-reverse">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8">
        <div className="w-full h-full flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Message */}
      <div className="relative py-2 px-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm leading-relaxed bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <div className="whitespace-pre-wrap text-foreground">{getMessageContent()}</div>
      </div>
    </div>
  );
}

export function AssistantMessage({ message, isLoading }: AssistantMessageProps) {
  // Extract message content safely - handle both string and object cases
  const getMessageContent = () => {
    if (typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object') {
      // Try multiple possible properties
      const msg = message as any;
      return msg.content || msg.text || msg.body || msg.message || '';
    }

    return '';
  };

  const messageContent = getMessageContent();

  console.log(messageContent, "AssistantMessage Content");

  // Don't render anything if there's no content and not loading
  if (!messageContent && !isLoading) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8">
        <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Message */}
      <div className="flex-1 max-w-[80%]">
        {isLoading ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {messageContent && <Markdown content={messageContent} />}
          </div>
        )}
      </div>
    </div>
  );
}