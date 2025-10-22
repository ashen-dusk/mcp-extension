import { useState, useMemo } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { useAuth } from './hooks/useAuth';
import { useMcpServers } from './hooks/useMcpServers';
import { LoginScreen } from './components/LoginScreen';
import { ServerList } from './components/ServerList';
import { ChatInterface } from './components/ChatInterface';
import { Loader2 } from 'lucide-react';

type View = 'servers' | 'chat';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('servers');
  const { authState, loading: authLoading, isAuthenticated, login, logout } = useAuth();
  const {
    servers,
    loading: serversLoading,
    fetchServers,
    restartServer,
    // COMMENTED OUT: Delete server feature
    // deleteServer,
    connectServer,
    disconnectServer,
    toggleContext,
  } = useMcpServers(isAuthenticated);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-foreground text-lg">
            Signing you in
          </span>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  // Show chat interface
  if (currentView === 'chat') {
    return (
      <ChatInterface
        onBack={() => setCurrentView('servers')}
        user={authState?.user}
      />
    );
  }

  // Show server list when authenticated
  return (
    <ServerList
      servers={servers}
      loading={serversLoading}
      onRefresh={fetchServers}
      onRestart={restartServer}
      // COMMENTED OUT: Delete server feature
      // onDelete={deleteServer}
      onConnect={connectServer}
      onDisconnect={disconnectServer}
      onToggleContext={toggleContext}
      onLogout={logout}
      onOpenChat={() => setCurrentView('chat')}
      user={authState?.user}
    />
  );
}

function App() {
  const { authState } = useAuth();

  // Prepare headers for CopilotKit with authentication
  const copilotHeaders = useMemo((): Record<string, string> | undefined => {
    if (authState?.googleIdToken) {
      return {
        'Authorization': `Bearer ${authState.googleIdToken}`,
      };
    }
    return undefined;
  }, [authState?.googleIdToken]);

  return (
    <CopilotKit
      agent="mcpAssistant"
      runtimeUrl="https://express-copilotkit-runtime.vercel.app/copilotkit"
      headers={copilotHeaders}
    >
      <AppContent />
    </CopilotKit>
  );
}

export default App;
