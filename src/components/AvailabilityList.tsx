import { safeParseJSON, formatSlotTime } from '../utils/helpers';

interface AvailabilityListProps {
  resourceContent: string; // the JSON string from resource.content
}

const AvailabilityList: React.FC<AvailabilityListProps> = ({ resourceContent }) => {
  const content = safeParseJSON(resourceContent);
  if (!content || !content.availabilities) return <div>Inga tider hittades.</div>;

  return (
    <div>
  <h3 className="text-lg font-bold mb-4 bg-green-200 text-green-900 px-3 py-2 rounded inline-block">Lediga tider</h3>
      {content.availabilities.map((a: any) => (
        <div key={a.id} className="mb-4">
          <div className="font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">{a.dayOfWeek}</div>
          <ul className="flex flex-wrap gap-2">
            {a.slots.map((available: boolean, i: number) => {
              const slotStart = formatSlotTime(a.startTime, i, a.slotLengthMinutes);
              const slotEnd = formatSlotTime(a.startTime, i + 1, a.slotLengthMinutes);
              return (
                <li
                  key={i}
                  className={
                    available
                      ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm'
                      : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm'
                  }
                  style={{ minWidth: 90, textAlign: 'center' }}
                >
                  {slotStart} - {slotEnd}
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