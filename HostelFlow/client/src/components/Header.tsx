import { Building, Bell, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export function Header() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const { data: unreadAlerts = [] } = useQuery({
    queryKey: ['/api/alerts?unreadOnly=true'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const isBengali = i18n.language === 'bn';

  return (
    <header className="bg-card border-b border-border h-16 fixed top-0 left-0 right-0 z-50" data-testid="header">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <Building className="text-primary text-2xl" data-testid="logo-icon" />
          <h1 className={`text-xl font-semibold text-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="app-title">
            {t('Hostel Management System')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <LanguageToggle />
          
          <div className="relative">
            <button className="p-2 text-muted-foreground hover:text-foreground relative" data-testid="notifications-button">
              <Bell className="text-lg" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="notification-badge">
                  {unreadAlerts.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className={`text-sm font-medium text-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="user-name">
                {t('Admin User')}
              </p>
              <p className={`text-xs text-muted-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="user-role">
                {t('System Administrator')}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center" data-testid="user-avatar">
              <User className="text-primary-foreground" size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
