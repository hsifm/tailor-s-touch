import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';
import { usePayments, PAYMENT_METHODS } from '@/hooks/usePayments';
import { useOrders } from '@/hooks/useOrders';

export function PaymentHistory() {
  const { payments, isLoading, deletePayment } = usePayments();
  const { orders } = useOrders();

  const getOrderInfo = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order 
      ? { customer: order.customer_name, description: order.description || order.garment_type }
      : { customer: 'Unknown', description: 'Unknown' };
  };

  const getMethodLabel = (method: string | null) => {
    if (!method) return 'Cash';
    return PAYMENT_METHODS.find(m => m.value === method)?.label || method;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No payments recorded yet. Record your first payment to start tracking.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary/50">
          <TableHead className="font-semibold">Date</TableHead>
          <TableHead className="font-semibold">Customer</TableHead>
          <TableHead className="font-semibold">Order</TableHead>
          <TableHead className="font-semibold">Method</TableHead>
          <TableHead className="font-semibold text-right">Amount</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => {
          const orderInfo = getOrderInfo(payment.order_id);
          return (
            <TableRow 
              key={payment.id} 
              className="hover:bg-secondary/30 transition-colors group"
            >
              <TableCell className="text-muted-foreground">
                {format(new Date(payment.transaction_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {orderInfo.customer}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {orderInfo.description}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getMethodLabel(payment.payment_method)}
              </TableCell>
              <TableCell className="text-right font-medium text-primary">
                +{formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => deletePayment.mutate(payment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
