import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { usePayments, PAYMENT_METHODS } from '@/hooks/usePayments';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/currency';

const paymentSchema = z.object({
  order_id: z.string().min(1, 'Please select an order'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  transaction_date: z.date().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function AddPaymentDialog() {
  const [open, setOpen] = useState(false);
  const { createPayment } = usePayments();
  const { orders } = useOrders();

  // Filter orders that have outstanding balance
  const ordersWithBalance = orders.filter(order => {
    const paid = order.deposit; // For now, deposit represents paid amount
    return order.price > paid;
  });

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      order_id: '',
      amount: 0,
      payment_method: 'cash',
      notes: '',
    },
  });

  const selectedOrderId = form.watch('order_id');
  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const outstandingBalance = selectedOrder 
    ? selectedOrder.price - selectedOrder.deposit 
    : 0;

  const onSubmit = async (data: PaymentFormData) => {
    await createPayment.mutateAsync({
      order_id: data.order_id,
      amount: data.amount,
      transaction_date: data.transaction_date 
        ? format(data.transaction_date, 'yyyy-MM-dd')
        : undefined,
      payment_method: data.payment_method,
      notes: data.notes,
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Record Payment</DialogTitle>
          <DialogDescription>
            Record a customer payment against an order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="order_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No orders available
                        </SelectItem>
                      ) : (
                        orders.map((order) => {
                          const balance = order.price - order.deposit;
                          return (
                            <SelectItem key={order.id} value={order.id}>
                              {order.customer_name} - {order.description || order.garment_type}
                              {balance > 0 && ` (${formatCurrency(balance)} due)`}
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedOrder && (
              <div className="p-3 rounded-lg bg-secondary/50 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit Paid:</span>
                  <span>{formatCurrency(selectedOrder.deposit)}</span>
                </div>
                <div className="flex justify-between mt-1 pt-1 border-t border-border">
                  <span className="text-muted-foreground">Outstanding:</span>
                  <span className="font-semibold text-primary">{formatCurrency(outstandingBalance)}</span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (AED)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  {outstandingBalance > 0 && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => form.setValue('amount', outstandingBalance)}
                    >
                      Pay full balance ({formatCurrency(outstandingBalance)})
                    </Button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM d, yyyy')
                            ) : (
                              <span>Today</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Cash" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPayment.isPending}>
                {createPayment.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
