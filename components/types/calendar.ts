export interface Event {
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

export interface EventForm {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  color: string;
  endDate: string;
}

export interface ContextMenuData {
  x: number;
  y: number;
  event: Event;
}

export interface CalendarProps {
  currentDate: Date;
  events: Record<string, Event[]>;
  isAdmin: boolean;
  apiKey: string;
}

export interface CalendarHeaderProps {
  currentDate: Date;
  isAdmin: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export interface CalendarGridProps {
  currentDate: Date;
  events: Record<string, Event[]>;
  isAdmin: boolean;
  onDateClick: (day: number | null) => void;
  onShowDayEvents: (day: number, dayEvents: Event[]) => void;
  onRightClick: (e: React.MouseEvent, event: Event) => void;
}

export interface CalendarCellProps {
  day: number | null;
  currentDate: Date;
  dayEvents: Event[];
  isAdmin: boolean;
  isToday: boolean;
  onDateClick: (day: number | null) => void;
  onShowDayEvents: (day: number, dayEvents: Event[]) => void;
  onRightClick: (e: React.MouseEvent, event: Event) => void;
}

export interface EventModalProps {
  show: boolean;
  selectedDate: Date | null;
  events: Record<string, Event[]>;
  eventForm: EventForm;
  isAdmin: boolean;
  onClose: () => void;
  onEventFormChange: (form: EventForm) => void;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (dateKey: string, eventId: number) => void;
  onRightClick: (e: React.MouseEvent, event: Event) => void;
}

export interface EditEventModalProps {
  show: boolean;
  editingEvent: Event | null;
  eventForm: EventForm;
  onClose: () => void;
  onEventFormChange: (form: EventForm) => void;
  onUpdateEvent: () => void;
}

export interface ApiKeyModalProps {
  show: boolean;
  tempApiKey: string;
  onTempApiKeyChange: (key: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface DayEventsModalProps {
  show: boolean;
  selectedDate: Date | null;
  selectedDayEvents: Event[];
  isAdmin: boolean;
  onClose: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (dateKey: string, eventId: number) => void;
  onRightClick: (e: React.MouseEvent, event: Event) => void;
}

export interface ContextMenuProps {
  contextMenu: ContextMenuData | null;
  isAdmin: boolean;
  onQuickColorChange: (event: Event, color: string) => void;
  onDeleteEvent: (eventId: number) => void;
  onClose: () => void;
}