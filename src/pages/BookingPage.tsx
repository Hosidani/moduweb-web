import { useState } from 'react';

import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
import { createResourceBooking, updateResourceSlot } from '../api/resourceApi';

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

  // Callback när en slot klickas i AvailabilityList
  const handleSlotClick = (slotTime: string, slotId: string, slotIndex: number) => {
    setSelectedSlot({ time: slotTime, slotId, slotIndex });
    setShowBookingForm(true);
  };

  // Hantera bokningsformulär
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
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
              <AvailabilityList resourceContent={selectedResource.content} onSlotClick={handleSlotClick} />
              {showBookingForm && selectedSlot && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <form onSubmit={handleBookingSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-black">Boka tid: {selectedSlot.time}</h3>
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
                        className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
                      >Boka</button>
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