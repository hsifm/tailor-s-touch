import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { CustomerList } from '@/components/dashboard/CustomerList';
import { mockStats, mockOrders, mockCustomers } from '@/data/mockData';
import { 
  ClipboardList, 
  Users, 
  DollarSign, 
  Clock,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Welcome back to your tailoring studio"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Orders"
          value={mockStats.activeOrders}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={mockStats.totalCustomers}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${mockStats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Pending Deliveries"
          value={mockStats.pendingDeliveries}
          icon={Clock}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={mockOrders} />
        </div>
        <div>
          <CustomerList customers={mockCustomers} />
        </div>
      </div>
    </MainLayout>
  );
}
