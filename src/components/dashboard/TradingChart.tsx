import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ZoomIn, ZoomOut, Maximize2, BookOpen, X } from 'lucide-react';
import { OrderBook } from './OrderBook';
import type { SearchableAsset } from '@/components/SearchBar';

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  selectedAsset?: SearchableAsset | null;
}

// Generate realistic OHLC candlestick data
function generateCandleData(basePrice: number, count: number = 50): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = basePrice * 0.98;
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.015;
    const trend = Math.random() > 0.48 ? 1 : -1;
    
    const open = currentPrice;
    const changePercent = (Math.random() * volatility * 2 - volatility) + (trend * volatility * 0.3);
    const close = open * (1 + changePercent);
    
    const wickMultiplier = Math.random() * 0.008 + 0.002;
    const upperWick = Math.max(open, close) * (1 + wickMultiplier);
    const lowerWick = Math.min(open, close) * (1 - wickMultiplier);
    
    const high = upperWick;
    const low = lowerWick;
    
    const timeOffset = (count - 1 - i) * 15;
    const candleTime = new Date(now.getTime() - timeOffset * 60 * 1000);
    const timeStr = candleTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    data.push({
      time: timeStr,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 5000) + 1000,
    });
    
    currentPrice = close;
  }
  
  return data;
}

export function TradingChart({ selectedAsset }: TradingChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [hoveredCandle, setHoveredCandle] = useState<number | null>(null);
  const [candleData, setCandleData] = useState<CandleData[]>(() => generateCandleData(98542.80));
  const [currentPrice, setCurrentPrice] = useState(98542.80);
  const [zoom, setZoom] = useState(1);
  const [showOrderBook, setShowOrderBook] = useState(false);

  const displaySymbol = selectedAsset 
    ? selectedAsset.type === 'stock' 
      ? selectedAsset.symbol 
      : `${selectedAsset.symbol}/USDT`
    : 'BTC/USDT';

  const displayExchange = selectedAsset?.type === 'stock' ? 'NSE' : 'Binance';
  const currencySymbol = selectedAsset?.type === 'stock' ? '₹' : '$';
  const priceChangePercent = selectedAsset?.changePercent ?? 2.43;
  const isPositive = priceChangePercent >= 0;

  useEffect(() => {
    if (selectedAsset) {
      setCurrentPrice(selectedAsset.price);
      setCandleData(generateCandleData(selectedAsset.price));
    }
  }, [selectedAsset?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandleData(prev => {
        const newData = [...prev];
        const lastCandle = { ...newData[newData.length - 1] };
        const change = (Math.random() - 0.5) * lastCandle.close * 0.002;
        lastCandle.close = Math.round((lastCandle.close + change) * 100) / 100;
        lastCandle.high = Math.max(lastCandle.high, lastCandle.close);
        lastCandle.low = Math.min(lastCandle.low, lastCandle.close);
        newData[newData.length - 1] = lastCandle;
        setCurrentPrice(lastCandle.close);
        return newData;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [selectedAsset?.id]);

  const visibleCandles = useMemo(() => {
    const count = Math.floor(50 / zoom);
    return candleData.slice(-count);
  }, [candleData, zoom]);

  const { min, max, range } = useMemo(() => {
    const allLows = visibleCandles.map(c => c.low);
    const allHighs = visibleCandles.map(c => c.high);
    const minPrice = Math.min(...allLows);
    const maxPrice = Math.max(...allHighs);
    const padding = (maxPrice - minPrice) * 0.1;
    return {
      min: minPrice - padding,
      max: maxPrice + padding,
      range: maxPrice - minPrice + padding * 2,
    };
  }, [visibleCandles]);

  const chartHeight = 450;
  const priceToY = (price: number) => ((max - price) / range) * chartHeight;

  const displayCandle = hoveredCandle !== null ? visibleCandles[hoveredCandle] : visibleCandles[visibleCandles.length - 1];

  return (
    <div className="relative h-full">
      {/* Main Chart Container */}
      <div className="glass-card rounded-xl p-6 animate-fade-in h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{displaySymbol}</h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {displayExchange}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-bold text-foreground">
                  {currencySymbol}{currentPrice.toLocaleString()}
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

          {/* OHLC Values */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">O</span>
              <span className="font-semibold text-foreground">{currencySymbol}{displayCandle?.open.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">H</span>
              <span className="font-semibold text-profit">{currencySymbol}{displayCandle?.high.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">L</span>
              <span className="font-semibold text-loss">{currencySymbol}{displayCandle?.low.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">C</span>
              <span className={cn('font-semibold', displayCandle && displayCandle.close >= displayCandle.open ? 'text-profit' : 'text-loss')}>
                {currencySymbol}{displayCandle?.close.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe & Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  activeTimeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(z => Math.min(z + 0.25, 2))}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            {/* OrderBook Toggle Button */}
            <button 
              onClick={() => setShowOrderBook(!showOrderBook)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                showOrderBook 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <BookOpen className="w-4 h-4" />
              Order Book
            </button>
          </div>
        </div>

        {/* Chart Area - Full Width */}
        <div className="flex-1 relative" style={{ minHeight: `${chartHeight}px` }}>
          {/* Price Grid Lines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const price = max - (range / 5) * i;
              return (
                <div key={i} className="flex items-center w-full">
                  <span className="text-xs text-muted-foreground w-20 text-right pr-2 tabular-nums">
                    {currencySymbol}{price.toFixed(currentPrice > 1000 ? 0 : 2)}
                  </span>
                  <div className="flex-1 border-t border-border/20" />
                </div>
              );
            })}
          </div>

          {/* Candlesticks */}
          <div className="absolute left-20 right-0 top-0 bottom-0 flex items-stretch">
            <svg width="100%" height="100%" className="overflow-visible">
              {visibleCandles.map((candle, i) => {
                const candleWidth = 100 / visibleCandles.length;
                const x = i * candleWidth + candleWidth / 2;
                const isGreen = candle.close >= candle.open;
                
                const bodyTop = priceToY(Math.max(candle.open, candle.close));
                const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
                
                const wickTop = priceToY(candle.high);
                const wickBottom = priceToY(candle.low);
                
                const isHovered = hoveredCandle === i;
                
                return (
                  <g 
                    key={i}
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredCandle(i)}
                    onMouseLeave={() => setHoveredCandle(null)}
                  >
                    <line
                      x1={`${x}%`}
                      y1={wickTop}
                      x2={`${x}%`}
                      y2={wickBottom}
                      stroke={isGreen ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                      strokeWidth={isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />
                    
                    <rect
                      x={`${x - candleWidth * 0.35}%`}
                      y={bodyTop}
                      width={`${candleWidth * 0.7}%`}
                      height={bodyHeight}
                      fill={isGreen ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                      rx={1}
                      className={cn(
                        'transition-all duration-150',
                        isHovered && 'opacity-80'
                      )}
                    />
                    
                    {isHovered && (
                      <rect
                        x={`${x - candleWidth / 2}%`}
                        y={0}
                        width={`${candleWidth}%`}
                        height="100%"
                        fill="hsl(var(--primary))"
                        opacity={0.05}
                      />
                    )}
                  </g>
                );
              })}
              
              <line
                x1="0"
                y1={priceToY(currentPrice)}
                x2="100%"
                y2={priceToY(currentPrice)}
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                strokeDasharray="4 2"
                opacity={0.7}
              />
            </svg>
            
            <div 
              className="absolute right-0 -translate-y-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-l"
              style={{ top: priceToY(currentPrice) }}
            >
              {currencySymbol}{currentPrice.toLocaleString()}
            </div>
          </div>

          {/* Crosshair tooltip */}
          {hoveredCandle !== null && visibleCandles[hoveredCandle] && (
            <div 
              className="absolute z-20 pointer-events-none animate-fade-in"
              style={{
                left: `calc(80px + ${(hoveredCandle / visibleCandles.length) * 100}%)`,
                top: priceToY(visibleCandles[hoveredCandle].high) - 80,
              }}
            >
              <div className="bg-popover border border-border rounded-lg p-3 shadow-xl -translate-x-1/2">
                <p className="text-xs text-muted-foreground mb-2">{visibleCandles[hoveredCandle].time}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Open:</span>
                  <span className="font-medium text-foreground">{currencySymbol}{visibleCandles[hoveredCandle].open.toLocaleString()}</span>
                  <span className="text-muted-foreground">High:</span>
                  <span className="font-medium text-profit">{currencySymbol}{visibleCandles[hoveredCandle].high.toLocaleString()}</span>
                  <span className="text-muted-foreground">Low:</span>
                  <span className="font-medium text-loss">{currencySymbol}{visibleCandles[hoveredCandle].low.toLocaleString()}</span>
                  <span className="text-muted-foreground">Close:</span>
                  <span className={cn('font-medium', visibleCandles[hoveredCandle].close >= visibleCandles[hoveredCandle].open ? 'text-profit' : 'text-loss')}>
                    {currencySymbol}{visibleCandles[hoveredCandle].close.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Vol:</span>
                  <span className="font-medium text-foreground">{visibleCandles[hoveredCandle].volume.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Volume bars */}
        <div className="relative h-16 ml-20 mt-2 border-t border-border/20 pt-2">
          <div className="flex items-end h-full gap-px">
            {visibleCandles.map((candle, i) => {
              const maxVol = Math.max(...visibleCandles.map(c => c.volume));
              const height = (candle.volume / maxVol) * 100;
              const isGreen = candle.close >= candle.open;
              
              return (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-t-sm transition-opacity duration-150',
                    isGreen ? 'bg-profit/40' : 'bg-loss/40',
                    hoveredCandle === i && 'opacity-100',
                    hoveredCandle !== null && hoveredCandle !== i && 'opacity-50'
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 text-xs text-muted-foreground">Vol</span>
        </div>
      </div>

      {/* Buy/Sell Buttons - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        <button className="px-8 py-3 rounded-xl bg-profit text-profit-foreground font-semibold text-lg shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105 glow-profit">
          Buy
        </button>
        <button className="px-8 py-3 rounded-xl bg-loss text-loss-foreground font-semibold text-lg shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105 glow-loss">
          Sell
        </button>
      </div>

      {/* OrderBook Sidebar */}
      <div 
        className={cn(
          "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background border-l border-border shadow-xl transition-transform duration-300 z-40",
          showOrderBook ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Order Book</h3>
          <button 
            onClick={() => setShowOrderBook(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          <OrderBook />
        </div>
      </div>
    </div>
  );
}