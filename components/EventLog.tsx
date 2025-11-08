
import React from 'react';
import { LogEntry } from '../types';
import { LogIcon } from './icons';

interface EventLogProps {
  logs: LogEntry[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-300 flex items-center justify-center">
        <LogIcon className="w-6 h-6 mr-2" />
        이벤트 로그
      </h2>
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto space-y-3">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">아직 트리거된 이벤트가 없습니다.</p>
        ) : (
          [...logs].reverse().map((entry) => (
            <div key={entry.id} className="bg-gray-700 p-3 rounded-lg flex items-start space-x-3">
               <div className="mt-1 flex-shrink-0 w-3 h-3 rounded-full bg-cyan-400"></div>
               <div>
                  <p className="text-gray-200 text-sm">{entry.message}</p>
                  <p className="text-gray-400 text-xs">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
