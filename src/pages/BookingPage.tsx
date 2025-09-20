import React, { useState, useEffect } from 'react';

import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot, findBookingResourceId, deleteBookingResource, fetchAllResources, sendBookingEmail } from '../api/resourceApi';
import { getResourceContent } from '../utils/helpers';

interface Resource {
  id: number;
  content: string;
}


// --- Helper to parse slotId ---
function parseSlotId(slotId: string) {
  const [day, slotNum] = slotId.split('-').map(Number);
  return { day, slotNum };
}

// --- Helper to update slot in resource content ---
function updateSlotInResource(resource: Resource, day: number, slotNum: number, value: boolean) {
  const contentObj = JSON.parse(resource.content);
  const dayObj = contentObj.availabilities.find((a: any) => a.day === day);
  if (dayObj) dayObj[`slot${slotNum}`] = value;
  return JSON.stringify(contentObj);
}


const BookingPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; slotId: string; slotIndex: number } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMode, setBookingMode] = useState<'book' | 'cancel'>('book');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Fetch all resources once
  useEffect(() => {
    fetchAllResources().then(setResources);
  }, []);

  // Callback när en slot klickas i AvailabilityList
  // mode = 'book' eller 'cancel'
  const handleSlotClick = (slotTime: string, slotId: string, slotIndex: number, mode: 'book' | 'cancel' = 'book') => {
    setSelectedSlot({ time: slotTime, slotId, slotIndex });
    setBookingMode(mode);
    setShowBookingForm(true);
  };

  // Hantera bokningsformulär
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedResource) return;
    const { day, slotNum } = parseSlotId(selectedSlot.slotId);
    const slot = `slot${slotNum}`;
    if (bookingMode === 'book') {
      try {
        const bookingData = {
          resourceId: String(selectedResource.id),
          day,
          slot,
          name: customerName,
          email: customerEmail,
        };
        console.log('Skickar till backend:', bookingData);
        await createResourceBooking(bookingData);
        // Update slot to false (booked) in backend
        const newContent = updateSlotInResource(selectedResource, day, slotNum, false);
        try {
          await updateResourceSlot({ id: String(selectedResource.id), content: newContent });
        } catch (err) {
          console.error('Kunde inte uppdatera slot i databasen:', err);
        }
        // Always fetch latest resources and update selectedResource from new array
        const newResources = await fetchAllResources();
        setResources(newResources);
        const updated = newResources.find((r: Resource) => r.id === selectedResource.id);
        if (updated) setSelectedResource(updated);
        alert('Bokning skapad!');
        setShowBookingForm(false);
        setCustomerName('');
        setCustomerEmail('');
        setSelectedSlot(null);

        // Send booking confirmation email
        try {
          const resourceName = getResourceContent(selectedResource).name || 'Resurs';
          const subject = `Bokningsbekräftelse för ${resourceName}`;
          const body = `Hej ${customerName},\n\nDu har bokat ${resourceName} på dag ${parseSlotId(selectedSlot.slotId).day} kl ${selectedSlot.time}.\n\nTack för din bokning!`;

          await sendBookingEmail({
            to: customerEmail,
            subject,
            body,
          });
        } catch (err) {
          console.error('Kunde inte skicka verifieringsmail:', err);
        }
      } catch (err) {
        console.error('Fel vid bokning:', err);
        alert(`Fel vid bokning\nId: ${selectedSlot.slotId}\nNamn: ${customerName}\nEmail: ${customerEmail}`);
      }
    } else if (bookingMode === 'cancel') {
      try {
        // Hitta resource-id för bokningen
        const bookingId = await findBookingResourceId({
          resourceId: String(selectedResource.id),
          day,
          slot,
          name: customerName,
        });
        if (!bookingId) {
          alert('Fel: bokning hittades inte.');
          return;
        }
        // Ta bort bokningen från Lediga tider & uppdatera Bokningar
        await deleteBookingResource(bookingId);
        // Sätt slot till true (ledig) in backend
        const newContent = updateSlotInResource(selectedResource, day, slotNum, true);
        try {
          await updateResourceSlot({ id: String(selectedResource.id), content: newContent });
        } catch (err) {
          console.error('Kunde inte uppdatera slot i databasen:', err);
        }
        // Always fetch latest resources and update selectedResource from new array
        const newResources = await fetchAllResources();
        setResources(newResources);
        const updated = newResources.find((r: Resource) => r.id === selectedResource.id);
        if (updated) setSelectedResource(updated);
        alert('Bokning avbokad!');
        setShowBookingForm(false);
        setCustomerName('');
        setCustomerEmail('');
        setSelectedSlot(null);
      } catch (err) {
        console.error('Fel vid avbokning:', err);
        alert('Fel vid avbokning');
      }
    }
  };

  // Hämta bokningsnamn för vald slot (endast vid avbokning)
  let bookedName = '';
  if (bookingMode === 'cancel' && selectedSlot && selectedResource) {
    // Hitta bokningen för denna slot
    const { day, slotNum } = parseSlotId(selectedSlot.slotId);
    const slot = `slot${slotNum}`;
    // Sök i alla resources efter en bokning som matchar resourceId, day, slot
    const booking = resources
      .map(r => {
        try { return { ...JSON.parse(r.content), id: r.id }; } catch { return null; }
      })
      .find(
        b =>
          b &&
          b.resourceId === String(selectedResource.id) &&
          b.day === day &&
          b.slot === slot
      );
    if (booking && booking.name) bookedName = booking.name;
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Booking</h2>
      <div className="bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]">
        <div className="md:w-1/3 w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700">
            Boka nu
          </button>
          <ResourceList
            resources={resources}
            onSelectResource={setSelectedResource}
            selectedResource={selectedResource}
          />
        </div>
        <div className="md:w-2/3 w-full">
          {selectedResource && getResourceContent(selectedResource).availabilities.length > 0 ? (
            <>
              <AvailabilityList
                resourceContent={selectedResource.content}
                allResources={resources}
                onSlotClick={(slotTime, slotId, slotIndex) => {
                  // slotId format: 'day-slot' (e.g. '1-2')
                  const contentObj = JSON.parse(selectedResource.content);
                  let mode: 'book' | 'cancel' = 'book';
                  const [dayNum, slotNum] = slotId.split('-').map(Number);
                  const dayObj = contentObj.availabilities.find((a: any) => a.day === dayNum);
                  if (dayObj && dayObj[`slot${slotNum}`] === false) mode = 'cancel';
                  handleSlotClick(slotTime, slotId, slotIndex, mode);
                }}
              />
              {showBookingForm && selectedSlot && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <form onSubmit={handleBookingSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-black">
                      {bookingMode === 'book' ? `Boka tid: ${selectedSlot.time}` : `Avboka tid: ${selectedSlot.time}`}
                    </h3>
                    {bookingMode === 'book' ? (
                      <>
                        <div className="mb-4">
                          <label className="block mb-1 font-semibold text-black">Namn</label>
                          <input
                            type="text"
                            className="w-full border px-3 py-2 rounded"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1 font-semibold text-black">E-post</label>
                          <input
                            type="email"
                            className="w-full border px-3 py-2 rounded"
                            value={customerEmail}
                            onChange={e => setCustomerEmail(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          {bookedName && (
                            <label className="block mb-1 font-semibold text-black">Bekräfta avbokning som bokad av: {bookedName}</label>
                          )}
                          <input
                            type="text"
                            className="w-full border px-3 py-2 rounded"
                            value={deleteConfirm}
                            onChange={e => setDeleteConfirm(e.target.value)}
                            placeholder="Skriv 'delete' för att avboka"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        onClick={() => {
                          setShowBookingForm(false);
                          setDeleteConfirm('');
                        }}
                      >Avbryt</button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded font-bold ${bookingMode === 'book' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                        disabled={bookingMode === 'cancel' && deleteConfirm !== 'delete'}
                      >{bookingMode === 'book' ? 'Boka' : 'Avboka'}</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500 text-lg flex items-center justify-center h-full">
              Välj en resurs för att se lediga tider
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;