import { CustomerData } from '@/hooks/useCustomers';
import { format } from 'date-fns';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerListProps {
  customers: CustomerData[];
}

export function CustomerList({ customers }: CustomerListProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-soft animate-fade-in">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Recent Customers</h2>
          <p className="text-sm text-muted-foreground mt-1">Your valued clients</p>
        </div>
        <Link 
          to="/customers" 
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      {customers.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No customers yet</p>
          <Link 
            to="/customers" 
            className="text-sm text-primary hover:text-primary/80 font-medium mt-2 inline-block"
          >
            Add your first customer
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {customers.slice(0, 4).map((customer, index) => (
            <div 
              key={customer.id} 
              className="p-4 hover:bg-secondary/50 transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{customer.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {customer.email || customer.phone || 'No contact info'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(customer.created_at), 'MMM d')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
