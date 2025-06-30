import { Event, EventForm } from '../types/calendar';

export const useCalendarActions = (
  apiKey: string,
  isAdmin: boolean,
  fetchEvents: () => Promise<void>,
  formatDateKey: (date: Date) => string,
  resetEventForm: () => void
) => {
  const handleApiKeySubmit = (
    tempApiKey: string,
    setApiKey: (key: string) => void,
    setIsAdmin: (admin: boolean) => void,
    setShowApiKeyModal: (show: boolean) => void,
    setTempApiKey: (key: string) => void
  ) => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      localStorage.setItem('calendar-api-key', tempApiKey);
      setIsAdmin(true);
      setShowApiKeyModal(false);
      setTempApiKey('');
    }
  };

  const handlePrevMonth = (
    currentDate: Date,
    setCurrentDate: (date: Date) => void
  ) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = (
    currentDate: Date,
    setCurrentDate: (date: Date) => void
  ) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (
    day: number | null,
    currentDate: Date,
    setSelectedDate: (date: Date | null) => void,
    setShowEventModal: (show: boolean) => void
  ) => {
    if (day && isAdmin) {
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(clickedDate);
      setShowEventModal(true);
    }
  };

  const handleShowDayEvents = (
    day: number,
    dayEvents: Event[],
    currentDate: Date,
    setSelectedDate: (date: Date | null) => void,
    setSelectedDayEvents: (events: Event[]) => void,
    setShowDayEventsModal: (show: boolean) => void
  ) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setSelectedDayEvents(dayEvents);
    setShowDayEventsModal(true);
  };

  const handleAddEvent = async (
    selectedDate: Date | null,
    eventForm: EventForm,
    setShowEventModal: (show: boolean) => void
  ) => {
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
          resetEventForm();
          setShowEventModal(false);
        } else {
          console.error('Failed to create event');
        }
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleEditEvent = (
    event: Event,
    setEditingEvent: (event: Event | null) => void,
    setEventForm: (form: EventForm) => void,
    setShowEditModal: (show: boolean) => void
  ) => {
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

  const handleUpdateEvent = async (
    editingEvent: Event | null,
    eventForm: EventForm,
    setEditingEvent: (event: Event | null) => void,
    setShowEditModal: (show: boolean) => void,
    setShowEventModal: (show: boolean) => void,
    setShowDayEventsModal: (show: boolean) => void
  ) => {
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
        resetEventForm();
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

  const handleQuickColorChange = async (
    event: Event,
    color: string,
    setContextMenu: (menu: any) => void
  ) => {
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

  const handleRightClick = (
    e: React.MouseEvent,
    event: Event,
    setContextMenu: (menu: any) => void
  ) => {
    if (!isAdmin) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      event: event
    });
  };

  const handleDeleteEvent = async (eventId: number) => {
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

  return {
    handleApiKeySubmit,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleShowDayEvents,
    handleAddEvent,
    handleEditEvent,
    handleUpdateEvent,
    handleQuickColorChange,
    handleRightClick,
    handleDeleteEvent
  };
};