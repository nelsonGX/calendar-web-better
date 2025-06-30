import React from 'react';
import { X, Plus, Clock, MapPin, Edit } from 'lucide-react';
import { EventModalProps } from './types/calendar';

const EventModal: React.FC<EventModalProps> = ({
  show,
  selectedDate,
  events,
  eventForm,
  isAdmin,
  onClose,
  onEventFormChange,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onRightClick
}) => {
  if (!show || !selectedDate) return null;

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const dateKey = formatDateKey(selectedDate);
  const dayEvents = events[dateKey] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all scale-100">
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

        {dayEvents.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-zinc-200 mb-2">Events</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-zinc-600 hover:shadow-md transition-shadow bg-zinc-700"
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
                          onClick={() => onEditEvent(event)}
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(dateKey, event.id)}
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
        )}

        {isAdmin && (
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200">Add New Event</h4>
            <input
              type="text"
              placeholder="Event title"
              value={eventForm.title}
              onChange={(e) => onEventFormChange({ ...eventForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white placeholder-zinc-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                placeholder="Start time"
                value={eventForm.startTime}
                onChange={(e) => onEventFormChange({ ...eventForm, startTime: e.target.value })}
                className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white"
              />
              <input
                type="time"
                placeholder="End time"
                value={eventForm.endTime}
                onChange={(e) => onEventFormChange({ ...eventForm, endTime: e.target.value })}
                className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white"
              />
            </div>
            <input
              type="date"
              placeholder="End date (optional)"
              value={eventForm.endDate}
              onChange={(e) => onEventFormChange({ ...eventForm, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white"
            />
            <input
              type="text"
              placeholder="Location"
              value={eventForm.location}
              onChange={(e) => onEventFormChange({ ...eventForm, location: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white placeholder-zinc-400"
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => onEventFormChange({ ...eventForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-zinc-700 text-white placeholder-zinc-400"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-zinc-200">Color:</label>
              <input
                type="color"
                value={eventForm.color}
                onChange={(e) => onEventFormChange({ ...eventForm, color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
            <button
              onClick={onAddEvent}
              disabled={!eventForm.title}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;