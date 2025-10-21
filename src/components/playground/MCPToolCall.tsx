"use client";

import { Loader2, CheckCircle2, XCircle, ChevronDown, Copy, Wrench } from "lucide-react";
import * as React from "react";

type ToolCallData = Record<string, unknown> | string | null | undefined;

interface ToolCallProps {
  status: "complete" | "inProgress" | "executing";
  name?: string;
  args?: ToolCallData;
  result?: ToolCallData;
}

export default function MCPToolCall({
  status,
  name = "",
  args,
  result,
}: ToolCallProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Format content for display
  const format = (content: ToolCallData): string => {
    if (!content) return "";
    const text =
      typeof content === "object"
        ? JSON.stringify(content, null, 2)
        : String(content);
    return text
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  };

  const getStatusConfig = () => {
    if (status === "complete") {
      console.log(result, "MCPToolCall Result");
      if (result && typeof result === "object" && "error" in result) {
        const errorMessage = JSON.stringify(result.error);
        console.log(errorMessage, "MCPToolCall Error");
        return {
          icon: <XCircle className="w-5 h-5 text-destructive" />,
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/50",
          textColor: "text-destructive",
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasError = result === "" ? false : (typeof result === "object" && result !== null && "content" in result ? JSON.parse((result as any).content?.[0]?.text || "{}")?.error : false);
        if (hasError) {
          return {
            icon: <XCircle className="w-5 h-5 text-destructive" />,
            bgColor: "bg-destructive/10",
            borderColor: "border-destructive/50",
            textColor: "text-destructive",
          };
        }
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/50",
          textColor: "text-green-600 dark:text-green-400",
        };
      }
    }
    return {
      icon: <Loader2 className="w-5 h-5 animate-spin text-blue-500" />,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/50",
      textColor: "text-blue-600 dark:text-blue-400",
    };
  };

  const config = getStatusConfig();

  const handleCopy = (content: string) => {
    navigator.clipboard?.writeText(content);
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-l-4 rounded overflow-hidden transition-all duration-200`}
    >
      <div
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-muted-foreground" />
              <span className={`${config.textColor} font-medium text-sm truncate`}>
                {name || "MCP Tool Call"}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
          {args && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Parameters
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(args));
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-muted p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-border">
                {format(args)}
              </pre>
            </div>
          )}

          {status === "complete" && result && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Result
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(result));
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-muted p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-border">
                {format(result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
