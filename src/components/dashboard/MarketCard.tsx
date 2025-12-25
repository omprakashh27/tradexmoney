import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex } from '@/data/mockData';

interface MarketCardProps {
  data: MarketIndex;
  index: number;
}

function Sparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${isPositive ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#gradient-${isPositive ? 'up' : 'down'})`}
        points={`0,100 ${points} 100,100`}
      />
      <polyline
        fill="none"
        stroke={isPositive ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function MarketCard({ data, index }: MarketCardProps) {
  const isPositive = data.change >= 0;

  return (
    <div
      style={{ animationDelay: `${index * 100}ms` }}
      className={cn(
        'glass-card rounded-xl p-5 animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer gradient-border',
        isPositive ? 'hover:glow-profit' : 'hover:glow-loss'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {data.symbol}
          </span>
          <h3 className="text-sm font-medium text-foreground/80 mt-0.5">{data.name}</h3>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all',
            isPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
        </div>
      </div>

      <div className="mb-4">
        <Sparkline data={data.sparkline} isPositive={isPositive} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-foreground">
            {data.price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <span
          className={cn(
            'text-sm font-medium',
            isPositive ? 'text-profit' : 'text-loss'
          )}
        >
          {isPositive ? '+' : ''}{data.change.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
