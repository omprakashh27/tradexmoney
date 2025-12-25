import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex } from '@/data/mockData';

interface MarketPulseProps {
  indices: MarketIndex[];
  getUpdateDirection: (id: string) => 'up' | 'down' | 'none';
  onSelectIndex: (index: MarketIndex) => void;
}

export function MarketPulse({ indices, getUpdateDirection, onSelectIndex }: MarketPulseProps) {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Market Pulse</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {indices.map((index) => {
          const isPositive = index.change >= 0;
          const updateDirection = getUpdateDirection(index.id);

          return (
            <button
              key={index.id}
              onClick={() => onSelectIndex(index)}
              className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {index.symbol}
                </span>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-profit" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-loss" />
                )}
              </div>
              
              <p className={cn(
                'text-lg font-bold text-foreground mb-1',
                updateDirection === 'up' && 'price-blink-up',
                updateDirection === 'down' && 'price-blink-down'
              )}>
                {index.symbol === 'BTC' || index.symbol === 'ETH' 
                  ? `$${index.price.toLocaleString()}`
                  : index.price.toLocaleString()
                }
              </p>
              
              <div className={cn(
                'text-xs font-semibold',
                isPositive ? 'text-profit' : 'text-loss'
              )}>
                {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
              </div>

              {/* Mini sparkline visualization */}
              <div className="flex items-end gap-0.5 h-6 mt-3">
                {index.sparkline.slice(-8).map((value, i, arr) => {
                  const min = Math.min(...arr);
                  const max = Math.max(...arr);
                  const height = ((value - min) / (max - min)) * 100 || 50;
                  
                  return (
                    <div
                      key={i}
                      style={{ height: `${Math.max(height, 10)}%` }}
                      className={cn(
                        'flex-1 rounded-sm transition-all duration-300',
                        isPositive ? 'bg-profit/60' : 'bg-loss/60',
                        i === arr.length - 1 && (isPositive ? 'bg-profit' : 'bg-loss')
                      )}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
