import React from 'react';
import { safeParseJSON, getBookingsForParentResource } from '../utils/helpers';


interface Resource {
  id: number;
  content: string;
}

interface AvailabilityListProps {
  resourceContent: string;
  allResources: Resource[];
  onSlotClick?: (slotTime: string, slotId: string, slotIndex: number) => void;
  showBookingDetails?: boolean;
}


const AvailabilityList: React.FC<AvailabilityListProps> = ({ resourceContent, allResources, onSlotClick, showBookingDetails }) => {
  const content = safeParseJSON(resourceContent);

  if (!content || !content.availabilities) return <div>Inga tider hittades.</div>;

  // Hardcoded/default values
  const DEFAULT_START_TIME = "09:00";
  const DEFAULT_SLOT_LENGTH = 30;

  function formatSlotTime(start: string, index: number, length: number) {
    const [h, m] = start.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m + index * length);
    return date.toTimeString().slice(0, 5);
  }

  const handleBookSlot = (slotStart: string, slotEnd: string, slotId: string, slotIndex: number) => {
    if (onSlotClick) {
      onSlotClick(slotStart, slotId, slotIndex);
    } else {
      alert(`Du har valt: ${slotStart} - ${slotEnd}`);
    }
  };

  // Collapsible state for each day
  const [openDays, setOpenDays] = React.useState<{ [key: number]: boolean }>({});

  const toggleDay = (dayIndex: number) => {
    setOpenDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
  };



  // Get bookings for this parent resource
  // Try to use id from parsed content, fallback to prop if needed
  let parentResourceId = '';
  if (content && content.id) parentResourceId = String(content.id);
  // If not present, try to extract from allResources by matching content
  if (!parentResourceId && allResources && Array.isArray(allResources)) {
    const found = allResources.find(r => r.content === resourceContent);
    if (found) parentResourceId = String(found.id);
  }
  // Map allResources to have id as string for the helper
  const allResourcesStringId = allResources.map(r => ({ ...r, id: String(r.id) }));
  const bookings = getBookingsForParentResource(allResourcesStringId, parentResourceId);

  function groupBookingsByDay(bookings: any[]) {
    const grouped: { [day: number]: any[] } = {};
    bookings.forEach(b => {
      const day = b.day;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(b);
    });
    return grouped;
  }

  const bookingsByDay = groupBookingsByDay(bookings);
  const days = content.availabilities.map((_: any, i: number) => i + 1);

  return (
    <div className="flex gap-8">
      {/* Lediga tider column */}
      <div className="w-1/2">
        <h3 className="text-lg font-bold mb-4 bg-blue-100 text-blue-700 px-3 py-2 rounded inline-block">Lediga tider</h3>
        {content.availabilities.map((a: any, dayIndex: number) => (
          <div key={a.id ?? dayIndex} className="mb-4">
            <div className="font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block select-none" style={{ userSelect: 'none' }}>
              Dag {dayIndex + 1}
            </div>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(a).filter(([key]) => key.startsWith('slot')).map(([slotKey, available]) => {
                const slotId = `${dayIndex + 1}-${slotKey.replace('slot', '')}`;
                let booking = null;
                if (content.bookings && Array.isArray(content.bookings)) {
                  booking = content.bookings.find((b: any) => String(b.slotId) === slotId);
                }
                const isActuallyAvailable = available === true;
                let bookingInfo = null;
                if (!isActuallyAvailable && booking) {
                  bookingInfo = booking.name && booking.email
                    ? <span className="block text-xs text-blue-900 font-semibold">Bokad av: {booking.name} ({booking.email})</span>
                    : <span className="block text-xs text-red-900 font-semibold">Upptagen av admin</span>;
                }
                const slotIndex = parseInt(slotKey.replace('slot', '')) - 1;
                const slotStart = formatSlotTime(DEFAULT_START_TIME, slotIndex, DEFAULT_SLOT_LENGTH);
                const slotEnd = formatSlotTime(DEFAULT_START_TIME, slotIndex + 1, DEFAULT_SLOT_LENGTH);
                return (
                  <li
                    key={slotKey}
                    className={
                      isActuallyAvailable
                        ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm cursor-pointer hover:bg-green-300 transition'
                        : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm flex items-center justify-between'
                    }
                    style={{ minWidth: 110, textAlign: 'center', cursor: isActuallyAvailable ? 'pointer' : 'default', position: 'relative' }}
                    onClick={isActuallyAvailable ? () => handleBookSlot(slotStart, slotEnd, slotId, slotIndex + 1) : undefined}
                  >
                    <span>{slotStart} - {slotEnd}</span>
                    {!isActuallyAvailable && (
                      <>
                        {bookingInfo && (typeof showBookingDetails !== 'undefined' && showBookingDetails) && bookingInfo}
                        <button
                          type="button"
                          className="ml-2 px-2 py-0.5 text-xs rounded bg-red-500 text-white hover:bg-red-700 transition"
                          onClick={e => {
                            e.stopPropagation();
                            if (onSlotClick) onSlotClick(slotStart, slotId, slotIndex + 1);
                          }}
                        >Avboka</button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {/* Bokningar column */}
      <div className="w-1/2">
        <h3 className="text-lg font-bold mb-4 bg-green-100 text-green-700 px-3 py-2 rounded inline-block">Bokningar</h3>
        {days.map((dayNum: number) => (
          <div key={dayNum} className="mb-4">
            <div
              className="font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block cursor-pointer select-none"
              onClick={() => toggleDay(dayNum)}
              style={{ userSelect: 'none' }}
            >
              Dag {dayNum} {openDays[dayNum] ? '▼' : '▶'}
            </div>
            {openDays[dayNum] && (
              <ul className="flex flex-col gap-2">
                {(bookingsByDay[dayNum]?.length === 0 || !bookingsByDay[dayNum]) && (
                  <li className="text-gray-400">Inga bokningar</li>
                )}
                {bookingsByDay[dayNum]?.map((b: any) => {
                  // Try to parse slot time from slot string (e.g. slot2)
                  let slotNum = 0;
                  if (b.slot && typeof b.slot === 'string') {
                    const match = b.slot.match(/slot(\d+)/);
                    if (match) slotNum = Number(match[1]);
                  }
                  const slotStart = formatSlotTime(DEFAULT_START_TIME, slotNum - 1, DEFAULT_SLOT_LENGTH);
                  const slotEnd = formatSlotTime(DEFAULT_START_TIME, slotNum, DEFAULT_SLOT_LENGTH);
                  return (
                    <li key={b.slotId || b.id} className="bg-green-50 text-green-900 px-3 py-1 rounded font-medium shadow-sm" style={{ minWidth: 180, textAlign: 'left' }}>
                      <span>Tid: {slotStart} - {slotEnd}</span><br />
                      <span className="block text-xs">Namn: {b.name} | Email: {b.email}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityList;