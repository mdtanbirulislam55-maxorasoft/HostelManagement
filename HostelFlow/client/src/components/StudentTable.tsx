import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Eye, Edit } from 'lucide-react';
import { useState } from 'react';

// Define types for the API response
interface Student {
  id: string;
  name: string;
  roomId: string | null;
  studentId: string;
  // Add other fields as necessary
}

interface StudentsData {
  students: Student[];
  total: number;
}

// Define type for Payment
interface Payment {
  id: string;
  studentId: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string; // Add other fields as necessary
}

export function StudentTable() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Query for fetching students data
  const { data: studentsData, isLoading } = useQuery<StudentsData>({
    queryKey: ['/api/students', { limit, offset: (currentPage - 1) * limit }],
  });

  // Query for payments data
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If data is received
  const students = studentsData?.students || [];
  const total = studentsData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const getPaymentStatus = (studentId: string) => {
    const studentPayments = payments.filter(p => p.studentId === studentId);
    const latestPayment = studentPayments[0]; // Assuming sorted by date desc
    
    if (!latestPayment) return 'pending';
    return latestPayment.status;
  };

  const getLastPaymentDate = (studentId: string) => {
    const studentPayments = payments.filter(p => p.studentId === studentId && p.status === 'paid');
    const latestPaidPayment = studentPayments[0];
    
    if (!latestPaidPayment || !latestPaidPayment.paidDate) return '-';
    return new Date(latestPaidPayment.paidDate).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'; // green
      case 'pending':
        return 'secondary'; // yellow
      case 'overdue':
        return 'destructive'; // red
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleViewStudent = (student: any) => {
    // TODO: Navigate to student details
    console.log('View student:', student);
  };

  const handleEditStudent = (student: any) => {
    // TODO: Open edit modal
    console.log('Edit student:', student);
  };

  return (
    <Card data-testid="student-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isBengali ? 'font-bengali' : ''}>
            {t('Recent Student Activities')}
          </CardTitle>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('Search students...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
                data-testid="search-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-button">
              <Filter className="mr-2 h-4 w-4" />
              <span className={isBengali ? 'font-bengali' : ''}>{t('Filter')}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Student ID')}
                </th>
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Name')}
                </th>
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Room')}
                </th>
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Payment Status')}
                </th>
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Last Payment')}
                </th>
                <th className={`text-left py-3 px-4 font-medium text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const paymentStatus = getPaymentStatus(student.id);
                const lastPayment = getLastPaymentDate(student.id);
                
                return (
                  <tr 
                    key={student.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    data-testid={`student-row-${student.id}`}
                  >
                    <td className="py-3 px-4 text-foreground font-mono" data-testid={`student-id-${student.id}`}>
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`text-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid={`student-name-${student.id}`}>
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground" data-testid={`student-room-${student.id}`}>
                      {student.roomId || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={getStatusBadgeVariant(paymentStatus)}
                        className={isBengali ? 'font-bengali' : ''}
                        data-testid={`payment-status-${student.id}`}
                      >
                        {t(paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1))}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground" data-testid={`last-payment-${student.id}`}>
                      {lastPayment}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                          data-testid={`view-student-${student.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                          data-testid={`edit-student-${student.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className={`text-sm text-muted-foreground ${isBengali ? 'font-bengali' : ''}`} data-testid="pagination-info">
            {t('Showing 1 to 5 of 247 results').replace('1 to 5 of 247', `${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, total)} of ${total}`)}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              data-testid="prev-page-button"
            >
              {t('Previous')}
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  data-testid={`page-button-${page}`}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              data-testid="next-page-button"
            >
              {t('Next')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
