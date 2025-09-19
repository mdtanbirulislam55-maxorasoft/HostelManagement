import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Building, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  History, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const navigationItems = [
  { id: 'dashboard', icon: LayoutDashboard, key: 'Dashboard', active: true },
  { id: 'students', icon: Users, key: 'Student Management' },
  { id: 'rooms', icon: Bed, key: 'Room Management' },
  { id: 'floors', icon: Building, key: 'Floor Management' },
  { id: 'payments', icon: CreditCard, key: 'Payment Tracking' },
  { id: 'reports', icon: TrendingUp, key: 'Financial Reports' },
  { id: 'alerts', icon: AlertTriangle, key: 'Alerts & Notifications' },
  { id: 'logs', icon: History, key: 'Activity Logs' },
  { id: 'settings', icon: Settings, key: 'Settings' },
];

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const isBengali = i18n.language === 'bn';

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    // TODO: Implement navigation
    console.log('Navigate to:', id);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <aside className="w-60 bg-card border-r border-border h-full overflow-y-auto" data-testid="sidebar">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-primary'
              }`}
              data-testid={`nav-item-${item.id}`}
            >
              <Icon size={18} />
              <span className={isBengali ? 'font-bengali' : ''}>{t(item.key)}</span>
            </button>
          );
        })}
        
        <div className="pt-4 border-t border-border mt-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200`}
            data-testid="logout-button"
          >
            <LogOut size={18} />
            <span className={isBengali ? 'font-bengali' : ''}>{t('Logout')}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
