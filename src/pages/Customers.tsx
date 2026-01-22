import { MainLayout } from '@/components/layout/MainLayout';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';
import { useCustomers } from '@/hooks/useCustomers';
import { format } from 'date-fns';
import { Mail, Phone, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Customers() {
  const { customers, isLoading, deleteCustomer } = useCustomers();

  return (
    <MainLayout 
      title="Customers" 
      subtitle="Manage your client relationships"
    >
      {/* Actions */}
      <div className="flex items-center justify-end mb-6">
        <AddCustomerDialog />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && customers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No customers yet. Add your first customer to get started!</p>
          <AddCustomerDialog />
        </div>
      )}

      {/* Customers Grid */}
      {!isLoading && customers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <Card 
              key={customer.id} 
              className="hover:shadow-medium transition-shadow duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Client since {format(new Date(customer.created_at), 'MMM yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => deleteCustomer.mutate(customer.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </div>

                {customer.measurements && typeof customer.measurements === 'object' && 'notes' in customer.measurements && customer.measurements.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      "{String(customer.measurements.notes)}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
