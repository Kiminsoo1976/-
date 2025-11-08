
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum TriggerType {
  ENTER = 'enter',
  LEAVE = 'leave',
}

export interface Geofence {
  id: string;
  targetLocationName: string;
  targetLocation: Coordinates;
  radius: number; // in meters
  triggerType: TriggerType;
  eventTitle: string;
  eventDescription: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
}

export enum GeofenceStatus {
  INSIDE = '지역 내',
  OUTSIDE = '지역 밖',
  UNKNOWN = '알 수 없음',
}
