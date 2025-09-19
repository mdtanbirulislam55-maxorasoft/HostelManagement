import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, TrendingUp, Shield } from 'lucide-react';

export default function Landing() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student tracking and management system',
    },
    {
      icon: Building,
      title: 'Room Management',
      description: 'Real-time room status and occupancy tracking',
    },
    {
      icon: TrendingUp,
      title: 'Financial Tracking',
      description: 'Payment monitoring and financial reporting',
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Complete oversight and activity logging',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4" data-testid="landing-page">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-primary" />
          <h1 className={`text-4xl font-bold text-foreground ${isBengali ? 'font-bengali' : ''}`}>
            {t('Hostel Management System')}
          </h1>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isBengali ? 'font-bengali' : ''}`}>
            {t('Monitor and manage your hostel operations')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className={isBengali ? 'font-bengali' : ''}>{t(feature.title)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                    {t(feature.description)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login Section */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className={`text-2xl font-semibold text-foreground ${isBengali ? 'font-bengali' : ''}`}>
              {t('Welcome')}
            </h2>
            <p className={`text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
              {t('Please log in to access the hostel management system')}
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="login-button"
            >
              <span className={isBengali ? 'font-bengali' : ''}>{t('Login')}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
