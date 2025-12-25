import { cn } from '@/lib/utils';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  CheckCircle2,
  XCircle,
  Timer
} from 'lucide-react';
import { recentOrders } from '@/data/mockData';

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-profit', bg: 'bg-profit/10' },
  pending: { icon: Timer, color: 'text-warning', bg: 'bg-warning/10' },
  cancelled: { icon: XCircle, color: 'text-loss', bg: 'bg-loss/10' },
};

export function RecentActivity() {
  const latestOrders = recentOrders.slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {latestOrders.map((order) => {
          const isBuy = order.type === 'buy';
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={order.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center',
                isBuy ? 'bg-profit/10' : 'bg-loss/10'
              )}>
                {isBuy ? (
                  <ArrowUpCircle className="w-5 h-5 text-profit" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-loss" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {order.symbol}
                  </span>
                  <span className={cn(
                    'text-xs font-medium px-1.5 py-0.5 rounded',
                    isBuy ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                  )}>
                    {order.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.quantity} @ ₹{order.price.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  status.color
                )}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="capitalize">{order.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.timestamp.split(' ')[1]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
