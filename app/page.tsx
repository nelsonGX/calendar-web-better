"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Key, Edit } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  color: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; event: Event } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    color: '#3b82f6',
    endDate: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam === 'true') {
      const storedApiKey = localStorage.getItem('calendar-api-key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
        setIsAdmin(true);
      } else {
        setShowApiKeyModal(true);
      }
    }
    
    fetchEvents();

    // Close context menu on click outside
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const eventsData = await response.json();
        const groupedEvents: Record<string, Event[]> = {};
        
        eventsData.forEach((event: Event) => {
          // Add event to start date
          if (!groupedEvents[event.startDate]) {
            groupedEvents[event.startDate] = [];
          }
          groupedEvents[event.startDate].push(event);
          
          // If multi-day event, add to all dates in range
          if (event.endDate && event.endDate !== event.startDate) {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + 1);
            
            while (currentDate <= endDate) {
              const dateKey = currentDate.toISOString().split('T')[0];
              if (!groupedEvents[dateKey]) {
                groupedEvents[dateKey] = [];
              }
              groupedEvents[dateKey].push(event);
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        });
        
        setEvents(groupedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleApiKeySubmit = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      localStorage.setItem('calendar-api-key', tempApiKey);
      setIsAdmin(true);
      setShowApiKeyModal(false);
      setTempApiKey('');
    }
  };

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
    if (day && isAdmin) {
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(clickedDate);
      setShowEventModal(true);
    }
  };

  const handleShowDayEvents = (day: number, dayEvents: Event[]) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setSelectedDayEvents(dayEvents);
    setShowDayEventsModal(true);
  };

  const handleAddEvent = async () => {
    if (selectedDate && eventForm.title && isAdmin) {
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({
            ...eventForm,
            startDate: formatDateKey(selectedDate),
            endDate: eventForm.endDate || null
          })
        });

        if (response.ok) {
          await fetchEvents();
          setEventForm({
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            description: '',
            color: '#3b82f6',
            endDate: ''
          });
          setShowEventModal(false);
        } else {
          console.error('Failed to create event');
        }
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleEditEvent = (event: Event) => {
    if (!isAdmin) return;
    
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      description: event.description || '',
      color: event.color,
      endDate: event.endDate || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !eventForm.title || !isAdmin) return;

    try {
      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          ...eventForm,
          startDate: editingEvent.startDate,
          endDate: eventForm.endDate || null
        })
      });

      if (response.ok) {
        await fetchEvents();
        setEventForm({
          title: '',
          startTime: '',
          endTime: '',
          location: '',
          description: '',
          color: '#3b82f6',
          endDate: ''
        });
        setEditingEvent(null);
        setShowEditModal(false);
        setShowEventModal(false);
        setShowDayEventsModal(false);
      } else {
        console.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleQuickColorChange = async (event: Event, color: string) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.description,
          color: color,
          startDate: event.startDate,
          endDate: event.endDate
        })
      });

      if (response.ok) {
        await fetchEvents();
        setContextMenu(null);
      } else {
        console.error('Failed to update event color');
      }
    } catch (error) {
      console.error('Error updating event color:', error);
    }
  };

  const handleRightClick = (e: React.MouseEvent, event: Event) => {
    if (!isAdmin) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      event: event
    });
  };

  const handleDeleteEvent = async (dateKey: string, eventId: number) => {
    if (!isAdmin) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey
        }
      });

      if (response.ok) {
        await fetchEvents();
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        {isAdmin && (
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Key className="w-3 h-3" />
            Admin
          </span>
        )}
      </div>
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
          ${day && isAdmin ? 'hover:bg-zinc-800 cursor-pointer hover:shadow-md' : ''}
          ${day && !isAdmin ? 'cursor-default' : ''}
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
              className="text-xs p-1 rounded truncate hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: event.color + '40', color: event.color }}
              onClick={(e) => {
                e.stopPropagation();
                handleShowDayEvents(day, dayEvents);
              }}
              onContextMenu={(e) => handleRightClick(e, event)}
              >
              {event.title}
              {event.startTime && ` ${event.startTime}`}
              {event.endTime && event.endTime !== event.startTime && `-${event.endTime}`}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div 
                className="text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDayEvents(day, dayEvents);
                }}
              >
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
              onContextMenu={(e) => handleRightClick(e, event)}
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
                    onClick={() => handleEditEvent(event)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(formatDateKey(selectedDate), event.id)}
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

        {/* Add Event Form */}
        {isAdmin && (
        <div className="space-y-3">
          <h4 className="font-semibold text-zinc-200">Add New Event</h4>
          <input
          type="text"
          placeholder="Event title"
          value={eventForm.title}
          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-zinc-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
            type="time"
            placeholder="Start time"
            value={eventForm.startTime}
            onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
            className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white"
            />
            <input
            type="time"
            placeholder="End time"
            value={eventForm.endTime}
            onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
            className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white"
            />
          </div>
          <input
          type="date"
          placeholder="End date (optional)"
          value={eventForm.endDate}
          onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
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
        )}
        </div>
      </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Event
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEvent(null);
                  setEventForm({
                    title: '',
                    startTime: '',
                    endTime: '',
                    location: '',
                    description: '',
                    color: '#3b82f6',
                    endDate: ''
                  });
                }}
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
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-zinc-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  placeholder="Start time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white"
                />
                <input
                  type="time"
                  placeholder="End time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  className="px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white"
                />
              </div>
              <input
                type="date"
                placeholder="End date (optional)"
                value={eventForm.endDate}
                onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
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
                onClick={handleUpdateEvent}
                disabled={!eventForm.title}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Update Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                Admin Access
              </h3>
            </div>
            <p className="text-zinc-300 mb-4">Enter your API key to access admin features:</p>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="API Key"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-zinc-400"
                onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApiKeySubmit}
                  disabled={!tempApiKey.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowApiKeyModal(false);
                    setTempApiKey('');
                    window.history.replaceState({}, '', window.location.pathname);
                  }}
                  className="flex-1 bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Events Modal */}
      {showDayEventsModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl">
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
                onClick={() => setShowDayEventsModal(false)}
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
                  onContextMenu={(e) => handleRightClick(e, event)}
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
                            handleEditEvent(event);
                            setShowDayEventsModal(false);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteEvent(formatDateKey(selectedDate), event.id);
                            setShowDayEventsModal(false);
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
      )}

      {/* Context Menu */}
      {contextMenu && isAdmin && (
        <div
          className="fixed bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg py-2 z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-xs text-zinc-400 font-medium">Quick Actions</div>
          <div className="border-t border-zinc-600 my-1"></div>
          
          <div className="px-3 py-1 text-xs text-zinc-400 font-medium">Change Color</div>
          <div className="flex gap-1 px-3 py-2">
            <button
              onClick={() => handleQuickColorChange(contextMenu.event, '#ef4444')}
              className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 transition-colors border-2 border-transparent hover:border-white"
              title="Red"
            />
            <button
              onClick={() => handleQuickColorChange(contextMenu.event, '#22c55e')}
              className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-400 transition-colors border-2 border-transparent hover:border-white"
              title="Green"
            />
            <button
              onClick={() => handleQuickColorChange(contextMenu.event, '#3b82f6')}
              className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors border-2 border-transparent hover:border-white"
              title="Blue"
            />
          </div>
          
          <div className="border-t border-zinc-600 my-1"></div>
          <button
            onClick={() => {
              handleDeleteEvent('', contextMenu.event.id);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 transition-colors"
          >
            Quick Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;