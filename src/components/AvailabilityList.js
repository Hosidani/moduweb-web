import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { safeParseJSON } from '../utils/helpers';
const AvailabilityList = ({ resourceContent, onSlotClick, showBookingDetails }) => {
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
    const handleBookSlot = (slotStart, slotEnd, slotId, slotIndex) => {
        if (onSlotClick) {
            onSlotClick(slotStart, slotId, slotIndex);
        }
        else {
            alert(`Du har valt: ${slotStart} - ${slotEnd}`);
        }
    };
    return (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-4 bg-blue-100 text-blue-700 px-3 py-2 rounded inline-block", children: "Lediga tider" }), content.availabilities.map((a, dayIndex) => (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "font-bold mb-2 bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block", children: ["Dag ", dayIndex + 1] }), _jsx("ul", { className: "flex flex-wrap gap-2", children: Object.entries(a).filter(([key]) => key.startsWith('slot')).map(([slotKey, available]) => {
                            const slotId = `${dayIndex + 1}-${slotKey.replace('slot', '')}`;
                            let booking = null;
                            if (content.bookings && Array.isArray(content.bookings)) {
                                booking = content.bookings.find((b) => String(b.slotId) === slotId);
                            }
                            // Slot är bokningsbar ENDAST om värdet är true
                            const isActuallyAvailable = available === true;
                            let bookingInfo = null;
                            if (!isActuallyAvailable && booking) {
                                bookingInfo = booking.name && booking.email
                                    ? _jsxs("span", { className: "block text-xs text-blue-900 font-semibold", children: ["Bokad av: ", booking.name, " (", booking.email, ")"] })
                                    : _jsx("span", { className: "block text-xs text-red-900 font-semibold", children: "Upptagen av admin" });
                            }
                            // slot1 = 0, slot2 = 1, ...
                            const slotIndex = parseInt(slotKey.replace('slot', '')) - 1;
                            const slotStart = formatSlotTime(DEFAULT_START_TIME, slotIndex, DEFAULT_SLOT_LENGTH);
                            const slotEnd = formatSlotTime(DEFAULT_START_TIME, slotIndex + 1, DEFAULT_SLOT_LENGTH);
                            return (_jsxs("li", { className: isActuallyAvailable
                                    ? 'bg-green-100 text-green-800 px-3 py-1 rounded font-medium shadow-sm cursor-pointer hover:bg-green-300 transition'
                                    : 'bg-gray-200 text-gray-400 px-3 py-1 rounded line-through shadow-sm flex items-center justify-between', style: { minWidth: 110, textAlign: 'center', cursor: isActuallyAvailable ? 'pointer' : 'default', position: 'relative' }, onClick: isActuallyAvailable ? () => handleBookSlot(slotStart, slotEnd, slotId, slotIndex + 1) : undefined, children: [_jsxs("span", { children: [slotStart, " - ", slotEnd] }), !isActuallyAvailable && (_jsxs(_Fragment, { children: [bookingInfo && (typeof showBookingDetails !== 'undefined' && showBookingDetails) && bookingInfo, _jsx("button", { type: "button", className: "ml-2 px-2 py-0.5 text-xs rounded bg-red-500 text-white hover:bg-red-700 transition", onClick: e => {
                                                    e.stopPropagation();
                                                    if (onSlotClick)
                                                        onSlotClick(slotStart, slotId, slotIndex + 1);
                                                }, children: "Avboka" })] }))] }, slotKey));
                        }) })] }, a.id ?? dayIndex)))] }));
};
export default AvailabilityList;
