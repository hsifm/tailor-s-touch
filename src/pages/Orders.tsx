import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge';
import { mockOrders } from '@/data/mockData';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { Plus, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Orders() {
  return (
    <MainLayout 
      title="Orders" 
      subtitle="Manage your tailoring projects"
    >
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="gold" className="gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="font-semibold">Order</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow 
                key={order.id} 
                className="hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{order.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">#{order.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{order.customerName}</TableCell>
                <TableCell>
                  <span className="capitalize text-muted-foreground">{order.garmentType}</span>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(order.dueDate, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatCurrency(order.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}
