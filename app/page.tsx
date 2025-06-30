"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  color: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    time: '',
    location: '',
    description: '',
    color: '#3b82f6'
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number | null | undefined) => {
    if (day) {
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(clickedDate);
      setShowEventModal(true);
    }
  };

  const handleAddEvent = () => {
    if (selectedDate && eventForm.title) {
      const dateKey = formatDateKey(selectedDate);
      const newEvent = {
        id: Date.now(),
        ...eventForm
      };
      
      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newEvent]
      }));
      
      setEventForm({
        title: '',
        time: '',
        location: '',
        description: '',
        color: '#3b82f6'
      });
    }
  }

  const handleDeleteEvent = (dateKey: string, eventId: number) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
    }));
  };

  const isToday = (day: number | null) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-zinc-900 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">Calendar</h1>
      <div className="flex items-center gap-4">
        <button
        onClick={handlePrevMonth}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:scale-110 text-white"
        >
        <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-zinc-200 min-w-48 text-center">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:scale-110 text-white"
        >
        <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-semibold text-zinc-300 py-2">
        {day}
        </div>
      ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dateKey = day ? formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
        const dayEvents = dateKey ? (events[dateKey] || []) : [];
        
        return (
        <div
          key={index}
          onClick={() => handleDateClick(day)}
          className={`
          min-h-24 p-2 border rounded-lg transition-all duration-200
          ${day ? 'hover:bg-zinc-800 cursor-pointer hover:shadow-md' : ''}
          ${isToday(day) ? 'bg-blue-900 border-blue-400' : 'border-zinc-700'}
          `}
        >
          {day && (
          <>
            <div className={`font-medium mb-1 ${isToday(day) ? 'text-blue-400' : 'text-zinc-200'}`}>
            {day}
            </div>
            <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
              key={event.id}
              className="text-xs p-1 rounded truncate hover:opacity-80 transition-opacity"
              style={{ backgroundColor: event.color + '40', color: event.color }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              >
              {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-zinc-400">
              +{dayEvents.length - 3} more
              </div>
            )}
            </div>
          </>
          )}
        </div>
        );
      })}
      </div>

      {/* Event Modal */}
      {showEventModal && selectedDate && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
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
          onClick={() => setShowEventModal(false)}
          className="p-1 hover:bg-zinc-700 rounded-lg transition-colors text-white"
          >
          <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Events */}
        {events[formatDateKey(selectedDate)]?.length > 0 && (
          <div className="mb-4">
          <h4 className="font-semibold text-zinc-200 mb-2">Events</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {events[formatDateKey(selectedDate)].map(event => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-zinc-600 hover:shadow-md transition-shadow bg-zinc-700"
              style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
            >
              <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-semibold text-white">{event.title}</h5>
                {event.time && (
                <p className="text-sm text-zinc-300 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
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
              <button
                onClick={() => handleDeleteEvent(formatDateKey(selectedDate), event.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              </div>
            </div>
            ))}
          </div>
          </div>
        )}

        {/* Add Event Form */}
        <div className="space-y-3">
          <h4 className="font-semibold text-zinc-200">Add New Event</h4>
          <input
          type="text"
          placeholder="Event title"
          value={eventForm.title}
          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-zinc-400"
          />
          <input
          type="time"
          value={eventForm.time}
          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white"
          />
          <input
          type="text"
          placeholder="Location"
          value={eventForm.location}
          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-zinc-400"
          />
          <textarea
          placeholder="Description"
          value={eventForm.description}
          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-zinc-700 text-white placeholder-zinc-400"
          rows="2"
          />
          <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-200">Color:</label>
          <input
            type="color"
            value={eventForm.color}
            onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer"
          />
          </div>
          <button
          onClick={handleAddEvent}
          disabled={!eventForm.title}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
          <Plus className="w-4 h-4" />
          Add Event
          </button>
        </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Calendar;