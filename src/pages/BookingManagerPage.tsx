import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingManagerPage = () => {
  const navigate = useNavigate();
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
    <div className="content-wrapper">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text-primary">Booking Manager</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            onClick={handleOpenForm}
            className="btn-success"
          >
            Add booking resource
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 fade-in">
          <div className="card p-6 w-full max-w-sm slide-up">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Add Booking Resource</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Resource name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter resource name"
                  value={resourceName}
                  onChange={e => setResourceName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-success disabled:opacity-50"
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
      <div className="table-container">
        {loadingBookings ? (
          <div className="p-6 text-text-secondary">Loading...</div>
        ) : errorBookings ? (
          <div className="p-6 text-danger">{errorBookings}</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-text-secondary">No bookings found.</div>
        ) : (
          <div>
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
                  <div key={id} className="table-row">
                    <div>
                      <div className="font-medium text-text-primary">{name}</div>
                      <div className="text-xs text-text-secondary">{id}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/bookings/configure/${id}`)}
                        className="btn-primary text-sm"
                        title="Configure"
                      >
                        Configure
                      </button>
                      <button
                        className="btn-danger text-sm disabled:opacity-50"
                        onClick={() => handleDeleteBooking(id)}
                        disabled={deletingId === id}
                        title="Delete"
                      >
                        {deletingId === id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagerPage;
