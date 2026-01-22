import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ExpenseData {
  id: string;
  category: string;
  description: string | null;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseInput {
  category: string;
  description?: string;
  amount: number;
  expense_date: string;
  notes?: string;
}

export const EXPENSE_CATEGORIES = [
  { value: 'salary', label: 'Salary & Wages' },
  { value: 'materials', label: 'Materials & Fabric' },
  { value: 'accessories', label: 'Accessories & Supplies' },
  { value: 'rent', label: 'Rent & Utilities' },
  { value: 'equipment', label: 'Equipment & Maintenance' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'transport', label: 'Transport & Delivery' },
  { value: 'other', label: 'Other Expenses' },
];

export function useExpenses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async (): Promise<ExpenseData[]> => {
      const { data, error } = await supabase
        .from('expenses' as any)
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as ExpenseData[];
    },
    enabled: !!user,
  });

  const createExpense = useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses' as any)
        .insert([{
          user_id: user.id,
          category: input.category,
          description: input.description || null,
          amount: input.amount,
          expense_date: input.expense_date,
          notes: input.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense added',
        description: 'New expense has been recorded.',
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

  const deleteExpense = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from('expenses' as any)
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense deleted',
        description: 'Expense has been removed.',
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
    expenses: expensesQuery.data ?? [],
    isLoading: expensesQuery.isLoading,
    error: expensesQuery.error,
    createExpense,
    deleteExpense,
  };
}
