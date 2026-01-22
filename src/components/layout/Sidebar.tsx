import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Ruler,
  Scissors
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ClipboardList },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Measurements', href: '/measurements', icon: Ruler },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Scissors className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-semibold text-foreground">Atelier</h1>
          <p className="text-xs text-muted-foreground tracking-wide">Tailoring Studio</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 group"
            activeClassName="bg-secondary text-foreground shadow-soft"
          >
            <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Need help?</p>
          <p className="text-sm font-medium text-foreground">View Documentation</p>
        </div>
      </div>
    </aside>
  );
}
