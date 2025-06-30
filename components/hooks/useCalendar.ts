import { useState, useEffect } from 'react';
import { Event, EventForm, ContextMenuData } from '../types/calendar';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventForm, setEventForm] = useState<EventForm>({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    color: '#3b82f6',
    endDate: ''
  });

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
          if (!groupedEvents[event.startDate]) {
            groupedEvents[event.startDate] = [];
          }
          groupedEvents[event.startDate].push(event);
          
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

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      color: '#3b82f6',
      endDate: ''
    });
  };

  return {
    // State
    currentDate,
    selectedDate,
    events,
    showEventModal,
    showEditModal,
    showApiKeyModal,
    showDayEventsModal,
    selectedDayEvents,
    editingEvent,
    contextMenu,
    apiKey,
    tempApiKey,
    isAdmin,
    eventForm,
    
    // Setters
    setCurrentDate,
    setSelectedDate,
    setEvents,
    setShowEventModal,
    setShowEditModal,
    setShowApiKeyModal,
    setShowDayEventsModal,
    setSelectedDayEvents,
    setEditingEvent,
    setContextMenu,
    setApiKey,
    setTempApiKey,
    setIsAdmin,
    setEventForm,
    
    // Utils
    fetchEvents,
    formatDateKey,
    resetEventForm
  };
};