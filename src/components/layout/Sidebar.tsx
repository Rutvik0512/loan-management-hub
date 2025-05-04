
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Users, 
  Calendar,
  Settings,
  LogIn,
  DollarSign,
  FileText,
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Calendar,
    roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
  },
  {
    title: 'My Loans',
    href: '/my-loans',
    icon: FileText,
    roles: ['EMPLOYEE'],
  },
  {
    title: 'Apply for Loan',
    href: '/apply-loan',
    icon: LogIn,
    roles: ['EMPLOYEE'],
  },
  {
    title: 'Loan Requests',
    href: '/loan-requests',
    icon: FileText,
    roles: ['MANAGER'],
  },
  {
    title: 'Process Loans',
    href: '/process-loans',
    icon: DollarSign,
    roles: ['FINANCE'],
  },
  {
    title: 'Manage Employees',
    href: '/manage-employees',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Manage Loans',
    href: '/manage-loans',
    icon: FileText,
    roles: ['ADMIN'],
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-background border-r h-screen fixed">
      <div className="py-4 px-2">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
