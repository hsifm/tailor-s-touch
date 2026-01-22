import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { CustomerList } from '@/components/dashboard/CustomerList';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { formatCurrency } from '@/lib/currency';
import { startOfMonth, isAfter } from 'date-fns';
import { 
  ClipboardList, 
  Users, 
  DollarSign, 
  Clock,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { customers, isLoading: customersLoading } = useCustomers();

  const isLoading = ordersLoading || customersLoading;

  // Calculate real stats
  const activeOrders = orders.filter(o => 
    !['delivered', 'ready'].includes(o.status)
  ).length;

  const totalCustomers = customers.length;

  // Monthly revenue (deposits collected this month)
  const monthStart = startOfMonth(new Date());
  const monthlyRevenue = orders
    .filter(o => isAfter(new Date(o.created_at), monthStart))
    .reduce((sum, o) => sum + Number(o.deposit), 0);

  // Pending deliveries (orders ready but not delivered)
  const pendingDeliveries = orders.filter(o => o.status === 'ready').length;

  if (isLoading) {
    return (
      <MainLayout 
        title="Dashboard" 
        subtitle="Welcome back to your tailoring studio"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Welcome back to your tailoring studio"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Orders"
          value={activeOrders}
          icon={ClipboardList}
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Deliveries"
          value={pendingDeliveries}
          icon={Clock}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div>
          <CustomerList customers={customers} />
        </div>
      </div>
    </MainLayout>
  );
}
