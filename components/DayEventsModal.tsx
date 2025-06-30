import React from 'react';
import { X, Clock, MapPin, Edit } from 'lucide-react';
import { DayEventsModalProps } from './types/calendar';

const DayEventsModal: React.FC<DayEventsModalProps> = ({
  show,
  selectedDate,
  selectedDayEvents,
  isAdmin,
  onClose,
  onEditEvent,
  onDeleteEvent,
  onRightClick
}) => {
  if (!show || !selectedDate) return null;

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-700 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {selectedDayEvents.map(event => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-zinc-600 bg-zinc-700"
              style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
              onContextMenu={(e) => onRightClick(e, event)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-semibold text-white">{event.title}</h5>
                  {(event.startTime || event.endTime) && (
                    <p className="text-sm text-zinc-300 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {event.startTime}{event.endTime && event.endTime !== event.startTime && ` - ${event.endTime}`}
                    </p>
                  )}
                  {event.endDate && event.endDate !== event.startDate && (
                    <p className="text-sm text-zinc-300">
                      Until: {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-zinc-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-zinc-300 mt-1">{event.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        onEditEvent(event);
                        onClose();
                      }}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteEvent(formatDateKey(selectedDate), event.id);
                        onClose();
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayEventsModal;