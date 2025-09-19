import { Users, Bed, DoorOpen, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricsCards() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      id: 'students',
      title: t('Total Students'),
      value: stats?.totalStudents?.toString() || '0',
      change: t('+12 this month'),
      changeType: 'positive' as const,
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-primary',
    },
    {
      id: 'rooms',
      title: t('Total Rooms'),
      value: stats?.totalRooms?.toString() || '0',
      change: t('Across 6 floors'),
      changeType: 'neutral' as const,
      icon: Bed,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 'beds',
      title: t('Available Beds'),
      value: stats?.availableBeds?.toString() || '0',
      change: t('-5 this week'),
      changeType: 'negative' as const,
      icon: DoorOpen,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      id: 'revenue',
      title: t('Monthly Revenue'),
      value: `₹${stats?.monthlyRevenue?.toLocaleString() || '0'}`,
      change: t('+8.2% vs last month'),
      changeType: 'positive' as const,
      icon: IndianRupee,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-cards">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const ChangeIcon = metric.changeType === 'positive' ? TrendingUp : metric.changeType === 'negative' ? TrendingDown : null;
        
        return (
          <Card 
            key={metric.id} 
            className="transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            data-testid={`metric-card-${metric.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`metric-value-${metric.id}`}>
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {ChangeIcon && <ChangeIcon size={14} className="mr-1" />}
                    <p className={`text-sm ${
                      metric.changeType === 'positive' ? 'text-green-600' : 
                      metric.changeType === 'negative' ? 'text-orange-600' : 
                      'text-muted-foreground'
                    } ${isBengali ? 'font-bengali' : ''}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.iconColor} text-xl`} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
