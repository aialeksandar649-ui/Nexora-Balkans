import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface BookedDateRange {
  check_in: string;
  check_out: string;
}

interface BookingCalendarProps {
  onDatesSelect: (start: Date, end: Date) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  /** Blocked date ranges (e.g. from existing bookings) */
  blockedDates?: BookedDateRange[];
}

function isDateInBlockedRange(day: number, month: Date, blocked: BookedDateRange[]): boolean {
  if (!blocked?.length) return false;
  const date = new Date(month.getFullYear(), month.getMonth(), day);
  date.setHours(0, 0, 0, 0);
  const t = date.getTime();
  for (const range of blocked) {
    const start = new Date(range.check_in);
    const end = new Date(range.check_out);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (t >= start.getTime() && t < end.getTime()) return true;
  }
  return false;
}

export default function BookingCalendar({ onDatesSelect, initialStartDate, initialEndDate, blockedDates }: BookingCalendarProps) {
  const { language } = useLanguage();
  const [currentMonth1, setCurrentMonth1] = useState(() => {
    if (initialStartDate) {
      return new Date(initialStartDate.getFullYear(), initialStartDate.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const [currentMonth2, setCurrentMonth2] = useState(() => {
    const nextMonth = new Date(currentMonth1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  });
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);

  useEffect(() => {
    setStartDate(initialStartDate || null);
    setEndDate(initialEndDate || null);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    const nextMonth = new Date(currentMonth1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth2(nextMonth);
  }, [currentMonth1]);

  const monthNames = language === 'sr' 
    ? ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = language === 'sr'
    ? ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isPastDate = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isBlockedDate = (day: number, month: Date) => {
    return isDateInBlockedRange(day, month, blockedDates ?? []);
  };

  const isDateSelected = (day: number, month: Date) => {
    if (!day) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
      if (date.getTime() === startDate.getTime()) return true;
    }
    if (endDate) {
      endDate.setHours(0, 0, 0, 0);
      if (date.getTime() === endDate.getTime()) return true;
    }
    return false;
  };

  const isDateInRange = (day: number, month: Date) => {
    if (!day || !startDate || !endDate) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return date > start && date < end;
  };

  const handleDateClick = (day: number, month: Date) => {
    if (!day) return;
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (isPastDate(day, month) || isBlockedDate(day, month)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
        onDatesSelect(startDate, selectedDate);
      } else {
        setStartDate(selectedDate);
        setEndDate(null);
      }
    }
  };

  const prevMonth1 = () => {
    setCurrentMonth1(new Date(currentMonth1.getFullYear(), currentMonth1.getMonth() - 1, 1));
  };

  const nextMonth1 = () => {
    setCurrentMonth1(new Date(currentMonth1.getFullYear(), currentMonth1.getMonth() + 1, 1));
  };

  const prevMonth2 = () => {
    setCurrentMonth2(new Date(currentMonth2.getFullYear(), currentMonth2.getMonth() - 1, 1));
  };

  const nextMonth2 = () => {
    setCurrentMonth2(new Date(currentMonth2.getFullYear(), currentMonth2.getMonth() + 1, 1));
  };

  const renderMonth = (month: Date, isFirst: boolean) => {
    const days = getDaysInMonth(month);
    const prevMonth = isFirst ? prevMonth1 : prevMonth2;
    const nextMonth = isFirst ? nextMonth1 : nextMonth2;

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-teal-600 dark:text-teal-400"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-teal-600 dark:text-teal-400"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500 py-1 sm:py-1.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-9 sm:h-10"></div>;
            }
            
            const isPast = isPastDate(day, month);
            const isBlocked = isBlockedDate(day, month);
            const isSelected = isDateSelected(day, month);
            const inRange = isDateInRange(day, month);
            const disabled = isPast || isBlocked;

            const buttonClasses = `
              h-9 w-9 sm:h-10 sm:w-10 rounded-full text-sm transition-all flex items-center justify-center
              ${disabled 
                ? isBlocked 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-400 dark:text-red-500 cursor-not-allowed'
                  : 'text-gray-300 dark:text-gray-400 cursor-not-allowed font-normal'
                : isSelected
                  ? 'bg-[#FF385C] text-white font-semibold hover:bg-[#E61E4D]'
                  : inRange
                    ? 'bg-[#FF385C]/20 text-gray-900 dark:text-gray-100 font-medium hover:bg-[#FF385C]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-normal'
              }
            `;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day, month)}
                disabled={disabled}
                className={buttonClasses}
                aria-label={`${day} ${monthNames[month.getMonth()]} ${month.getFullYear()}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
        {renderMonth(currentMonth1, true)}
        <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="hidden md:block flex-1">
          {renderMonth(currentMonth2, false)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700 dark:bg-gray-300"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-900/50"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Selected</span>
        </div>
      </div>
    </div>
  );
}
