import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface CustomerData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  measurements: Json | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  measurements?: Json;
}

export function useCustomers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CustomerData[];
    },
    enabled: !!user,
  });

  const createCustomer = useMutation({
    mutationFn: async (input: CreateCustomerInput) => {
      if (!user) throw new Error('Not authenticated');

      const insertData: {
        user_id: string;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        measurements: Json | null;
      } = {
        user_id: user.id,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
        measurements: input.measurements || null,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Customer added',
        description: 'New customer has been created successfully.',
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

  const deleteCustomer = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Customer deleted',
        description: 'Customer has been removed.',
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
    customers: customersQuery.data ?? [],
    isLoading: customersQuery.isLoading,
    error: customersQuery.error,
    createCustomer,
    deleteCustomer,
  };
}
