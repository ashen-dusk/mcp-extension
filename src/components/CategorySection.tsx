import { Category } from '@/types';
import { ServerCard } from './ServerCard';

interface CategorySectionProps {
  category: Category;
  onRestart: (serverName: string) => Promise<any>;
  onConnect: (serverName: string) => Promise<any>;
  onDisconnect: (serverName: string) => Promise<any>;
  onToggleContext: (serverName: string, enabled: boolean) => Promise<any>;
}

// Map category icon to full path
const getCategoryIcon = (icon: string | null | undefined, slug: string) => {
  // Use the icon field if available, otherwise fallback to slug
  const filename = icon || `${slug}.png`;
  return `/categories/${filename}`;
};

export function CategorySection({
  category,
  onRestart,
  onConnect,
  onDisconnect,
  onToggleContext,
}: CategorySectionProps) {
  const serverCount = category.servers.length;
  const connectedCount = category.servers.filter(s => s.connectionStatus === 'CONNECTED').length;

  return (
    <div className="space-y-3">
      {/* Category Header - Non-collapsible */}
      <div className="flex items-center gap-2.5 px-2">
        {/* Category Icon */}
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <img
            src={getCategoryIcon(category.icon, category.slug)}
            alt={category.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-base">📦</span>
        </div>

        {/* Category Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-xs text-foreground/90 flex items-center gap-1.5">
            {category.name}
            <span className="text-[10px] font-normal text-muted-foreground">
              {serverCount}
            </span>
          </h3>
        </div>

        {/* Connected Count Badge */}
        {connectedCount > 0 && (
          <div className="px-1.5 py-0.5 rounded-md bg-green-500/15">
            <span className="text-[10px] font-medium text-green-400">
              {connectedCount}
            </span>
          </div>
        )}
      </div>

      {/* Servers List - Always visible */}
      <div className="space-y-2">
        {category.servers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            onRestart={onRestart}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onToggleContext={onToggleContext}
          />
        ))}
      </div>
    </div>
  );
}
