import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OrderData {
  id: string;
  customer_id: string;
  customer_name: string;
  description: string | null;
  garment_type: string;
  status: string;
  price: number;
  deposit: number;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  customer_id: string;
  customer_name: string;
  description?: string;
  garment_type: string;
  price: number;
  deposit: number;
  due_date?: string;
  notes?: string;
}

export interface UpdateOrderInput {
  id: string;
  status?: string;
  price?: number;
  deposit?: number;
  due_date?: string;
  notes?: string;
}

export function useOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrderData[];
    },
    enabled: !!user,
  });

  const createOrder = useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          customer_id: input.customer_id,
          customer_name: input.customer_name,
          description: input.description || null,
          garment_type: input.garment_type,
          price: input.price,
          deposit: input.deposit,
          due_date: input.due_date || null,
          notes: input.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Order created',
        description: 'New order has been added successfully.',
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

  const updateOrder = useMutation({
    mutationFn: async (input: UpdateOrderInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Order updated',
        description: 'Order has been updated successfully.',
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

  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Order deleted',
        description: 'Order has been removed.',
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
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
