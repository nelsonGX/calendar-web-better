import React from 'react';
import { ChevronLeft, ChevronRight, Key } from 'lucide-react';
import { CalendarHeaderProps } from './types/calendar';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  isAdmin,
  onPrevMonth,
  onNextMonth
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Calendar</h1>
        {isAdmin && (
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Key className="w-3 h-3" />
            Admin
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:scale-110 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-200 min-w-[200px] sm:min-w-48 text-center">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:scale-110 text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;