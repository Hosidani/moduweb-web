import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ResourceList from '../components/ResourceList';
import AvailabilityList from '../components/AvailabilityList';
const BookingPage = () => {
    const [selectedResource, setSelectedResource] = useState(null);
    return (_jsxs("div", { className: "p-6 bg-gray-800 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-100", children: "Booking" }), _jsxs("div", { className: "bg-white rounded shadow p-8 flex flex-col md:flex-row gap-8 min-h-[500px]", children: [_jsxs("div", { className: "md:w-1/3 w-full", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-800", children: "Booking" }), _jsx("button", { className: "bg-blue-600 text-white px-6 py-3 rounded mb-8 font-bold hover:bg-blue-700", children: "Boka nu" }), _jsx(ResourceList, { onSelectResource: setSelectedResource, selectedResource: selectedResource })] }), _jsx("div", { className: "md:w-2/3 w-full", children: selectedResource ? (_jsx(AvailabilityList, { resourceContent: selectedResource.content })) : (_jsx("div", { className: "text-gray-500 text-lg flex items-center justify-center h-full", children: "V\u00E4lj en resurs f\u00F6r att se lediga tider" })) })] })] }));
};
export default BookingPage;
