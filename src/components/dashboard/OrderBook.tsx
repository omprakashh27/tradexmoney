import { cn } from '@/lib/utils';
import { buyOrders, sellOrders } from '@/data/mockData';
import { ArrowUpDown } from 'lucide-react';

interface OrderBookProps {
  hideHeader?: boolean;
}

export function OrderBook({ hideHeader = false }: OrderBookProps) {
  return (
    <div className="h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Order Book</h2>
          </div>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
            BTC/USDT
          </span>
        </div>
      )}

      {/* Header */}
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      {/* Sell Orders (Asks) */}
      <div className="space-y-0.5 mb-4">
        {sellOrders.slice().reverse().map((order, index) => (
          <div
            key={index}
            className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 rounded hover:bg-accent/30 transition-colors cursor-pointer group"
          >
            {/* Background Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-loss/10 rounded-r transition-all group-hover:bg-loss/20"
              style={{ width: `${order.percentage}%` }}
            />
            
            <span className="relative text-loss font-mono">
              ${order.price.toLocaleString()}
            </span>
            <span className="relative text-right text-foreground font-mono">
              {order.quantity.toFixed(4)}
            </span>
            <span className="relative text-right text-muted-foreground font-mono text-xs">
              ${order.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="flex items-center justify-center gap-3 py-3 my-2 border-y border-border">
        <span className="text-lg font-bold text-foreground">$98,542.80</span>
        <span className="text-xs text-profit bg-profit-subtle px-2 py-0.5 rounded">
          Spread: 0.02%
        </span>
      </div>

      {/* Buy Orders (Bids) */}
      <div className="space-y-0.5">
        {buyOrders.map((order, index) => (
          <div
            key={index}
            className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 rounded hover:bg-accent/30 transition-colors cursor-pointer group"
          >
            {/* Background Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-profit/10 rounded-l transition-all group-hover:bg-profit/20"
              style={{ width: `${order.percentage}%` }}
            />
            
            <span className="relative text-profit font-mono">
              ${order.price.toLocaleString()}
            </span>
            <span className="relative text-right text-foreground font-mono">
              {order.quantity.toFixed(4)}
            </span>
            <span className="relative text-right text-muted-foreground font-mono text-xs">
              ${order.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderBook;
