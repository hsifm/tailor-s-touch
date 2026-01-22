import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AddExpenseDialog } from '@/components/finance/AddExpenseDialog';
import { AddPaymentDialog } from '@/components/finance/AddPaymentDialog';
import { PaymentHistory } from '@/components/finance/PaymentHistory';
import { useOrders } from '@/hooks/useOrders';
import { useExpenses, EXPENSE_CATEGORIES } from '@/hooks/useExpenses';
import { usePayments } from '@/hooks/usePayments';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Receipt, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export default function Finance() {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { expenses, isLoading: expensesLoading, deleteExpense } = useExpenses();
  const { payments, isLoading: paymentsLoading } = usePayments();

  const isLoading = ordersLoading || expensesLoading || paymentsLoading;

  // Calculate financial metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalDeposits = orders.reduce((sum, order) => sum + order.deposit, 0);
  const totalCollected = totalDeposits + totalPayments; // Deposits + additional payments
  const outstandingBalance = totalRevenue - totalCollected;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalCollected - totalExpenses;

  // Generate monthly data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.created_at);
        return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, order) => sum + order.deposit, 0);

    const monthExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.expense_date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: format(date, 'MMM'),
      revenue: monthRevenue,
      expenses: monthExpenses,
      profit: monthRevenue - monthExpenses,
    };
  });

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryLabel = (category: string) => {
    return EXPENSE_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  return (
    <MainLayout 
      title="Finance" 
      subtitle="Revenue, expenses, and profit tracking"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {/* Financial Stats */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={DollarSign}
            />
            <StatCard
              title="Total Collected"
              value={formatCurrency(totalCollected)}
              icon={CreditCard}
            />
            <StatCard
              title="Outstanding"
              value={formatCurrency(outstandingBalance)}
              icon={Wallet}
            />
            <StatCard
              title="Total Expenses"
              value={formatCurrency(totalExpenses)}
              icon={Receipt}
            />
            <StatCard
              title="Net Profit"
              value={formatCurrency(netProfit)}
              icon={netProfit >= 0 ? TrendingUp : TrendingDown}
              trend={netProfit >= 0 ? { value: 0, isPositive: true } : { value: 0, isPositive: false }}
            />
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-card rounded-xl border border-border shadow-soft p-6 mb-8 animate-fade-in">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Monthly Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expenses" 
                    name="Expenses" 
                    fill="hsl(var(--destructive))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Trend Chart */}
          <div className="bg-card rounded-xl border border-border shadow-soft p-6 mb-8 animate-fade-in">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Profit Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    name="Net Profit"
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#profitGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Indicator */}
          <div className={cn(
            "mb-8 p-4 rounded-xl border",
            netProfit >= 0 
              ? "bg-primary/5 border-primary/20" 
              : "bg-destructive/5 border-destructive/20"
          )}>
            <div className="flex items-center gap-3">
              {netProfit >= 0 ? (
                <TrendingUp className="w-6 h-6 text-primary" />
              ) : (
                <TrendingDown className="w-6 h-6 text-destructive" />
              )}
              <div>
                <p className={cn(
                  "font-semibold",
                  netProfit >= 0 ? "text-primary" : "text-destructive"
                )}>
                  {netProfit >= 0 ? 'Business is Profitable' : 'Business is at a Loss'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {netProfit >= 0 
                    ? `You've earned ${formatCurrency(netProfit)} more than you've spent.`
                    : `You're spending ${formatCurrency(Math.abs(netProfit))} more than you're earning.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Tabs for Orders, Payments, and Expenses */}
          <Tabs defaultValue="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="orders">Order Balances</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <AddPaymentDialog />
                <AddExpenseDialog />
              </div>
            </div>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-border">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Payment History</h2>
                  <p className="text-sm text-muted-foreground mt-1">All recorded customer payments</p>
                </div>
                <PaymentHistory />
              </div>
            </TabsContent>

            {/* Order Payments Tab */}
            <TabsContent value="orders">
              <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-border">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Payment Status</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track deposits and balances by order</p>
                </div>
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No orders yet. Create orders to track payments.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="font-semibold">Order</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold text-right">Total</TableHead>
                        <TableHead className="font-semibold text-right">Deposit</TableHead>
                        <TableHead className="font-semibold text-right">Balance</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const balance = order.price - order.deposit;
                        const isPaid = balance === 0;
                        
                        return (
                          <TableRow 
                            key={order.id} 
                            className="hover:bg-secondary/30 transition-colors"
                          >
                            <TableCell>
                              <p className="font-medium text-foreground">{order.description || 'No description'}</p>
                            </TableCell>
                            <TableCell className="text-foreground">{order.customer_name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {formatCurrency(order.price)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(order.deposit)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {formatCurrency(balance)}
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                isPaid 
                                  ? "bg-primary/10 text-primary border-primary/20" 
                                  : "bg-secondary text-muted-foreground border-border"
                              )}>
                                {isPaid ? 'Paid' : 'Partial'}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses">
              <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-border">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Business Expenses</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track all your business costs</p>
                </div>
                {expenses.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No expenses recorded yet. Add your first expense to start tracking.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold text-right">Amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow 
                          key={expense.id} 
                          className="hover:bg-secondary/30 transition-colors group"
                        >
                          <TableCell>
                            <span className="font-medium text-foreground">
                              {getCategoryLabel(expense.category)}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {expense.description || '—'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right font-medium text-destructive">
                            -{formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
                              onClick={() => deleteExpense.mutate(expense.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expenses by Category */}
                <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-serif text-xl font-semibold text-foreground">Expenses by Category</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {Object.keys(expensesByCategory).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
                    ) : (
                      Object.entries(expensesByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-foreground">{getCategoryLabel(category)}</span>
                            <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                          </div>
                        ))
                    )}
                    {Object.keys(expensesByCategory).length > 0 && (
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="font-semibold text-foreground">Total Expenses</span>
                        <span className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profit Summary */}
                <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-serif text-xl font-semibold text-foreground">Profit Summary</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Order Value</span>
                      <span className="font-medium text-foreground">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Deposits Received</span>
                      <span className="font-medium text-primary">{formatCurrency(totalDeposits)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Outstanding Payments</span>
                      <span className="font-medium text-foreground">{formatCurrency(outstandingBalance)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Expenses</span>
                      <span className="font-medium text-destructive">-{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="font-semibold text-foreground">Net Profit</span>
                      <span className={cn(
                        "font-semibold",
                        netProfit >= 0 ? "text-primary" : "text-destructive"
                      )}>
                        {formatCurrency(netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </MainLayout>
  );
}
