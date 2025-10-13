import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const BookingManagerPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [resourceName, setResourceName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [errorBookings, setErrorBookings] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    async function handleDeleteBooking(id) {
        if (!window.confirm('Are you sure you want to delete this booking resource?'))
            return;
        setDeletingId(id);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok)
                throw new Error('Failed to delete booking');
            await fetchBookings();
        }
        catch (err) {
            alert('Failed to delete booking');
        }
        finally {
            setDeletingId(null);
        }
    }
    async function fetchBookings() {
        setLoadingBookings(true);
        setErrorBookings(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates`);
            if (!res.ok)
                throw new Error('Failed to fetch bookings');
            const data = await res.json();
            setBookings(data);
        }
        catch (err) {
            setErrorBookings('Failed to load bookings');
        }
        finally {
            setLoadingBookings(false);
        }
    }
    useEffect(() => {
        fetchBookings();
    }, []);
    function handleOpenForm() {
        setShowForm(true);
    }
    function handleCloseForm() {
        setShowForm(false);
        setResourceName('');
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            content: JSON.stringify({
                bookingResourceName: resourceName,
                offsetForResource: {
                    startOffset: -100,
                    endOffset: 364,
                },
            })
        };
        try {
            //const apiBase = import.meta.env.VITE_API_BASE_URL || '';
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const backendText = await res.text();
                console.error('[Backend error]', res.status, backendText);
                throw new Error('Backend error: ' + backendText);
            }
            // Optionally handle response data: const data = await res.json();
            setShowForm(false);
            setResourceName('');
            await fetchBookings();
            // Optionally show a success message
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('[Frontend error]', err.message, err);
                alert('Failed to create resource: ' + err.message);
            }
            else {
                console.error('[Frontend error] Unknown error', err);
                alert('Failed to create resource: Unknown error');
            }
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsxs("div", { className: "p-6 space-y-4 bg-gray-100 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-black", children: "Booking Manager" }), _jsx("button", { className: "bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700", onClick: handleOpenForm, children: "Add booking resource" }), showForm && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("div", { className: "bg-white rounded shadow-lg p-6 w-full max-w-sm", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Add Booking Resource" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", className: "border px-3 py-2 rounded w-full", placeholder: "Resource name", value: resourceName, onChange: e => setResourceName(e.target.value), required: true, disabled: submitting }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", className: "px-3 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: handleCloseForm, disabled: submitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "px-3 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700", disabled: submitting || !resourceName.trim(), children: submitting ? 'Adding...' : 'Add' })] })] })] }) })), _jsxs("div", { className: "bg-white rounded shadow p-6 mt-4 border border-gray-200", children: [_jsx("h3", { className: "font-bold mb-4 text-black text-lg", children: "All Booking Resources" }), loadingBookings ? (_jsx("div", { className: "text-gray-500", children: "Loading..." })) : errorBookings ? (_jsx("div", { className: "text-red-600", children: errorBookings })) : bookings.length === 0 ? (_jsx("div", { className: "text-gray-500", children: "No bookings found." })) : (_jsx("ul", { className: "divide-y divide-gray-100", children: bookings
                            .filter((b) => {
                            try {
                                const content = typeof b.content === 'string' ? JSON.parse(b.content) : b.content;
                                return content.bookingResourceName !== undefined;
                            }
                            catch {
                                return false;
                            }
                        })
                            .map((b) => {
                            let name = '';
                            let id = b.id || b.Id;
                            try {
                                const content = typeof b.content === 'string' ? JSON.parse(b.content) : b.content;
                                name = content.bookingResourceName || '';
                            }
                            catch { }
                            return (_jsxs("li", { className: "py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-2", children: [_jsx("span", { className: "text-black font-medium text-base", children: name }), _jsx("span", { className: "text-xs text-gray-400", children: id })] }), _jsxs("div", { className: "flex gap-2 mt-2 md:mt-0", children: [_jsx("a", { href: `/dashboard/bookings/configure/${id}`, className: "px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm transition", title: "Configure", children: "Configure" }), _jsx("button", { className: "px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 text-sm transition disabled:opacity-60", onClick: () => handleDeleteBooking(id), disabled: deletingId === id, title: "Delete", children: deletingId === id ? 'Deleting...' : 'Delete' })] })] }, id));
                        }) }))] })] }));
};
export default BookingManagerPage;
