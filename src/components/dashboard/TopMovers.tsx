import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Flame, Snowflake } from 'lucide-react';
import type { WatchlistItem } from '@/data/mockData';

interface TopMoversProps {
  items: WatchlistItem[];
  getUpdateDirection: (id: string) => 'up' | 'down' | 'none';
}

export function TopMovers({ items, getUpdateDirection }: TopMoversProps) {
  const sortedItems = [...items].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sortedItems.slice(0, 3);
  const losers = sortedItems.slice(-3).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <div className="glass-card rounded-xl p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-profit/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-profit" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Top Gainers</h3>
        </div>
        <div className="space-y-3">
          {gainers.map((item, index) => {
            const updateDirection = getUpdateDirection(item.id);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    #{index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-profit/20 to-profit/5 flex items-center justify-center">
                    <span className="text-xs font-bold text-profit">
                      {item.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'text-sm font-semibold text-foreground',
                    updateDirection === 'up' && 'price-blink-up',
                    updateDirection === 'down' && 'price-blink-down'
                  )}>
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-profit text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Losers */}
      <div className="glass-card rounded-xl p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-loss/20 flex items-center justify-center">
            <Snowflake className="w-4 h-4 text-loss" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Top Losers</h3>
        </div>
        <div className="space-y-3">
          {losers.map((item, index) => {
            const updateDirection = getUpdateDirection(item.id);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    #{index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-loss/20 to-loss/5 flex items-center justify-center">
                    <span className="text-xs font-bold text-loss">
                      {item.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'text-sm font-semibold text-foreground',
                    updateDirection === 'up' && 'price-blink-up',
                    updateDirection === 'down' && 'price-blink-down'
                  )}>
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-loss text-xs font-semibold">
                    <TrendingDown className="w-3 h-3" />
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
