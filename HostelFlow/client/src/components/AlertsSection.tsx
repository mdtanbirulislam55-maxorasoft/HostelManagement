import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Wrench, Info, Plus, FileText, Bell, Download, ChevronRight } from 'lucide-react';

export function AlertsSection() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/alerts'],
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'payment_overdue':
        return AlertTriangle;
      case 'maintenance_required':
        return Wrench;
      case 'high_occupancy':
        return Info;
      default:
        return AlertTriangle;
    }
  };

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          description: 'text-red-600',
        };
      case 'medium':
        return {
          container: 'bg-orange-50 border-orange-200',
          icon: 'text-orange-500',
          title: 'text-orange-800',
          description: 'text-orange-600',
        };
      case 'low':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          description: 'text-blue-600',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-500',
          title: 'text-gray-800',
          description: 'text-gray-600',
        };
    }
  };

  const quickActions = [
    {
      id: 'add-student',
      title: t('Add New Student'),
      icon: Plus,
      bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      hoverColor: 'hover:bg-primary/90',
    },
    {
      id: 'monthly-report',
      title: t('Generate Monthly Report'),
      icon: FileText,
      bgColor: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      hoverColor: 'hover:bg-secondary/80',
    },
    {
      id: 'payment-reminders',
      title: t('Send Payment Reminders'),
      icon: Bell,
      bgColor: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      hoverColor: 'hover:bg-secondary/80',
    },
    {
      id: 'export-data',
      title: t('Export Student Data'),
      icon: Download,
      bgColor: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      hoverColor: 'hover:bg-secondary/80',
    },
  ];

  const handleQuickAction = (actionId: string) => {
    // TODO: Implement respective functionality
    console.log('Quick action:', actionId);
  };

  const recentAlerts = alerts.slice(0, 3); // Show only recent 3 alerts

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Alerts */}
      <Card data-testid="alerts-section">
        <CardHeader>
          <CardTitle className={isBengali ? 'font-bengali' : ''}>
            {t('Recent Alerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p className={isBengali ? 'font-bengali' : ''}>No alerts at the moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                const styles = getAlertStyles(alert.severity);
                
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${styles.container}`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <AlertIcon className={`${styles.icon} mt-1`} size={16} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${styles.title} ${isBengali ? 'font-bengali' : ''}`}>
                        {alert.title}
                      </p>
                      <p className={`text-xs ${styles.description} ${isBengali ? 'font-bengali' : ''}`}>
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card data-testid="quick-actions">
        <CardHeader>
          <CardTitle className={isBengali ? 'font-bengali' : ''}>
            {t('Quick Actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              
              return (
                <Button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`w-full flex items-center justify-between p-3 ${action.bgColor} ${action.textColor} ${action.hoverColor} transition-colors`}
                  data-testid={`quick-action-${action.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <ActionIcon size={18} />
                    <span className={isBengali ? 'font-bengali' : ''}>{action.title}</span>
                  </div>
                  <ChevronRight size={16} />
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
