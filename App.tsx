import React, { useState, useEffect, useRef } from 'react';
import { Coordinates, Geofence, TriggerType, LogEntry, GeofenceStatus } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { getDistance } from './utils/geolocation';
import { GeofenceSetup } from './components/GeofenceSetup';
import { StatusDisplay } from './components/StatusDisplay';
import { EventLog } from './components/EventLog';
import { LocationIcon, QuestionMarkIcon } from './components/icons';
import { InstallPWAButton } from './components/InstallPWAButton';
import { MobileHelp } from './components/MobileHelp';

function App() {
  const { location: userLocation, error: geoError } = useGeolocation();
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [geofenceStatus, setGeofenceStatus] = useState<GeofenceStatus>(GeofenceStatus.UNKNOWN);
  const [distance, setDistance] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isHelpOpen, setHelpOpen] = useState(false);
  
  const prevStatusRef = useRef<GeofenceStatus>(GeofenceStatus.UNKNOWN);

  useEffect(() => {
    if (userLocation && geofence) {
      const dist = getDistance(userLocation, geofence.targetLocation);
      setDistance(dist);
      const newStatus = dist <= geofence.radius ? GeofenceStatus.INSIDE : GeofenceStatus.OUTSIDE;

      if (prevStatusRef.current !== newStatus) {
        setGeofenceStatus(newStatus);
        
        if (prevStatusRef.current !== GeofenceStatus.UNKNOWN) {
          const shouldTriggerEnter = newStatus === GeofenceStatus.INSIDE && prevStatusRef.current === GeofenceStatus.OUTSIDE && geofence.triggerType === TriggerType.ENTER;
          const shouldTriggerLeave = newStatus === GeofenceStatus.OUTSIDE && prevStatusRef.current === GeofenceStatus.INSIDE && geofence.triggerType === TriggerType.LEAVE;

          if (shouldTriggerEnter || shouldTriggerLeave) {
            const message = `이벤트: '${geofence.eventTitle}'. 캘린더 알림이 생성되었습니다. (${geofence.eventDescription})`;
            const logEntry: LogEntry = {
              id: Date.now().toString(),
              timestamp: new Date(),
              message: message,
            };
            setLogs(prevLogs => [...prevLogs, logEntry]);
            alert(`지오-알림 트리거!\n${message}`);
          }
        }
        prevStatusRef.current = newStatus;
      }
    }
  }, [userLocation, geofence]);

  const handleSetGeofence = (
    location: { name: string; coordinates: Coordinates },
    radius: number,
    triggerType: TriggerType,
    eventTitle: string,
    eventDescription: string
  ) => {
    const newGeofence: Geofence = {
      id: Date.now().toString(),
      targetLocation: location.coordinates,
      targetLocationName: location.name,
      radius,
      triggerType,
      eventTitle,
      eventDescription,
    };
    setGeofence(newGeofence);
    prevStatusRef.current = GeofenceStatus.UNKNOWN;
    setGeofenceStatus(GeofenceStatus.UNKNOWN);
  };
  
  const handleClearGeofence = () => {
    setGeofence(null);
    setGeofenceStatus(GeofenceStatus.UNKNOWN);
    setDistance(null);
    prevStatusRef.current = GeofenceStatus.UNKNOWN;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-8 px-4">
      <header className="w-full max-w-lg mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              지오펜스 알리미
            </h1>
            <p className="text-gray-400 mt-2">위치 기반 알림 및 캘린더 이벤트를 설정하세요.</p>
          </div>
          <div className="flex items-center space-x-2">
            <InstallPWAButton />
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              title="도움말"
              aria-label="스마트폰에서 사용하는 방법 보기"
            >
              <QuestionMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>


      <main className="w-full">
        {geoError && !userLocation && (
            <div className="w-full max-w-lg mx-auto p-6 my-4 bg-yellow-900 border border-yellow-700 text-yellow-200 rounded-lg text-center flex flex-col items-center">
                <LocationIcon className="w-10 h-10 mb-2"/>
                <p className="font-bold">위치 정보 접근 권한 필요</p>
                <p>{geoError}</p>
                <p className="mt-2 text-sm">이 앱을 사용하려면 브라우저에서 위치 서비스를 활성화해주세요.</p>
            </div>
        )}
        
        <GeofenceSetup
          onSetGeofence={handleSetGeofence}
          clearGeofence={handleClearGeofence}
          hasGeofence={!!geofence}
          userLocation={userLocation}
        />
        
        <div className="my-8 border-t border-gray-700 w-full max-w-2xl mx-auto"></div>

        <StatusDisplay 
            userLocation={userLocation}
            geofence={geofence}
            geofenceStatus={geofenceStatus}
            distance={distance}
        />
        
        <EventLog logs={logs} />
      </main>

      {isHelpOpen && <MobileHelp onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

export default App;