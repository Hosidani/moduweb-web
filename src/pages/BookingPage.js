import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot, findBookingResourceId, deleteBookingResource } from '../api/resourceApi';
const BookingPage = () => {
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingMode, setBookingMode] = useState('book');
    // Callback när en slot klickas i AvailabilityList
    // mode = 'book' eller 'cancel'
    const handleSlotClick = (slotTime, slotId, slotIndex, mode = 'book') => {
        setSelectedSlot({ time: slotTime, slotId, slotIndex });
        setBookingMode(mode);
        setShowBookingForm(true);
    };
    // Hantera bokningsformulär
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot)
            return;
        if (bookingMode === 'book') {
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
                    const contentObj = JSON.parse(selectedResource.content);
                    for (const avail of contentObj.availabilities) {
                        if (String(avail.id) === String(selectedSlot.slotId).slice(0, 1)) {
                            const slotIdx = Number(String(selectedSlot.slotId).slice(1)) - 1;
                            avail.slots[slotIdx] = false;
                        }
                    }
                    const newContent = JSON.stringify(contentObj);
                    setSelectedResource({ ...selectedResource, content: newContent });
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
        }
        else if (bookingMode === 'cancel') {
            // Avbokningslogik
            try {
                if (!selectedResource)
                    return;
                // 1. Hitta resource-id för bokningen
                const bookingId = await findBookingResourceId({
                    slotId: Number(selectedSlot.slotId),
                    name: customerName,
                    email: customerEmail,
                });
                if (!bookingId) {
                    alert('Fel: Namn eller e-post matchar inte bokningen.');
                    return;
                }
                // 2. Ta bort bokningen
                await deleteBookingResource(bookingId);
                // 3. Sätt slot till true i resource-content och PUT
                const contentObj = JSON.parse(selectedResource.content);
                for (const avail of contentObj.availabilities) {
                    if (String(avail.id) === String(selectedSlot.slotId).slice(0, 1)) {
                        const slotIdx = Number(String(selectedSlot.slotId).slice(1)) - 1;
                        avail.slots[slotIdx] = true;
                    }
                }
                const newContent = JSON.stringify(contentObj);
                setSelectedResource({ ...selectedResource, content: newContent });
                try {
                    await updateResourceSlot({ id: String(selectedResource.id), content: newContent });
                }
                catch (err) {
                    console.error('Kunde inte uppdatera slot i databasen:', err);
                }
                alert('Bokning avbokad!');
                setShowBookingForm(false);
                setCustomerName('');
                setCustomerEmail('');
                setSelectedSlot(null);
            }
            catch (err) {
                console.error('Fel vid avbokning:', err);
                alert('Fel vid avbokning');
            }
        }
    };
    return (_jsxs("div", { className: "p-6 bg-gray-800 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-100", children: "Booking" }), _jsxs("div", { className: "bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]", children: [_jsxs("div", { className: "md:w-1/3 w-full", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-800", children: "Booking" }), _jsx("button", { className: "bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700", children: "Boka nu" }), _jsx(ResourceList, { onSelectResource: setSelectedResource, selectedResource: selectedResource })] }), _jsx("div", { className: "md:w-2/3 w-full", children: selectedResource ? (_jsxs(_Fragment, { children: [_jsx(AvailabilityList, { resourceContent: selectedResource.content, onSlotClick: (slotTime, slotId, slotIndex) => {
                                        // Kolla om slotten är ledig eller upptagen
                                        const contentObj = JSON.parse(selectedResource.content);
                                        let mode = 'book';
                                        for (const avail of contentObj.availabilities) {
                                            if (String(avail.id) === String(slotId).slice(0, 1)) {
                                                const slotIdx = Number(String(slotId).slice(1)) - 1;
                                                if (avail.slots[slotIdx] === false)
                                                    mode = 'cancel';
                                            }
                                        }
                                        handleSlotClick(slotTime, slotId, slotIndex, mode);
                                    } }), showBookingForm && selectedSlot && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("form", { onSubmit: handleBookingSubmit, className: "bg-white p-8 rounded shadow-md w-full max-w-md", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-black", children: bookingMode === 'book' ? `Boka tid: ${selectedSlot.time}` : `Avboka tid: ${selectedSlot.time}` }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "Namn" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded", value: customerName, onChange: e => setCustomerName(e.target.value), required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "E-post" }), _jsx("input", { type: "email", className: "w-full border px-3 py-2 rounded", value: customerEmail, onChange: e => setCustomerEmail(e.target.value), required: true })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", className: "px-4 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: () => setShowBookingForm(false), children: "Avbryt" }), _jsx("button", { type: "submit", className: `px-4 py-2 rounded font-bold ${bookingMode === 'book' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`, children: bookingMode === 'book' ? 'Boka' : 'Avboka' })] })] }) }))] })) : (_jsx("div", { className: "text-gray-500 text-lg flex items-center justify-center h-full", children: "V\u00E4lj en resurs f\u00F6r att se lediga tider" })) })] })] }));
};
export default BookingPage;
