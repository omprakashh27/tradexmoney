import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import type { WatchlistItem } from '@/data/mockData';

interface WatchlistProps {
  items: WatchlistItem[];
  getUpdateDirection: (id: string) => 'up' | 'down' | 'none';
}

export function Watchlist({ items, getUpdateDirection }: WatchlistProps) {
  const [localItems, setLocalItems] = useState<string[]>(items.map(i => i.id));
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const visibleItems = items.filter(item => localItems.includes(item.id));

  const removeItem = (id: string) => {
    setLocalItems(prev => prev.filter(itemId => itemId !== id));
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Watchlist</h2>
        </div>
        <button className="p-1.5 rounded-lg bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-secondary/50 sticky top-0">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Symbol
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Price
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Change
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleItems.map((item, index) => {
                const isPositive = item.change >= 0;
                const updateDirection = getUpdateDirection(item.id);
                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'transition-colors duration-200 cursor-pointer',
                      hoveredRow === item.id ? 'bg-accent/50' : 'hover:bg-accent/30'
                    )}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {item.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item.symbol}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span 
                        key={`watchlist-price-${item.id}-${item.price.toFixed(2)}`}
                        className={cn(
                          'text-sm font-semibold text-foreground inline-block',
                          updateDirection === 'up' && 'price-blink-up',
                          updateDirection === 'down' && 'price-blink-down'
                        )}
                      >
                        ₹{item.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold',
                          isPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-loss hover:bg-loss-subtle transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ opacity: hoveredRow === item.id ? 1 : 0 }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
