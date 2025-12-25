import { cn } from '@/lib/utils';
import { portfolioSummary, portfolioAssets } from '@/data/mockData';
import { Briefcase, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

export function PortfolioSummary() {
  const { totalInvestment, currentValue, totalPnL, totalPnLPercent, dayPnL, dayPnLPercent } =
    portfolioSummary;
  const isPositive = totalPnL >= 0;
  const isDayPositive = dayPnL >= 0;

  // Colors for donut chart
  const colors = ['hsl(var(--primary))', 'hsl(var(--profit))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted))'];

  // Calculate donut segments
  const total = portfolioAssets.reduce((sum, asset) => sum + asset.allocation, 0);
  let cumulativePercent = 0;

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Portfolio Summary</h2>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-secondary/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total Investment
          </p>
          <p className="text-xl font-bold text-foreground">
            ${totalInvestment.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Current Value
          </p>
          <p className="text-xl font-bold text-foreground">
            ${currentValue.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total P&L
          </p>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'text-xl font-bold',
                isPositive ? 'text-profit' : 'text-loss'
              )}
            >
              {isPositive ? '+' : ''}${totalPnL.toLocaleString()}
            </p>
            <span
              className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded',
                isPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
              )}
            >
              {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Today's P&L
          </p>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'text-xl font-bold',
                isDayPositive ? 'text-profit' : 'text-loss'
              )}
            >
              {isDayPositive ? '+' : ''}${dayPnL.toLocaleString()}
            </p>
            <span
              className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded',
                isDayPositive ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
              )}
            >
              {isDayPositive ? '+' : ''}{dayPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {portfolioAssets.map((asset, index) => {
                const percent = asset.allocation;
                const dashArray = percent * 2.51327; // Circumference of circle with r=40 is ~251.327
                const dashOffset = cumulativePercent * 2.51327;
                cumulativePercent += percent;

                return (
                  <circle
                    key={asset.id}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="12"
                    strokeDasharray={`${dashArray} 251.327`}
                    strokeDashoffset={`-${dashOffset}`}
                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <PieChart className="w-6 h-6 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">100%</span>
              <span className="text-xs text-muted-foreground">Allocated</span>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="space-y-3">
          {portfolioAssets.map((asset, index) => {
            const assetPositive = asset.pnl >= 0;
            return (
              <div
                key={asset.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {asset.symbol}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {asset.allocation}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      ${asset.value.toLocaleString()}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        assetPositive ? 'text-profit' : 'text-loss'
                      )}
                    >
                      {assetPositive ? '+' : ''}{asset.pnlPercent.toFixed(2)}%
                    </span>
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
