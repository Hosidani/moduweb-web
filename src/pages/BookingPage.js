import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot } from '../api/resourceApi';
const BookingPage = () => {
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);
    // Callback när en slot klickas i AvailabilityList
    const handleSlotClick = (slotTime, slotId, slotIndex) => {
        setSelectedSlot({ time: slotTime, slotId, slotIndex });
        setShowBookingForm(true);
    };
    // Hantera bokningsformulär
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot)
            return;
        try {
            const bookingData = {
                id: Number(selectedSlot.slotId),
                name: customerName,
                email: customerEmail,
            };
            console.log('Skickar till backend:', bookingData);
            await createResourceBooking({
                id: bookingData.id,
                name: bookingData.name,
                email: bookingData.email,
            });
            // Optimistisk uppdatering av slotten i frontend och PUT till backend:
            if (selectedResource) {
                // Klona och parsa content
                const contentObj = JSON.parse(selectedResource.content);
                // Hitta rätt dag och slot
                for (const avail of contentObj.availabilities) {
                    if (String(avail.id) === String(selectedSlot.slotId).slice(0, 1)) {
                        const slotIdx = Number(String(selectedSlot.slotId).slice(1)) - 1;
                        avail.slots[slotIdx] = false;
                    }
                }
                const newContent = JSON.stringify(contentObj);
                setSelectedResource({ ...selectedResource, content: newContent });
                // Uppdatera i databasen
                try {
                    await updateResourceSlot({ id: String(selectedResource.id), content: newContent });
                }
                catch (err) {
                    console.error('Kunde inte uppdatera slot i databasen:', err);
                }
            }
            alert('Bokning skapad!');
            setShowBookingForm(false);
            setCustomerName('');
            setCustomerEmail('');
            setSelectedSlot(null);
        }
        catch (err) {
            console.error('Fel vid bokning:', err);
            alert(`Fel vid bokning\nId: ${selectedSlot.slotId}\nNamn: ${customerName}\nEmail: ${customerEmail}`);
        }
    };
    return (_jsxs("div", { className: "p-6 bg-gray-800 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-100", children: "Booking" }), _jsxs("div", { className: "bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]", children: [_jsxs("div", { className: "md:w-1/3 w-full", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-800", children: "Booking" }), _jsx("button", { className: "bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700", children: "Boka nu" }), _jsx(ResourceList, { onSelectResource: setSelectedResource, selectedResource: selectedResource })] }), _jsx("div", { className: "md:w-2/3 w-full", children: selectedResource ? (_jsxs(_Fragment, { children: [_jsx(AvailabilityList, { resourceContent: selectedResource.content, onSlotClick: handleSlotClick }), showBookingForm && selectedSlot && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("form", { onSubmit: handleBookingSubmit, className: "bg-white p-8 rounded shadow-md w-full max-w-md", children: [_jsxs("h3", { className: "text-xl font-bold mb-4 text-black", children: ["Boka tid: ", selectedSlot.time] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "Namn" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded", value: customerName, onChange: e => setCustomerName(e.target.value), required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "E-post" }), _jsx("input", { type: "email", className: "w-full border px-3 py-2 rounded", value: customerEmail, onChange: e => setCustomerEmail(e.target.value), required: true })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", className: "px-4 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: () => setShowBookingForm(false), children: "Avbryt" }), _jsx("button", { type: "submit", className: "px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700", children: "Boka" })] })] }) }))] })) : (_jsx("div", { className: "text-gray-500 text-lg flex items-center justify-center h-full", children: "V\u00E4lj en resurs f\u00F6r att se lediga tider" })) })] })] }));
};
export default BookingPage;
