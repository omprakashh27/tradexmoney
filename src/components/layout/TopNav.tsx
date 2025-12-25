import { cn } from '@/lib/utils';
import {
  Bell,
  User,
  Moon,
  Sun,
  ChevronDown,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar, SearchableAsset } from '@/components/SearchBar';

interface TopNavProps {
  sidebarCollapsed: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  searchAssets: SearchableAsset[];
  onSelectAsset: (asset: SearchableAsset) => void;
}

const notifications = [
  { id: 1, title: 'BTC reached $98,500', time: '2 min ago', type: 'price' },
  { id: 2, title: 'Order executed: Buy 0.5 BTC', time: '15 min ago', type: 'order' },
  { id: 3, title: 'Market opening in 30 minutes', time: '1 hour ago', type: 'market' },
];

export function TopNav({ sidebarCollapsed, isDarkMode, onToggleTheme, searchAssets, onSelectAsset }: TopNavProps) {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <SearchBar assets={searchAssets} onSelectAsset={onSelectAsset} />

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Market Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-profit/10 border border-profit/20">
            <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-medium text-profit">Market Open</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-all duration-200 group"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2.5 rounded-xl bg-secondary hover:bg-accent transition-all duration-200 group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary text-sm font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-secondary hover:bg-accent transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">Pro Trader</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
              <DropdownMenuItem className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-loss">
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
