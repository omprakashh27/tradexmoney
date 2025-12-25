import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { MarketCard } from '@/components/dashboard/MarketCard';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { Watchlist } from '@/components/dashboard/Watchlist';
import { OrderBook } from '@/components/dashboard/OrderBook';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { marketIndices, watchlistData } from '@/data/mockData';
import { useRealtimePrices } from '@/hooks/useRealtimePrices';
import type { SearchableAsset } from '@/components/SearchBar';

// Build searchable assets from market indices and watchlist
const buildSearchableAssets = (
  indices: typeof marketIndices,
  watchlist: typeof watchlistData
): SearchableAsset[] => {
  const fromIndices: SearchableAsset[] = indices.map((item) => ({
    id: `index-${item.id}`,
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    changePercent: item.changePercent,
    type: (item.symbol === 'BTC' || item.symbol === 'ETH' ? 'crypto' : 'index') as 'crypto' | 'index',
  }));

  const fromWatchlist: SearchableAsset[] = watchlist.map((item) => ({
    id: `stock-${item.id}`,
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    changePercent: item.changePercent,
    type: 'stock' as const,
  }));

  return [...fromIndices, ...fromWatchlist];
};

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState<SearchableAsset | null>(null);

  // Real-time price simulation for market indices
  const { 
    data: realtimeMarketIndices, 
    getUpdateDirection: getMarketUpdateDirection 
  } = useRealtimePrices(marketIndices, 2000, 0.001);

  // Real-time price simulation for watchlist
  const { 
    data: realtimeWatchlist, 
    getUpdateDirection: getWatchlistUpdateDirection 
  } = useRealtimePrices(watchlistData, 1500, 0.0015);

  // Build searchable assets with real-time prices
  const searchableAssets = buildSearchableAssets(realtimeMarketIndices, realtimeWatchlist);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
    // For now, all navigation stays on dashboard
    // In a real app, you'd use react-router here
  };

  const handleSelectAsset = (asset: SearchableAsset) => {
    setSelectedAsset(asset);
  };

  const handleMarketCardClick = (index: typeof realtimeMarketIndices[0]) => {
    const assetType: 'crypto' | 'index' = index.symbol === 'BTC' || index.symbol === 'ETH' ? 'crypto' : 'index';
    setSelectedAsset({
      id: `index-${index.id}`,
      symbol: index.symbol,
      name: index.name,
      price: index.price,
      changePercent: index.changePercent,
      type: assetType,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
      />

      {/* Top Navigation */}
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        searchAssets={searchableAssets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-20 pb-8 px-6 transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">{activeNavItem}</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your market overview.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-profit"></span>
              </span>
              <span>Live</span>
              <span className="font-medium text-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Market Overview Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {realtimeMarketIndices.map((index, i) => (
              <MarketCard 
                key={index.id} 
                data={index} 
                index={i} 
                updateDirection={getMarketUpdateDirection(index.id)}
                onClick={() => handleMarketCardClick(index)}
              />
            ))}
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="xl:col-span-2 space-y-6">
              <PriceChart selectedAsset={selectedAsset} />
              <RecentOrders />
            </div>

            {/* Right Column - Watchlist & Order Book */}
            <div className="space-y-6">
              <Watchlist 
                items={realtimeWatchlist} 
                getUpdateDirection={getWatchlistUpdateDirection} 
              />
              <OrderBook />
            </div>
          </div>

          {/* Portfolio Summary */}
          <PortfolioSummary />
        </div>
      </main>
    </div>
  );
};

export default Index;
