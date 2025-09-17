import { useState } from 'react';

import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot, findBookingResourceId, deleteBookingResource } from '../api/resourceApi';

interface Resource {
  id: number;
  content: string;
}

const BookingPage = () => {
  const [selectedResource,  setSelectedResource] = useState<Resource | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; slotId: string; slotIndex: number } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMode, setBookingMode] = useState<'book' | 'cancel'>('book');

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
    if (!selectedSlot) return;
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
          } catch (err) {
            console.error('Kunde inte uppdatera slot i databasen:', err);
          }
        }
        alert('Bokning skapad!');
        setShowBookingForm(false);
        setCustomerName('');
        setCustomerEmail('');
        setSelectedSlot(null);
      } catch (err) {
        console.error('Fel vid bokning:', err);
        alert(`Fel vid bokning\nId: ${selectedSlot.slotId}\nNamn: ${customerName}\nEmail: ${customerEmail}`);
      }
    } else if (bookingMode === 'cancel') {
      // Avbokningslogik
      try {
        if (!selectedResource) return;
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
        } catch (err) {
          console.error('Kunde inte uppdatera slot i databasen:', err);
        }
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
            onSelectResource={setSelectedResource}
            selectedResource={selectedResource}
          />
        </div>
        <div className="md:w-2/3 w-full">
          {selectedResource ? (
            <>
              <AvailabilityList
                resourceContent={selectedResource.content}
                onSlotClick={(slotTime, slotId, slotIndex) => {
                  // Kolla om slotten är ledig eller upptagen
                  const contentObj = JSON.parse(selectedResource.content);
                  let mode: 'book' | 'cancel' = 'book';
                  for (const avail of contentObj.availabilities) {
                    if (String(avail.id) === String(slotId).slice(0, 1)) {
                      const slotIdx = Number(String(slotId).slice(1)) - 1;
                      if (avail.slots[slotIdx] === false) mode = 'cancel';
                    }
                  }
                  handleSlotClick(slotTime, slotId, slotIndex, mode);
                }}
              />
              {showBookingForm && selectedSlot && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <form onSubmit={handleBookingSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-black">
                      {bookingMode === 'book' ? `Boka tid: ${selectedSlot.time}` : `Avboka tid: ${selectedSlot.time}`}
                    </h3>
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
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        onClick={() => setShowBookingForm(false)}
                      >Avbryt</button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded font-bold ${bookingMode === 'book' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
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