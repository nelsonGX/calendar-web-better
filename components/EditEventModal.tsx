import React from 'react';
import { X, Edit } from 'lucide-react';
import { EditEventModalProps } from './types/calendar';

const EditEventModal: React.FC<EditEventModalProps> = ({
  show,
  editingEvent,
  eventForm,
  onClose,
  onEventFormChange,
  onUpdateEvent
}) => {
  if (!show || !editingEvent) return null;

  const handleClose = () => {
    onClose();
    onEventFormChange({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      color: '#3b82f6',
      endDate: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Event
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-zinc-700 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
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
            onClick={onUpdateEvent}
            disabled={!eventForm.title}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;