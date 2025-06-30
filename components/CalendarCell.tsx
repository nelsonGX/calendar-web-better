import React from 'react';
import { CalendarCellProps } from './types/calendar';

const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  dayEvents,
  isAdmin,
  isToday,
  onDateClick,
  onShowDayEvents,
  onRightClick
}) => {
  if (!day) {
    return <div className="min-h-24 sm:min-h-24 min-w-[90px] p-2 border border-zinc-700 rounded-lg"></div>;
  }

  return (
    <div
      onClick={() => onDateClick(day)}
      className={`
        min-h-24 sm:min-h-24 min-w-[90px] p-2 border rounded-lg transition-all duration-200
        ${isAdmin ? 'hover:bg-zinc-800 cursor-pointer hover:shadow-md' : 'cursor-default'}
        ${isToday ? 'bg-orange-900/30 border-orange-400' : 'border-zinc-700'}
      `}
    >
      <div className={`font-medium mb-1 text-sm sm:text-base ${isToday ? 'text-orange-400' : 'text-zinc-200'}`}>
        {day}
      </div>
      <div className="space-y-1">
        {dayEvents.slice(0, 2).map(event => (
          <div
            key={event.id}
            className="text-xs p-1 rounded truncate hover:opacity-80 transition-opacity cursor-pointer leading-tight"
            style={{ backgroundColor: event.color + '40', color: "white" }}
            onClick={(e) => {
              e.stopPropagation();
              onShowDayEvents(day, dayEvents);
            }}
            onContextMenu={(e) => onRightClick(e, event)}
            title={`${event.title}${event.startTime ? ` ${event.startTime}` : ''}${event.endTime && event.endTime !== event.startTime ? `-${event.endTime}` : ''}`}
          >
            <div className="truncate">
              {event.title}
            </div>
            {event.startTime && (
              <div className="text-xs opacity-75 truncate">
                {event.startTime}{event.endTime && event.endTime !== event.startTime && `-${event.endTime}`}
              </div>
            )}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div 
            className="text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onShowDayEvents(day, dayEvents);
            }}
          >
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;