import { useState, useEffect } from 'react';

const BookingManagerPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  async function handleDeleteBooking(id: string) {
    if (!window.confirm('Are you sure you want to delete this booking resource?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete booking');
      await fetchBookings();
    } catch (err) {
      alert('Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  }
  async function fetchBookings() {
    setLoadingBookings(true);
    setErrorBookings(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookingtemplates`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setErrorBookings('Failed to load bookings');
    } finally {
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
  async function handleSubmit(e: React.FormEvent) {
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
    } catch (err) {
      if (err instanceof Error) {
        console.error('[Frontend error]', err.message, err);
        alert('Failed to create resource: ' + err.message);
      } else {
        console.error('[Frontend error] Unknown error', err);
        alert('Failed to create resource: Unknown error');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
  <h2 className="text-2xl font-bold mb-4 text-black">Booking Manager</h2>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        onClick={handleOpenForm}
      >
        Add booking resource
      </button>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add Booking Resource</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                className="border px-3 py-2 rounded w-full"
                placeholder="Resource name"
                value={resourceName}
                onChange={e => setResourceName(e.target.value)}
                required
                disabled={submitting}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700"
                  disabled={submitting || !resourceName.trim()}
                >
                  {submitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List bookings from backend */}
      <div className="bg-white rounded shadow p-6 mt-4 border border-gray-200">
        <h3 className="font-bold mb-4 text-black text-lg">All Booking Resources</h3>
        {loadingBookings ? (
          <div className="text-gray-500">Loading...</div>
        ) : errorBookings ? (
          <div className="text-red-600">{errorBookings}</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-500">No bookings found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {bookings
              .filter((b) => {
                try {
                  const content = typeof b.content === 'string' ? JSON.parse(b.content) : b.content;
                  return content.bookingResourceName !== undefined;
                } catch {
                  return false;
                }
              })
              .map((b) => {
                let name = '';
                let id = b.id || b.Id;
                try {
                  const content = typeof b.content === 'string' ? JSON.parse(b.content) : b.content;
                  name = content.bookingResourceName || '';
                } catch {}
                return (
                  <li key={id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-black font-medium text-base">{name}</span>
                      <span className="text-xs text-gray-400">{id}</span>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <a
                        href={`/dashboard/bookings/configure/${id}`}
                        className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm transition"
                        title="Configure"
                      >
                        Configure
                      </a>
                      <button
                        className="px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 text-sm transition disabled:opacity-60"
                        onClick={() => handleDeleteBooking(id)}
                        disabled={deletingId === id}
                        title="Delete"
                      >
                        {deletingId === id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingManagerPage;
