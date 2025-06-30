"use client"

import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import EditEventModal from './EditEventModal';
import ApiKeyModal from './ApiKeyModal';
import DayEventsModal from './DayEventsModal';
import ContextMenu from './ContextMenu';
import { useCalendar } from './hooks/useCalendar';
import { useCalendarActions } from './hooks/useCalendarActions';

const Calendar = () => {
  const {
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
    isLoading,
    eventForm,
    setCurrentDate,
    setSelectedDate,
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
    setIsLoading,
    setEventForm,
    fetchEvents,
    formatDateKey,
    resetEventForm
  } = useCalendar();

  const {
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
  } = useCalendarActions(apiKey, isAdmin, fetchEvents, formatDateKey, resetEventForm, setIsLoading);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        isAdmin={isAdmin}
        onPrevMonth={() => handlePrevMonth(currentDate, setCurrentDate)}
        onNextMonth={() => handleNextMonth(currentDate, setCurrentDate)}
      />

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          isAdmin={isAdmin}
          onDateClick={(day) => handleDateClick(day, currentDate, setSelectedDate, setShowEventModal)}
          onShowDayEvents={(day, dayEvents) => handleShowDayEvents(day, dayEvents, currentDate, setSelectedDate, setSelectedDayEvents, setShowDayEventsModal)}
          onRightClick={(e, event) => handleRightClick(e, event, setContextMenu)}
        />
      </div>

      <EventModal
        show={showEventModal}
        selectedDate={selectedDate}
        events={events}
        eventForm={eventForm}
        isAdmin={isAdmin}
        onClose={() => setShowEventModal(false)}
        onEventFormChange={setEventForm}
        onAddEvent={() => handleAddEvent(selectedDate, eventForm, setShowEventModal)}
        onEditEvent={(event) => handleEditEvent(event, setEditingEvent, setEventForm, setShowEditModal)}
        onDeleteEvent={(dateKey, eventId) => handleDeleteEvent(eventId)}
        onRightClick={(e, event) => handleRightClick(e, event, setContextMenu)}
      />

      <EditEventModal
        show={showEditModal}
        editingEvent={editingEvent}
        eventForm={eventForm}
        onClose={() => {
          setShowEditModal(false);
          setEditingEvent(null);
          resetEventForm();
        }}
        onEventFormChange={setEventForm}
        onUpdateEvent={() => handleUpdateEvent(editingEvent, eventForm, setEditingEvent, setShowEditModal, setShowEventModal, setShowDayEventsModal)}
      />

      <ApiKeyModal
        show={showApiKeyModal}
        tempApiKey={tempApiKey}
        onTempApiKeyChange={setTempApiKey}
        onSubmit={() => handleApiKeySubmit(tempApiKey, setApiKey, setIsAdmin, setShowApiKeyModal, setTempApiKey)}
        onCancel={() => {
          setShowApiKeyModal(false);
          setTempApiKey('');
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />

      <DayEventsModal
        show={showDayEventsModal}
        selectedDate={selectedDate}
        selectedDayEvents={selectedDayEvents}
        isAdmin={isAdmin}
        onClose={() => setShowDayEventsModal(false)}
        onEditEvent={(event) => handleEditEvent(event, setEditingEvent, setEventForm, setShowEditModal)}
        onDeleteEvent={(dateKey, eventId) => handleDeleteEvent(eventId)}
        onRightClick={(e, event) => handleRightClick(e, event, setContextMenu)}
      />

      <ContextMenu
        contextMenu={contextMenu}
        isAdmin={isAdmin}
        onQuickColorChange={(event, color) => handleQuickColorChange(event, color, setContextMenu)}
        onDeleteEvent={handleDeleteEvent}
        onClose={() => setContextMenu(null)}
      />
    </div>
  );
};

export default Calendar;