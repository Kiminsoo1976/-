import React, { useState } from 'react';
import { Coordinates, TriggerType } from '../types';
import { LocationIcon, CalendarIcon, BellIcon } from './icons';
import { MapPicker } from './MapPicker';

interface GeofenceSetupProps {
  onSetGeofence: (
    location: { name: string; coordinates: Coordinates },
    radius: number,
    triggerType: TriggerType,
    eventTitle: string,
    eventDescription: string
  ) => void;
  clearGeofence: () => void;
  hasGeofence: boolean;
  userLocation: Coordinates | null;
}

export const GeofenceSetup: React.FC<GeofenceSetupProps> = ({
  onSetGeofence,
  clearGeofence,
  hasGeofence,
  userLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; coordinates: Coordinates } | null>(null);
  const [isMapOpen, setMapOpen] = useState(false);
  const [radius, setRadius] = useState(500);
  const [triggerType, setTriggerType] = useState<TriggerType>(TriggerType.ENTER);
  const [eventTitle, setEventTitle] = useState('에펠탑 방문');
  const [eventDescription, setEventDescription] = useState('에펠탑 지역에 도착했습니다.');

  const handleLocationSelect = (location: { name: string; coordinates: Coordinates }) => {
    setSelectedLocation(location);
    setEventTitle(`${location.name} 방문`);
    setEventDescription(`${location.name} 지역에 도착했습니다.`);
    setMapOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation) {
      onSetGeofence(selectedLocation, radius, triggerType, eventTitle, eventDescription);
    }
  };
  
  const handleClearGeofence = () => {
    clearGeofence();
    setSelectedLocation(null);
    setEventTitle('에펠탑 방문');
    setEventDescription('에펠탑 지역에 도착했습니다.');
  }

  if (hasGeofence) {
    return (
       <div className="w-full max-w-lg mx-auto p-4">
        <button
          onClick={handleClearGeofence}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center"
        >
          활성 지오펜스 제거
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-4 md:p-6 bg-gray-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">지오-알림 생성</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-gray-300 text-sm font-bold mb-2">
              <LocationIcon className="w-5 h-5 mr-2" />
              목표 위치
            </label>
            <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                <p className="text-gray-200 truncate pr-2">
                    {selectedLocation ? selectedLocation.name : '지도에서 위치를 선택하세요'}
                </p>
                <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex-shrink-0"
                >
                    지도 열기
                </button>
            </div>
          </div>

          <div>
              <label htmlFor="radius" className="flex items-center text-gray-300 text-sm font-bold mb-2">
                  반경 ({radius}미터)
              </label>
              <input
                  id="radius"
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
              />
          </div>

          <div>
              <span className="flex items-center text-gray-300 text-sm font-bold mb-2">
                  <BellIcon className="w-5 h-5 mr-2" />
                  트리거 조건
              </span>
              <div className="flex rounded-lg bg-gray-700 p-1">
                  <button type="button" onClick={() => setTriggerType(TriggerType.ENTER)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${triggerType === TriggerType.ENTER ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>진입 시</button>
                  <button type="button" onClick={() => setTriggerType(TriggerType.LEAVE)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${triggerType === TriggerType.LEAVE ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>이탈 시</button>
              </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 space-y-4">
               <h3 className="flex items-center text-gray-300 text-lg font-bold">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  캘린더 이벤트 상세
              </h3>
              <div>
                   <label htmlFor="eventTitle" className="block text-gray-300 text-sm font-bold mb-2">이벤트 제목</label>
                   <input
                      id="eventTitle"
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                   />
              </div>
              <div>
                   <label htmlFor="eventDesc" className="block text-gray-300 text-sm font-bold mb-2">이벤트 설명</label>
                   <textarea
                      id="eventDesc"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={3}
                      className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
                   />
              </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedLocation}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              지오펜스 설정
            </button>
          </div>
        </form>
      </div>
      {isMapOpen && (
        <MapPicker 
          show={isMapOpen}
          onClose={() => setMapOpen(false)}
          onLocationSelect={handleLocationSelect}
          userLocation={userLocation}
        />
      )}
    </>
  );
};