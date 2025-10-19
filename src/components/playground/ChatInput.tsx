"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CheckCircle,
  ArrowUp
} from "lucide-react";

interface CustomChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", icon: "🤖" },
  { id: "gpt-4o", name: "GPT-4o", icon: "🧠" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", icon: "⚡" },
  { id: "deepseek-chat", name: "DeepSeek-V3", icon: "🚀" },
];

export default function ChatInput({ onSendMessage, state, setState }: CustomChatInputProps) {
  const [message, setMessage] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleModelChange = (modelId: string) => {
    setState((prevState: any) => ({
      ...prevState,
      model: modelId,
    }));
    setShowModelDropdown(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === state.model) || AVAILABLE_MODELS[0];

  return (
    <div className="w-full px-4 py-3">
      <div className="relative bg-zinc-800 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-end p-4">
          {/* Message Input Area */}
          <div className="flex-1 mr-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your prompt..."
              className="w-full resize-none bg-transparent border-0 outline-none text-gray-100 placeholder-gray-500 text-[15px] leading-relaxed"
              rows={1}
              style={{
                minHeight: '60px',
                maxHeight: '120px',
                overflowY: message.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>

          {/* Model Selection Dropdown */}
          <div className="relative mr-2">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-zinc-700/50 rounded transition-all duration-200"
            >
              <span className="text-base">{selectedModelData?.icon}</span>
              <span className="text-xs font-medium text-gray-300 hidden sm:inline">
                {selectedModelData?.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showModelDropdown && (
              <>
                <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
                  <div className="py-1">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition-all duration-150
                          ${state.model === model.id
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                      >
                        <span className="text-base">{model.icon}</span>
                        <span className="text-sm font-medium flex-1">{model.name}</span>
                        {state.model === model.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowModelDropdown(false)}
                />
              </>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:opacity-50
                     text-white rounded-lg p-2 h-8 w-8 flex items-center justify-center
                     transition-all duration-200 shadow-lg"
          >
              <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
