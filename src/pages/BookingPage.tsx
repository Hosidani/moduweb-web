import { useState } from 'react';

import ResourceList from '../components/ResourceList';

const BookingPage = () => {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Booking</h2>
      <div className="bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]">
        <div className="md:w-1/3 w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700">
            Boka nu
          </button>
          <ResourceList onSelectResource={setSelectedResourceId} selectedResourceId={selectedResourceId} />
        </div>
        <div className="md:w-2/3 w-full">
          <div className="text-gray-500 text-lg flex items-center justify-center h-full">Välj en resurs för att se lediga tider</div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;