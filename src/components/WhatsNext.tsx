import { Header } from './Header';
import { Sparkles, Package, BarChart3, Check, ExternalLink, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface WhatsNextProps {
  onBack: () => void;
  onLogout: () => void;
  onChat?: () => void;
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

const completedFeatures = [
  {
    icon: Package,
    title: "More MCPs",
    description: "Access to more remote MCP servers for various use cases",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BarChart3,
    title: "MCP Insights",
    description: "View available tools, schemas, and capabilities of connected MCP servers",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Lock,
    title: "OAuth MCP Support",
    description: "OAuth-protected MCP servers are now supported in the web app",
    color: "from-purple-500 to-pink-500",
    webOnly: true
  },
];

export function WhatsNext({ onBack, onLogout, onChat, user }: WhatsNextProps) {
  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <Header
        user={user}
        onServers={onBack}
        onChat={onChat}
        onLogout={onLogout}
        currentView="whatsnext"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Add Your Own MCP Server Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add Your Own MCP Server
              </h2>
            </div>
            <p className="text-muted-foreground text-xs">
              Want to add your custom MCP server? Follow these simple steps!
            </p>

            <Card className="p-4 border-0">
              <div className="space-y-3">
                <p className="text-xs font-medium text-foreground">
                  Follow these steps to add your MCP server:
                </p>

                <ol className="text-xs text-muted-foreground space-y-2 ml-4 list-decimal">
                  <li>
                    <span className="font-medium text-foreground">Visit the web app</span> and navigate to the MCP section
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Add your MCP server</span> with all the required configuration
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Check "Share with other users"</span> to make this server available in the extension.
                    <span className="block mt-1 text-muted-foreground/80">
                      If unchecked, it will only be accessible within the web app.
                    </span>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Save the configuration</span>
                  </li>
                  <li>
                    Your server will now appear in this extension and be available for all users
                  </li>
                </ol>

                <div className="pt-2 space-y-3">
                  {/* Screenshot */}
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src="/add-mcp-guide.png"
                      alt="Add MCP Server Form - showing transport types, category selection, and Share with other users checkbox"
                      className="w-full h-auto"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Not sure where to start?</span> Check out OAuth-protected servers or add your own and start testing in the web app!
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 w-full"
                    onClick={() => chrome.tabs.create({ url: 'https://www.mcp-assistant.in/mcp' })}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Web App - Add MCP Server
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* What's New Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                What's New
              </h2>
            </div>
            <p className="text-muted-foreground text-xs">
              Recently added features now available in your extension!
            </p>

            <div className="grid gap-3">
              {completedFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-4 border-0"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-sm">
                            {feature.title}
                          </h3>
                          {feature.webOnly && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              Web Only
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Completed Badge */}
                      <div className="shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                          <Check className="w-3 h-3 mr-1" />
                          Live
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Footer Section */}
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Have a feature request or suggestion?
            </p>
            <Button
              variant="outline"
              onClick={() => chrome.tabs.create({ url: 'https://www.mcp-assistant.in/feedback' })}
              className="gap-2"
            >
              Share Your Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">MCP Assistant</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground/80">Add Your Server</span>
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
              onClick={() => chrome.tabs.create({ url: 'https://www.mcp-assistant.in/docs' })}
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
