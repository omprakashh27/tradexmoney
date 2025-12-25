import { useState } from 'react';
import { cn } from '@/lib/utils';
import { chartData } from '@/data/mockData';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const prices = chartData.map((d) => d.price);
  const min = Math.min(...prices) - 100;
  const max = Math.max(...prices) + 100;
  const range = max - min;

  const currentPrice = 98542.80;
  const priceChange = 2341.50;
  const priceChangePercent = 2.43;
  const isPositive = priceChange >= 0;

  // Generate candlestick-like bars
  const bars = chartData.map((point, i) => {
    const prevPrice = i > 0 ? chartData[i - 1].price : point.price;
    const isUp = point.price >= prevPrice;
    const barHeight = Math.abs(point.price - prevPrice) / range * 200 + 20;
    const y = ((max - Math.max(point.price, prevPrice)) / range) * 200;

    return { ...point, isUp, barHeight, y, prevPrice };
  });

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">BTC/USDT</h2>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                Binance
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold text-foreground">
                ${currentPrice.toLocaleString()}
              </span>
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold',
                  isPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
                )}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                activeTimeframe === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-[300px] mb-6">
        {/* Price Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center w-full">
              <span className="text-xs text-muted-foreground w-16 text-right pr-4">
                ${(max - (range / 4) * i).toFixed(0)}
              </span>
              <div className="flex-1 border-t border-border/30" />
            </div>
          ))}
        </div>

        {/* Candlestick Bars */}
        <div className="absolute left-16 right-0 top-4 bottom-4 flex items-end justify-between gap-2">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 relative group cursor-pointer"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Candle Body */}
              <div
                className={cn(
                  'w-full rounded-sm transition-all duration-200',
                  bar.isUp ? 'bg-profit' : 'bg-loss',
                  hoveredPoint === i && 'opacity-80 scale-105'
                )}
                style={{
                  height: `${bar.barHeight}px`,
                  marginTop: `${bar.y}px`,
                }}
              />

              {/* Volume Bar */}
              <div
                className={cn(
                  'absolute bottom-0 w-full rounded-sm opacity-30',
                  bar.isUp ? 'bg-profit' : 'bg-loss'
                )}
                style={{ height: `${(bar.volume / 2500) * 50}px` }}
              />

              {/* Tooltip */}
              {hoveredPoint === i && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 animate-fade-in">
                  <div className="bg-popover border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
                    <p className="text-xs text-muted-foreground">{bar.time}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      ${bar.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vol: {bar.volume.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Price Line */}
        <div
          className="absolute left-16 right-0 border-t-2 border-dashed border-primary/50 flex items-center"
          style={{ top: `${((max - currentPrice) / range) * 100}%` }}
        >
          <span className="absolute right-0 -translate-y-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
            ${currentPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 py-3 px-6 rounded-xl bg-profit text-profit-foreground font-semibold text-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] glow-profit">
          Buy
        </button>
        <button className="flex-1 py-3 px-6 rounded-xl bg-loss text-loss-foreground font-semibold text-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] glow-loss">
          Sell
        </button>
      </div>
    </div>
  );
}
