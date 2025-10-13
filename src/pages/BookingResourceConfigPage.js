import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const defaultConfig = {
    timezone: 'Europe/Stockholm',
    slotDuration: 30,
    capacity: 2,
    daysOfWeek: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        startTime: '08:00',
        endTime: '17:00',
    })),
};
const BookingResourceConfigPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resourceName, setResourceName] = useState('');
    const [offsetForResource, setOffsetForResource] = useState({ startOffset: -100, endOffset: 364 });
    const [config, setConfig] = useState(defaultConfig);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        async function fetchResource() {
            if (!id)
                return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates/${id}`);
                if (!res.ok)
                    throw new Error('Failed to fetch resource');
                const data = await res.json();
                let content = data.content;
                if (typeof content === 'string') {
                    content = JSON.parse(content);
                }
                setResourceName(content.bookingResourceName || '');
                setOffsetForResource(content.offsetForResource || { startOffset: -100, endOffset: 364 });
                setConfig({
                    timezone: content.timezone || 'Europe/Stockholm',
                    slotDuration: content.slotDuration || 30,
                    capacity: content.capacity || 2,
                    daysOfWeek: Array.isArray(content.daysOfWeek) && content.daysOfWeek.length === 7
                        ? content.daysOfWeek
                        : Array.from({ length: 7 }, (_, i) => ({
                            day: i + 1,
                            startTime: '08:00',
                            endTime: '17:00',
                        })),
                });
            }
            catch (err) {
                setError('Failed to load resource');
            }
        }
        fetchResource();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    function handleConfigChange(field, value) {
        setConfig((prev) => ({ ...prev, [field]: value }));
    }
    function handleDayChange(idx, field, value) {
        setConfig((prev) => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.map((d, i) => i === idx ? { ...d, [field]: value } : d),
        }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            bookingResourceName: resourceName,
            offsetForResource,
            ...config,
        };
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: JSON.stringify(payload) }),
            });
            if (!res.ok)
                throw new Error('Failed to save configuration');
            navigate('/dashboard/bookings');
        }
        catch (err) {
            setError('Failed to save configuration');
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("div", { className: "p-6 max-w-2xl mx-auto bg-white rounded shadow", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-black", children: "Configure Booking Resource" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Resource Name" }), _jsx("input", { type: "text", className: "border px-3 py-2 rounded w-full", value: resourceName, onChange: e => setResourceName(e.target.value), required: true })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Start Offset" }), _jsx("input", { type: "number", className: "border px-3 py-2 rounded w-full", value: offsetForResource.startOffset, onChange: e => setOffsetForResource({ ...offsetForResource, startOffset: Number(e.target.value) }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "End Offset" }), _jsx("input", { type: "number", className: "border px-3 py-2 rounded w-full", value: offsetForResource.endOffset, onChange: e => setOffsetForResource({ ...offsetForResource, endOffset: Number(e.target.value) }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Timezone" }), _jsx("input", { type: "text", className: "border px-3 py-2 rounded w-full", value: config.timezone, onChange: e => handleConfigChange('timezone', e.target.value), required: true })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Slot Duration (minutes)" }), _jsx("input", { type: "number", className: "border px-3 py-2 rounded w-full", value: config.slotDuration, onChange: e => handleConfigChange('slotDuration', Number(e.target.value)), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Capacity" }), _jsx("input", { type: "number", className: "border px-3 py-2 rounded w-full", value: config.capacity, onChange: e => handleConfigChange('capacity', Number(e.target.value)), required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-black", children: "Days of Week" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: config.daysOfWeek.map((d, idx) => {
                                    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                    return (_jsxs("div", { className: "flex items-center gap-2 border p-2 rounded", children: [_jsx("span", { className: "w-24 font-bold text-black", children: dayNames[idx] }), _jsx("input", { type: "time", className: "border px-2 py-1 rounded", value: d.startTime, onChange: e => handleDayChange(idx, 'startTime', e.target.value) }), _jsx("span", { className: "text-black", children: "-" }), _jsx("input", { type: "time", className: "border px-2 py-1 rounded", value: d.endTime, onChange: e => handleDayChange(idx, 'endTime', e.target.value) })] }, d.day));
                                }) })] }), error && _jsx("div", { className: "text-red-600", children: error }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "submit", className: "px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700", disabled: saving, children: saving ? 'Saving...' : 'Save' }), _jsx("button", { type: "button", className: "px-4 py-2 rounded bg-gray-300 hover:bg-gray-400", onClick: () => navigate(-1), disabled: saving, children: "Cancel" })] })] })] }));
};
export default BookingResourceConfigPage;
