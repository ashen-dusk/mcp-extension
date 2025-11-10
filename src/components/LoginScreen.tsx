import { useState } from 'react';
import { UserCheck, Plug, MessageSquare, ToggleLeft } from 'lucide-react';
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
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <img
              src={'/icons/icon-128.png'}
              alt={'MCP Assistant Logo'}
              className="w-12 h-12 rounded-lg object-cover border-2 border-primary/20"
            />
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
              {/* <LogIn className="mr-2 h-4 w-4" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
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

          <div className="text-xs text-muted-foreground text-center pt-6 space-y-2">
            <p>By signing in, you agree to use your existing</p>
            <p>MCP Assistant account credentials</p>
            <button
              onClick={() => chrome.tabs.create({ url: 'https://ashen-dusk.github.io/mcp-extension/privacy.html' })}
              className="text-primary hover:underline"
            >
              Privacy Policy
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
