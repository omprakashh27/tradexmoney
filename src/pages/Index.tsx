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
import { marketIndices } from '@/data/mockData';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNavItem}
        onItemClick={setActiveNavItem}
      />

      {/* Top Navigation */}
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
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
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your market overview.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Last updated:</span>
              <span className="font-medium text-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Market Overview Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketIndices.map((index, i) => (
              <MarketCard key={index.id} data={index} index={i} />
            ))}
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="xl:col-span-2 space-y-6">
              <PriceChart />
              <RecentOrders />
            </div>

            {/* Right Column - Watchlist & Order Book */}
            <div className="space-y-6">
              <Watchlist />
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
