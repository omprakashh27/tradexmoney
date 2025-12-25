import { cn } from '@/lib/utils';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { portfolioSummary } from '@/data/mockData';

const stats = [
  {
    label: 'Portfolio Value',
    value: `₹${portfolioSummary.currentValue.toLocaleString()}`,
    change: portfolioSummary.totalPnLPercent,
    icon: Wallet,
    color: 'from-primary to-primary/60',
  },
  {
    label: "Today's P&L",
    value: `₹${portfolioSummary.dayPnL.toLocaleString()}`,
    change: portfolioSummary.dayPnLPercent,
    icon: Activity,
    color: 'from-profit to-profit/60',
  },
  {
    label: 'Total Returns',
    value: `₹${portfolioSummary.totalPnL.toLocaleString()}`,
    change: portfolioSummary.totalPnLPercent,
    icon: TrendingUp,
    color: 'from-chart-1 to-chart-2',
  },
  {
    label: 'Investment',
    value: `₹${portfolioSummary.totalInvestment.toLocaleString()}`,
    change: 0,
    icon: TrendingDown,
    color: 'from-chart-3 to-chart-4',
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <div
            key={stat.label}
            style={{ animationDelay: `${index * 100}ms` }}
            className="glass-card rounded-xl p-5 animate-fade-in group hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                stat.color
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {stat.change !== 0 && (
                <div className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full',
                  isPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
                )}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stat.change).toFixed(2)}%
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
