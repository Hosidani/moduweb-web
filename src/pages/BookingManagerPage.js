import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const BookingManagerPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [resourceName, setResourceName] = useState('');
    const [submitting, setSubmitting] = useState(false);
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
    return (_jsxs("div", { className: "p-6 space-y-4 bg-gray-100 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Booking Manager" }), _jsx("button", { className: "bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700", onClick: handleOpenForm, children: "Add booking resource" }), showForm && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("div", { className: "bg-white rounded shadow-lg p-6 w-full max-w-sm", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Add Booking Resource" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", className: "border px-3 py-2 rounded w-full", placeholder: "Resource name", value: resourceName, onChange: e => setResourceName(e.target.value), required: true, disabled: submitting }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", className: "px-3 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: handleCloseForm, disabled: submitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "px-3 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700", disabled: submitting || !resourceName.trim(), children: submitting ? 'Adding...' : 'Add' })] })] })] }) }))] }));
};
export default BookingManagerPage;
