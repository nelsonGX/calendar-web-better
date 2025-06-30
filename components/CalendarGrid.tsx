import React from 'react';
import CalendarCell from './CalendarCell';
import { CalendarGridProps } from './types/calendar';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  isAdmin,
  onDateClick,
  onShowDayEvents,
  onRightClick
}) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isToday = (day: number | null) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-zinc-300 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dateKey = day ? formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
          const dayEvents = dateKey ? (events[dateKey] || []) : [];
          
          return (
            <CalendarCell
              key={index}
              day={day}
              currentDate={currentDate}
              dayEvents={dayEvents}
              isAdmin={isAdmin}
              isToday={isToday(day)}
              onDateClick={onDateClick}
              onShowDayEvents={onShowDayEvents}
              onRightClick={onRightClick}
            />
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;