import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const FLOORS = [6, 5, 4, 3, 2, 1]; // Descending order to match design

export function FloorMap() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['/api/rooms'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getRoomsByFloor = (floorNumber: number) => {
    return rooms.filter(room => room.floorId === floorNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500';
      case 'vacant':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room.number);
    // TODO: Show room details modal
    console.log('Room details:', room);
  };

  return (
    <Card data-testid="floor-map">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isBengali ? 'font-bengali' : ''}>
            {t('Floor Management - Room Status')}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className={isBengali ? 'font-bengali' : ''}>{t('Occupied')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className={isBengali ? 'font-bengali' : ''}>{t('Vacant')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className={isBengali ? 'font-bengali' : ''}>{t('Maintenance')}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {FLOORS.map((floorNumber) => {
            const floorRooms = getRoomsByFloor(floorNumber);
            
            return (
              <div key={floorNumber} className="space-y-3" data-testid={`floor-${floorNumber}`}>
                <h4 className={`text-center font-medium text-foreground ${isBengali ? 'font-bengali' : ''}`}>
                  {t(`Floor ${floorNumber}`)}
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => {
                    const roomNumber = `${floorNumber}${String(i + 1).padStart(2, '0')}`;
                    const room = floorRooms.find(r => r.number === roomNumber);
                    const status = room?.status || 'vacant';
                    
                    return (
                      <button
                        key={roomNumber}
                        onClick={() => room && handleRoomClick(room)}
                        className={`w-8 h-8 rounded cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusColor(status)} ${
                          selectedRoom === roomNumber ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        title={`${t('Room')} ${roomNumber} - ${t(status.charAt(0).toUpperCase() + status.slice(1))}`}
                        data-testid={`room-${roomNumber}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
