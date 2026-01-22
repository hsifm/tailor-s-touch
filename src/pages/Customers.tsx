import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockCustomers } from '@/data/mockData';
import { format } from 'date-fns';
import { Plus, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Customers() {
  return (
    <MainLayout 
      title="Customers" 
      subtitle="Manage your client relationships"
    >
      {/* Actions */}
      <div className="flex items-center justify-end mb-6">
        <Button variant="gold" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCustomers.map((customer, index) => (
          <Card 
            key={customer.id} 
            className="hover:shadow-medium transition-shadow duration-300 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Client since {format(customer.createdAt, 'MMM yyyy')}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              {customer.measurements.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    "{customer.measurements.notes}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
