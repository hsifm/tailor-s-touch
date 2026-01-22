import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockOrders } from '@/data/mockData';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const totalRevenue = mockOrders.reduce((sum, order) => sum + order.price, 0);
const totalDeposits = mockOrders.reduce((sum, order) => sum + order.deposit, 0);
const outstandingBalance = totalRevenue - totalDeposits;

export default function Finance() {
  return (
    <MainLayout 
      title="Finance" 
      subtitle="Revenue and payment tracking"
    >
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Deposits Received"
          value={formatCurrency(totalDeposits)}
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          icon={Wallet}
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(Math.round(totalRevenue / mockOrders.length))}
          icon={TrendingUp}
        />
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-border">
          <h2 className="font-serif text-xl font-semibold text-foreground">Payment Status</h2>
          <p className="text-sm text-muted-foreground mt-1">Track deposits and balances by order</p>
        </div>
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
            {mockOrders.map((order) => {
              const balance = order.price - order.deposit;
              const isPaid = balance === 0;
              
              return (
                <TableRow 
                  key={order.id} 
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    <p className="font-medium text-foreground">{order.description}</p>
                  </TableCell>
                  <TableCell className="text-foreground">{order.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(order.createdAt, 'MMM d, yyyy')}
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
      </div>
    </MainLayout>
  );
}
