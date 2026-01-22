import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  transaction_date: string;
  payment_method: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface CreatePaymentInput {
  order_id: string;
  amount: number;
  transaction_date?: string;
  payment_method?: string;
  notes?: string;
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
] as const;

export function usePayments(orderId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: ['payments', user?.id, orderId],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PaymentData[];
    },
    enabled: !!user,
  });

  const createPayment = useMutation({
    mutationFn: async (input: CreatePaymentInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          order_id: input.order_id,
          amount: input.amount,
          transaction_date: input.transaction_date || new Date().toISOString().split('T')[0],
          payment_method: input.payment_method || 'cash',
          notes: input.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Payment recorded',
        description: 'Payment has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Payment deleted',
        description: 'Payment has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    payments: paymentsQuery.data ?? [],
    isLoading: paymentsQuery.isLoading,
    error: paymentsQuery.error,
    createPayment,
    deletePayment,
  };
}
