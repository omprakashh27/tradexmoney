import { useState } from 'react';
import { cn } from '@/lib/utils';
import { recentOrders } from '@/data/mockData';
import { FileText, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RecentOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(recentOrders.length / itemsPerPage);

  const currentOrders = recentOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-profit-subtle text-profit';
      case 'pending':
        return 'bg-chart-4/10 text-chart-4';
      case 'cancelled':
        return 'bg-loss-subtle text-loss';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        </div>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Order ID
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Symbol
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Type
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Qty
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Price
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Status
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <td className="py-4">
                  <span className="text-sm font-mono text-muted-foreground">
                    {order.id}
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-sm font-semibold text-foreground">
                    {order.symbol}
                  </span>
                </td>
                <td className="py-4">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold',
                      order.type === 'buy' ? 'bg-profit-subtle text-profit' : 'bg-loss-subtle text-loss'
                    )}
                  >
                    {order.type === 'buy' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {order.type.toUpperCase()}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {order.quantity}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${order.price.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span
                    className={cn(
                      'inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                      getStatusStyles(order.status)
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-xs text-muted-foreground">
                    {order.timestamp.split(' ')[1]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, recentOrders.length)} of{' '}
          {recentOrders.length} orders
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              currentPage === 1
                ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                : 'bg-secondary hover:bg-accent text-foreground'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200',
                currentPage === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              currentPage === totalPages
                ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                : 'bg-secondary hover:bg-accent text-foreground'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
