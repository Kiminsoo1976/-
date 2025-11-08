
import React from 'react';
import { Coordinates, Geofence, GeofenceStatus, TriggerType } from '../types';

interface StatusDisplayProps {
  userLocation: Coordinates | null;
  geofence: Geofence | null;
  geofenceStatus: GeofenceStatus;
  distance: number | null;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-cyan-400 mb-2">{title}</h3>
        <div className="text-gray-200 text-lg">{children}</div>
    </div>
);

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  userLocation,
  geofence,
  geofenceStatus,
  distance
}) => {
  const getStatusColor = () => {
    switch (geofenceStatus) {
      case GeofenceStatus.INSIDE:
        return 'text-green-400';
      case GeofenceStatus.OUTSIDE:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto p-4 md:p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-300">실시간 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="현재 위치">
                {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : '대기 중...'}
            </InfoCard>
            
            <InfoCard title="지오펜스 상태">
                 <span className={`${getStatusColor()} font-bold`}>{geofence ? geofenceStatus : '비활성'}</span>
            </InfoCard>

            {geofence && (
                 <>
                    <InfoCard title="목표 지역">
                        {geofence.targetLocationName}
                    </InfoCard>
                    <InfoCard title="목표까지의 거리">
                        {distance !== null ? `${Math.round(distance)} 미터` : '계산 중...'}
                    </InfoCard>
                 </>
            )}
        </div>
        {geofence && (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                 <p className="text-gray-400">
                    '{geofence.eventTitle}' 이벤트에 대해 <span className="font-bold text-cyan-400">{geofence.triggerType === TriggerType.ENTER ? '진입 시' : '이탈 시'}</span> 알림이 트리거됩니다.
                 </p>
            </div>
        )}
    </div>
  );
};
