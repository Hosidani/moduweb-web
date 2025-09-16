import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { safeParseJSON } from '../utils/helpers';
const AvailabilityList = ({ resourceContent }) => {
    const content = safeParseJSON(resourceContent);
    if (!content || !content.availabilities)
        return _jsx("div", { children: "Inga tider hittades." });
    // Hardcoded/default values
    const DEFAULT_START_TIME = "09:00";
    const DEFAULT_SLOT_LENGTH = 30;
    function formatSlotTime(start, index, length) {
        const [h, m] = start.split(':').map(Number);
        const date = new Date(0, 0, 0, h, m + index * length);
        return date.toTimeString().slice(0, 5);
    }
    const handleBookSlot = (slotStart, slotEnd) => {
        alert(`Du har valt: ${slotStart} - ${slotEnd}`);
        // Here you can open a booking form or send a booking request
    };
    return (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-4 bg-green-200 text-green-900 px-3 py-2 rounded inline-block", children: "Lediga tider" }), content.availabilities.map((a, dayIndex) => (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block", children: ["Dag ", dayIndex + 1] }), _jsx("ul", { className: "flex flex-wrap gap-2", children: a.slots.map((available, i) => {
                            const slotStart = formatSlotTime(DEFAULT_START_TIME, i, DEFAULT_SLOT_LENGTH);
                            const slotEnd = formatSlotTime(DEFAULT_START_TIME, i + 1, DEFAULT_SLOT_LENGTH);
                            return (_jsxs("li", { className: available
                                    ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm cursor-pointer hover:bg-green-300 transition'
                                    : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm', style: { minWidth: 110, textAlign: 'center', cursor: available ? 'pointer' : 'default' }, onClick: available ? () => handleBookSlot(slotStart, slotEnd) : undefined, children: [slotStart, " - ", slotEnd] }, i));
                        }) })] }, a.id)))] }));
};
export default AvailabilityList;
