import { Header } from './Header';
import { Sparkles, Package, Lock, Server, BarChart3, Mic } from 'lucide-react';
import { Card } from './ui/card';

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

const upcomingFeatures = [
  {
    icon: Lock,
    title: "OAuth2 Protected MCPs",
    description: "Secure authentication for protected MCP endpoints using OAuth2 flow",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Server,
    title: "Localhost MCP Support",
    description: "Connect to locally running MCP servers (stdio/subprocess) for development workflows",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "MCP Insights",
    description: "View available tools, schemas, and capabilities of connected MCP servers",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Mic,
    title: "Speech Transmission",
    description: "Interact with MCP Assistant using voice commands",
    color: "from-indigo-500 to-violet-500"
  },
  {
    icon: Package,
    title: "More MCPs",
    description: "Access to more remote MCP servers for various use cases",
    color: "from-blue-500 to-cyan-500"
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
          {/* Hero Section */}
          <div className="text-center space-y-3 py-6">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Coming in Upcoming Releases
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              We're constantly working to improve your MCP Assistant experience. Here's what's coming soon!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-5 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-base">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
                        Soon
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Footer Section */}
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Have a feature request or suggestion?
            </p>
            <Button
              variant="outline"
              onClick={() => chrome.tabs.create({ url: 'https://mcpassistant.vercel.app/feedback' })}
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
            <span className="text-muted-foreground/80">Upcoming Features</span>
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
