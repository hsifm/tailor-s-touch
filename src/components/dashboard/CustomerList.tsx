import { Customer } from '@/types';
import { format } from 'date-fns';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-soft animate-fade-in">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Customers</h2>
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
      
      <div className="divide-y divide-border">
        {customers.slice(0, 4).map((customer, index) => (
          <div 
            key={customer.id} 
            className="p-4 hover:bg-secondary/50 transition-colors duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-sm">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{customer.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                Since {format(customer.createdAt, 'MMM yyyy')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
