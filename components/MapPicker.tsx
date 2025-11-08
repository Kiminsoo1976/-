import React, { useEffect, useRef, useState } from 'react';
import { Coordinates } from '../types';

// Leaflet은 index.html의 스크립트 태그를 통해 로드되므로, TypeScript에서 L 변수를 인식할 수 있도록 전역으로 선언합니다.
declare var L: any;

interface MapPickerProps {
  show: boolean;
  onClose: () => void;
  onLocationSelect: (location: { name: string; coordinates: Coordinates }) => void;
  userLocation: Coordinates | null;
}

// Nominatim 검색 결과에 대한 타입 정의
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({ show, onClose, onLocationSelect, userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Leaflet 지도 인스턴스
  const markerInstanceRef = useRef<any>(null); // Leaflet 마커 인스턴스
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; coordinates: Coordinates } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  
  // 지도 초기화
  useEffect(() => {
    if (show && mapContainerRef.current && !mapInstanceRef.current) {
      const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : [37.5665, 126.9780]; // 기본값: 서울

      const map = L.map(mapContainerRef.current).setView(center, 13);
      mapInstanceRef.current = map;

      // 가시성을 높이기 위해 표준 OpenStreetMap 타일 레이어로 변경
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker(center, { draggable: true }).addTo(map);
      markerInstanceRef.current = marker;
      
      reverseGeocode({ lat: center[0], lng: center[1] });

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        reverseGeocode({ lat, lng });
      });

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        reverseGeocode({ lat, lng });
      });
    }

    // 모달이 표시될 때 지도가 깨지는 현상을 방지하기 위해 지도 크기를 재조정
    if(show && mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current.invalidateSize(), 0);
    }

  }, [show, userLocation]);

  // 검색어 변경 시 디바운스를 적용하여 검색 실행
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json&addressdetails=1&limit=5`
        );
        const data: NominatimResult[] = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("검색 실패:", error);
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500); // 500ms 디바운스

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // 좌표를 주소로 변환 (Reverse Geocoding)
  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    setGeocodingError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setSelectedLocation({
          name: data.display_name,
          coordinates: { latitude: coords.lat, longitude: coords.lng },
        });
      } else {
        throw new Error('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
        setSelectedLocation({
            name: "사용자 지정 위치",
            coordinates: {
                latitude: coords.lat,
                longitude: coords.lng,
            }
        });
        setGeocodingError('주소를 찾을 수 없습니다. 좌표로 저장됩니다.');
    }
  };

  const handleSelectSearchResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setSelectedLocation({
      name: result.display_name,
      coordinates: { latitude: lat, longitude: lng },
    });
    
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 17);
      markerInstanceRef.current.setLatLng([lat, lng]);
    }

    setSearchQuery('');
    setSearchResults([]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 md:p-4">
      <div className="bg-gray-800 shadow-2xl w-full h-full flex flex-col relative md:rounded-xl md:max-w-4xl md:max-h-[90vh]">
          <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[1000] md:w-1/2 max-w-md">
            <input
              type="text"
              placeholder="장소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-lg"
            />
            {isSearching && <div className="bg-gray-700 text-white p-2 mt-1 rounded-lg text-sm">검색 중...</div>}
            {searchResults.length > 0 && (
              <ul className="bg-gray-700 mt-1 rounded-lg overflow-hidden shadow-lg">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    onClick={() => handleSelectSearchResult(result)}
                    className="p-3 text-white hover:bg-cyan-600 cursor-pointer text-sm"
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div ref={mapContainerRef} className="w-full h-full md:rounded-t-lg bg-gray-700"></div>

          <div className="p-4 bg-gray-900 md:rounded-b-lg flex flex-col gap-4">
              <div className="text-sm text-gray-300 text-center flex-grow">
                  <p className="font-bold text-white truncate">{selectedLocation?.name || '지도에서 위치를 선택하거나 검색하세요'}</p>
                  {geocodingError && <p className="text-yellow-400 text-xs mt-1">{geocodingError}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                      onClick={onClose} 
                      className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                      취소
                  </button>
                  <button
                      onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
                      disabled={!selectedLocation}
                      className="py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                      위치 확정
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};
