import { useState } from 'react';
import { LogIn, UserCheck, Plug, MessageSquare, ToggleLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LoginScreenProps {
  onLogin: () => Promise<{ success: boolean; error?: string }>;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const result = await onLogin();

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      <Card className="w-full border-0">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <CardTitle>MCP Assistant</CardTitle>
          <CardDescription>
            Sign in to manage your MCP servers and interact with your AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
            size="lg"
          >
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Getting Started Guide */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">How to Get Started</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">Sign In</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Authenticate with your Google account to access the assistant</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Plug className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">Connect MCP Servers</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Browse available MCPs (e.g., Tavily for web search) and click connect to enable their tools</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">Ask Your Agent</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Start chatting and ask about real-time events using connected MCP capabilities</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ToggleLeft className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">Manage Context</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Toggle the context button to exclude specific MCPs from agent interactions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-6">
            <p>By signing in, you agree to use your existing</p>
            <p>MCP Assistant account credentials</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
