import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const defaultConfig = {
  timezone: 'Europe/Stockholm',
  slotDuration: 30,
  capacity: 2,
  daysOfWeek: Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    isWorking: true,
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
      if (!id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates/${id}`);
        if (!res.ok) throw new Error('Failed to fetch resource');
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
      } catch (err) {
        setError('Failed to load resource');
      }
    }
    fetchResource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleConfigChange(field: string, value: any) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  function handleDayChange(idx: number, field: string, value: any) {
    setConfig((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      ),
    }));
  }

  function handleDayWorkingChange(idx: number, checked: boolean) {
    setConfig((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.map((d, i) =>
        i === idx ? { ...d, isWorking: checked } : d
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      if (!res.ok) throw new Error('Failed to save configuration');
      navigate('/dashboard/bookings');
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  return (
  <div className="p-9 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-black">Configure Booking Resource</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-black">Resource Name</label>
          <input type="text" className="border px-3 py-2 rounded w-full" value={resourceName} onChange={e => setResourceName(e.target.value)} required />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-semibold mb-1 text-black">Start Offset</label>
            <input type="number" className="border px-3 py-2 rounded w-full" value={offsetForResource.startOffset} onChange={e => setOffsetForResource({ ...offsetForResource, startOffset: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">End Offset</label>
            <input type="number" className="border px-3 py-2 rounded w-full" value={offsetForResource.endOffset} onChange={e => setOffsetForResource({ ...offsetForResource, endOffset: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Timezone</label>
          <input type="text" className="border px-3 py-2 rounded w-full" value={config.timezone} onChange={e => handleConfigChange('timezone', e.target.value)} required />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-semibold mb-1 text-black">Slot Duration (minutes)</label>
            <input type="number" className="border px-3 py-2 rounded w-full" value={config.slotDuration} onChange={e => handleConfigChange('slotDuration', Number(e.target.value))} required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Capacity</label>
            <input type="number" className="border px-3 py-2 rounded w-full" value={config.capacity} onChange={e => handleConfigChange('capacity', Number(e.target.value))} required />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Days of Week</label>
          <div className="flex flex-col gap-2">
            {config.daysOfWeek.map((d, idx) => {
              const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              return (
                <div
                  key={d.day}
                  className="w-full min-h-[48px] flex flex-row flex-wrap items-center gap-3 border p-2 rounded bg-white shadow-sm overflow-x-auto"
                  style={{ boxSizing: 'border-box' }}
                >
                  <span className="w-24 min-w-[80px] font-bold text-black">{dayNames[idx]}</span>
                  <div className="flex items-center gap-1 min-w-[90px]">
                    <input
                      type="checkbox"
                      checked={d.isWorking !== false}
                      onChange={e => handleDayWorkingChange(idx, e.target.checked)}
                      id={`working-day-${idx}`}
                    />
                    <label htmlFor={`working-day-${idx}`} className="text-black select-none cursor-pointer text-sm">Working day</label>
                  </div>
                  <input
                    type="time"
                    className="border px-2 py-1 rounded w-[90px]"
                    value={d.startTime}
                    onChange={e => handleDayChange(idx, 'startTime', e.target.value)}
                    disabled={d.isWorking === false}
                  />
                  <span className="text-black">-</span>
                  <input
                    type="time"
                    className="border px-2 py-1 rounded w-[90px]"
                    value={d.endTime}
                    onChange={e => handleDayChange(idx, 'endTime', e.target.value)}
                    disabled={d.isWorking === false}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingResourceConfigPage;
