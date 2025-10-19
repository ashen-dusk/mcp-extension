"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";

interface ToolCallProps {
  status: "complete" | "inProgress" | "executing";
  name?: string;
  args?: any;
  result?: any;
}

export default function MCPToolCall({
  status,
  name = "",
  args,
  result,
}: ToolCallProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Format content for display
  const format = (content: any): string => {
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

  const getStatusIcon = () => {
    if (status === "complete") {
      console.log(result, "MCPToolCall Result");
      if (result && result.error) {
        const errorMessage = JSON.stringify(result.error);
        console.log(errorMessage, "MCPToolCall Error");
        return (
          <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      } else {
        return (
          (result === "" ? false : JSON.parse(result?.content?.[0]?.text || "{}")?.error) ? (
            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        );
      }
    }
    return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (status === "complete") {
      if (result && result.error) {
        return <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">Error</span>;
      }
      const hasError = result === "" ? false : JSON.parse(result?.content?.[0]?.text || "{}")?.error;
      if (hasError) {
        return <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">Error</span>;
      }
      return <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">Done</span>;
    }
    return <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded animate-pulse">Running</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full transition-all duration-200 hover:shadow-md">
      <div
        className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {name || "MCP Tool Call"}
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {isOpen && (
        <div className="px-3 pb-3 pt-2 bg-gray-50 border-t border-gray-200">
          {args && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Parameters
              </div>
              <pre className="text-[10px] bg-white p-2 rounded border border-gray-200 overflow-auto max-h-[120px] font-mono text-gray-700">
                {format(args)}
              </pre>
            </div>
          )}

          {status === "complete" && result && (
            <div>
              <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Result
              </div>
              <pre className="text-[10px] bg-white p-2 rounded border border-gray-200 overflow-auto max-h-[120px] font-mono text-gray-700">
                {format(result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
