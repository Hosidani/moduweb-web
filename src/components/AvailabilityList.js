import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { safeParseJSON, formatSlotTime } from '../utils/helpers';
const AvailabilityList = ({ resourceContent }) => {
    const content = safeParseJSON(resourceContent);
    if (!content || !content.availabilities)
        return _jsx("div", { children: "Inga tider hittades." });
    const handleBookSlot = (day, slotStart, slotEnd) => {
        alert(`Du har valt: ${day} ${slotStart} - ${slotEnd}`);
        // Here you can open a booking form or send a booking request
    };
    return (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-4 bg-green-200 text-green-900 px-3 py-2 rounded inline-block", children: "Lediga tider" }), content.availabilities.map((a) => (_jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block", children: a.dayOfWeek }), _jsx("ul", { className: "flex flex-wrap gap-2", children: a.slots.map((available, i) => {
                            const slotStart = formatSlotTime(a.startTime, i, a.slotLengthMinutes);
                            const slotEnd = formatSlotTime(a.startTime, i + 1, a.slotLengthMinutes);
                            return (_jsxs("li", { className: available
                                    ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm cursor-pointer hover:bg-green-300 transition'
                                    : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm', style: { minWidth: 110, textAlign: 'center', cursor: available ? 'pointer' : 'default' }, onClick: available ? () => handleBookSlot(a.dayOfWeek, slotStart, slotEnd) : undefined, children: [slotStart, " - ", slotEnd] }, i));
                        }) })] }, a.id)))] }));
};
export default AvailabilityList;
