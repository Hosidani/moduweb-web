import { safeParseJSON } from '../utils/helpers';

interface AvailabilityListProps {
  resourceContent: string; // the JSON string from resource.content
  onSlotClick?: (slotTime: string, slotId: string, slotIndex: number) => void;
}

const AvailabilityList: React.FC<AvailabilityListProps> = ({ resourceContent, onSlotClick }) => {
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

  return (
    <div>
  <h3 className="text-lg font-bold mb-4 bg-blue-100 text-blue-700 px-3 py-2 rounded inline-block">Lediga tider</h3>
      {content.availabilities.map((a: any, dayIndex: number) => (
        <div key={a.id} className="mb-4">
          <div className="font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">Dag {dayIndex + 1}</div>
          <ul className="flex flex-wrap gap-2">
            {a.slots.map((available: boolean, i: number) => {
              const slotStart = formatSlotTime(DEFAULT_START_TIME, i, DEFAULT_SLOT_LENGTH);
              const slotEnd = formatSlotTime(DEFAULT_START_TIME, i + 1, DEFAULT_SLOT_LENGTH);
              // Skapa slotId enligt önskemål: dagId + index+1 (t.ex. 11, 12, ... 110)
              const slotId = `${a.id}${i+1}`;
              return (
                <li
                  key={i}
                  className={
                    available
                      ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm cursor-pointer hover:bg-green-300 transition'
                      : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm flex items-center justify-between'
                  }
                  style={{ minWidth: 110, textAlign: 'center', cursor: available ? 'pointer' : 'default', position: 'relative' }}
                  onClick={available ? () => handleBookSlot(slotStart, slotEnd, slotId, i+1) : undefined}
                >
                  <span>{slotStart} - {slotEnd}</span>
                  {!available && (
                    <button
                      type="button"
                      className="ml-2 px-2 py-0.5 text-xs rounded bg-red-500 text-white hover:bg-red-700 transition"
                      onClick={e => {
                        e.stopPropagation();
                        if (onSlotClick) onSlotClick(slotStart, slotId, i+1); // Återanvänd callback för avbokning
                      }}
                    >Avboka</button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityList;