import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge';
import { AddOrderDialog } from '@/components/orders/AddOrderDialog';
import { InvoiceModal } from '@/components/orders/InvoiceModal';
import { useOrders, OrderData } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { Filter, Trash2, ClipboardList, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'measuring', label: 'Measuring' },
  { value: 'cutting', label: 'Cutting' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'fitting', label: 'Fitting' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
];

const GARMENT_LABELS: Record<string, string> = {
  shirt: 'Shirt',
  dress: 'Dress',
  alteration: 'Alteration',
  embroidery_logo: 'Embroidery - Logo',
  embroidery_monogram: 'Embroidery - Monogram',
  embroidery_custom: 'Embroidery - Custom',
  embroidery_patch: 'Embroidery - Patch',
  other: 'Other',
};

export default function Orders() {
  const { orders, isLoading, deleteOrder } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}.`,
      });
    }
  };

  return (
    <MainLayout 
      title="Orders" 
      subtitle="Manage your tailoring & embroidery projects"
    >
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddOrderDialog />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet. Create your first order to get started!</p>
          <AddOrderDialog />
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && orders.length > 0 && (
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
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="hover:bg-secondary/30 transition-colors group"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.description || 'No description'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">#{order.id.slice(0, 8)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{order.customer_name}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {GARMENT_LABELS[order.garment_type] || order.garment_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent p-0">
                        <OrderStatusBadge status={order.status as any} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.due_date ? format(new Date(order.due_date), 'MMM d, yyyy') : '—'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(order.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary h-8 w-8"
                        onClick={() => {
                          setSelectedOrder(order);
                          setInvoiceOpen(true);
                        }}
                        title="View Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
                        onClick={() => deleteOrder.mutate(order.id)}
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      {!isLoading && filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal 
        order={selectedOrder} 
        open={invoiceOpen} 
        onOpenChange={setInvoiceOpen} 
      />
    </MainLayout>
  );
}
