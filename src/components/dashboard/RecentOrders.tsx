import { OrderData } from '@/hooks/useOrders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentOrdersProps {
  orders: OrderData[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-soft animate-fade-in">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Recent Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">Latest tailoring projects</p>
        </div>
        <Link 
          to="/orders" 
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="p-8 text-center">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No orders yet</p>
          <Link 
            to="/orders" 
            className="text-sm text-primary hover:text-primary/80 font-medium mt-2 inline-block"
          >
            Create your first order
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {orders.slice(0, 5).map((order, index) => (
            <div 
              key={order.id} 
              className="p-4 hover:bg-secondary/50 transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {order.description || order.garment_type}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {order.customer_name}
                    {order.due_date && ` • Due ${format(new Date(order.due_date), 'MMM d, yyyy')}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(Number(order.price))}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
