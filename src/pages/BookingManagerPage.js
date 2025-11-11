import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const BookingManagerPage = () => {
    const navigate = useNavigate();
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
    return (_jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-semibold text-text-primary", children: "Booking Manager" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "btn-secondary", children: "Back" }), _jsx("button", { onClick: handleOpenForm, className: "btn-success", children: "Add booking resource" })] })] }), showForm && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 fade-in", children: _jsxs("div", { className: "card p-6 w-full max-w-sm slide-up", children: [_jsx("h3", { className: "text-lg font-semibold text-text-primary mb-4", children: "Add Booking Resource" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Resource name" }), _jsx("input", { type: "text", className: "input", placeholder: "Enter resource name", value: resourceName, onChange: e => setResourceName(e.target.value), required: true, disabled: submitting })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", className: "btn-secondary", onClick: handleCloseForm, disabled: submitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-success disabled:opacity-50", disabled: submitting || !resourceName.trim(), children: submitting ? 'Adding...' : 'Add' })] })] })] }) })), _jsx("div", { className: "table-container", children: loadingBookings ? (_jsx("div", { className: "p-6 text-text-secondary", children: "Loading..." })) : errorBookings ? (_jsx("div", { className: "p-6 text-danger", children: errorBookings })) : bookings.length === 0 ? (_jsx("div", { className: "p-6 text-text-secondary", children: "No bookings found." })) : (_jsx("div", { children: bookings
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
                        return (_jsxs("div", { className: "table-row", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-text-primary", children: name }), _jsx("div", { className: "text-xs text-text-secondary", children: id })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => navigate(`/dashboard/bookings/configure/${id}`), className: "btn-primary text-sm", title: "Configure", children: "Configure" }), _jsx("button", { className: "btn-danger text-sm disabled:opacity-50", onClick: () => handleDeleteBooking(id), disabled: deletingId === id, title: "Delete", children: deletingId === id ? 'Deleting...' : 'Delete' })] })] }, id));
                    }) })) })] }));
};
export default BookingManagerPage;
