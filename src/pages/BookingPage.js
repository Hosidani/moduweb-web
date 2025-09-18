import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot, findBookingResourceId, deleteBookingResource } from '../api/resourceApi';
import { getResourceContent, getBookingName } from '../utils/helpers';
const BookingPage = () => {
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [bookingPersonName, setBookingPersonName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingMode, setBookingMode] = useState('book');
    // Callback när en slot klickas i AvailabilityList
    // mode = 'book' eller 'cancel'
    const handleSlotClick = async (slotTime, slotId, slotIndex, mode = 'book') => {
        setSelectedSlot({ time: slotTime, slotId, slotIndex });
        setBookingMode(mode);
        if (mode === 'cancel' && selectedResource) {
            // Hämta namn från boknings-resource
            const [dayNumStr, slotNumStr] = slotId.split('-');
            const dayNum = Number(dayNumStr);
            const slotKey = `slot${slotNumStr}`;
            // Hitta boknings-resource
            const bookingId = await findBookingResourceId({
                resourceId: String(selectedResource.id),
                day: dayNum,
                slot: slotKey,
                name: '' // tomt, vi vill hitta oavsett namn
            });
            let name = '';
            if (bookingId) {
                // Hämta boknings-resource och plocka ut namn
                try {
                    const res = await fetch(`https://localhost:5083/api/resources/${bookingId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const content = JSON.parse(data.content);
                        name = content.name || '';
                    }
                }
                catch { }
            }
            setBookingPersonName(name);
        }
        else {
            setBookingPersonName('');
        }
        setShowBookingForm(true);
    };
    // Hantera bokningsformulär
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot)
            return;
        if (bookingMode === 'book') {
            try {
                // slotId format: 'day-slotNum' (e.g. '2-1')
                const [day, slotNum] = selectedSlot.slotId.split('-');
                const slot = `slot${slotNum}`;
                if (!selectedResource)
                    throw new Error('Ingen resurs vald');
                const bookingData = {
                    resourceId: String(selectedResource.id),
                    day: Number(day),
                    slot,
                    name: customerName,
                    email: customerEmail,
                };
                console.log('Skickar till backend:', bookingData);
                await createResourceBooking(bookingData);
                // Optimistisk uppdatering av slotten i frontend och PUT till backend:
                if (selectedResource) {
                    const contentObj = JSON.parse(selectedResource.content);
                    // slotId format: 'day-slot' (e.g. '1-2')
                    const [dayNum, slotNum] = selectedSlot.slotId.split('-').map(Number);
                    const dayObj = contentObj.availabilities.find((a) => a.day === dayNum);
                    if (dayObj) {
                        dayObj[`slot${slotNum}`] = false;
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
            // Avbokningslogik utan krav på namn/email
            try {
                if (!selectedResource || !selectedSlot)
                    return;
                // Hämta info om bokningen (namn etc) från resource-content
                const contentObj = JSON.parse(selectedResource.content);
                const [dayNum, slotNum] = selectedSlot.slotId.split('-').map(Number);
                const dayObj = contentObj.availabilities.find((a) => a.day === dayNum);
                const slotKey = `slot${slotNum}`;
                // Hämta bokningsnamn för slotten
                const bookingName = getBookingName(contentObj, dayNum, slotKey);
                // Kontrollera att admin skrivit 'delete'
                if (deleteConfirm !== 'delete') {
                    alert('Skriv "delete" i rutan för att bekräfta avbokning.');
                    return;
                }
                // Hitta boknings-resource-id och ta bort bokningen
                const bookingId = await findBookingResourceId({
                    resourceId: String(selectedResource.id),
                    day: dayNum,
                    slot: slotKey,
                    name: bookingName || '',
                });
                if (!bookingId) {
                    alert('Kunde inte hitta bokningen att ta bort!');
                    return;
                }
                await deleteBookingResource(bookingId);
                // Sätt slot till true i resource-content och PUT
                if (dayObj) {
                    dayObj[slotKey] = true;
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
                setDeleteConfirm('');
                setSelectedSlot(null);
            }
            catch (err) {
                console.error('Fel vid avbokning:', err);
                alert('Fel vid avbokning');
            }
        }
    };
    return (_jsxs("div", { className: "p-6 bg-gray-800 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-100", children: "Booking" }), _jsxs("div", { className: "bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]", children: [_jsxs("div", { className: "md:w-1/3 w-full", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-800", children: "Booking" }), _jsx("button", { className: "bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700", children: "Boka nu" }), _jsx(ResourceList, { onSelectResource: setSelectedResource, selectedResource: selectedResource })] }), _jsx("div", { className: "md:w-2/3 w-full", children: selectedResource && getResourceContent(selectedResource).availabilities.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(AvailabilityList, { resourceContent: selectedResource.content, onSlotClick: (slotTime, slotId, slotIndex) => {
                                        // slotId format: 'day-slot' (e.g. '1-2')
                                        const contentObj = JSON.parse(selectedResource.content);
                                        let mode = 'book';
                                        const [dayNum, slotNum] = slotId.split('-').map(Number);
                                        const dayObj = contentObj.availabilities.find((a) => a.day === dayNum);
                                        if (dayObj && dayObj[`slot${slotNum}`] === false)
                                            mode = 'cancel';
                                        handleSlotClick(slotTime, slotId, slotIndex, mode);
                                    } }), showBookingForm && selectedSlot && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("form", { onSubmit: handleBookingSubmit, className: "bg-white p-8 rounded shadow-md w-full max-w-md", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-black", children: bookingMode === 'book'
                                                    ? `Boka tid: ${selectedSlot.time}`
                                                    : `Avboka - tid ${selectedSlot.time} för ${bookingPersonName}` }), bookingMode === 'book' ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "Namn" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded", value: customerName, onChange: e => setCustomerName(e.target.value), required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "E-post" }), _jsx("input", { type: "email", className: "w-full border px-3 py-2 rounded", value: customerEmail, onChange: e => setCustomerEmail(e.target.value), required: true })] })] })) : (_jsx(_Fragment, { children: _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-semibold text-black", children: "Bekr\u00E4fta avbokning" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded", value: deleteConfirm, onChange: e => setDeleteConfirm(e.target.value), placeholder: "Skriv 'delete' f\u00F6r att avboka" })] }) })), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", className: "px-4 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: () => setShowBookingForm(false), children: "Avbryt" }), _jsx("button", { type: "submit", className: `px-4 py-2 rounded font-bold ${bookingMode === 'book' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`, disabled: bookingMode === 'cancel' && deleteConfirm !== 'delete', children: bookingMode === 'book' ? 'Boka' : 'Avboka' })] })] }) }))] })) : (_jsx("div", { className: "text-gray-500 text-lg flex items-center justify-center h-full", children: "V\u00E4lj en resurs f\u00F6r att se lediga tider" })) })] })] }));
};
export default BookingPage;
