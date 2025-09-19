import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MetricsCards } from './MetricsCards';
import { FloorMap } from './FloorMap';
import { StudentTable } from './StudentTable';
import { AlertsSection } from './AlertsSection';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const handleAddStudent = () => {
    // TODO: Open add student modal
    console.log('Add new student');
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background" data-testid="dashboard">
      <div className="p-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold text-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="dashboard-title">
              {t('Dashboard Overview')}
            </h2>
            <p className={`text-muted-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="dashboard-subtitle">
              {t('Monitor and manage your hostel operations')}
            </p>
          </div>
          <Button 
            onClick={handleAddStudent}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="add-student-button"
          >
            <Plus className="mr-2" size={16} />
            <span className={isBengali ? 'font-bengali' : ''}>{t('Add New Student')}</span>
          </Button>
        </div>

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Floor Management Section */}
        <FloorMap />

        {/* Alerts Section */}
        <AlertsSection />

        {/* Student Management Table */}
        <StudentTable />
      </div>
    </main>
  );
}
