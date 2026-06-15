import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar, PlusCircle, QrCode, Users, BarChart3, MapPin } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Technical');
  const [maxRegistrations, setMaxRegistrations] = useState('100');
  const [saving, setSaving] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/event');
      setEvents(response.data.events);
    } catch (err) {
      alert('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/event', {
        title,
        description,
        date,
        venue,
        category,
        maxRegistrations
      });
      alert('Event scheduled successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      setVenue('');
      fetchEvents();
    } catch (err) {
      alert('Failed to create event: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleViewAnalytics = async (eventId) => {
    setSelectedEventId(eventId);
    setLoadingAnalytics(true);
    try {
      const response = await api.get(`/event/${eventId}/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      alert('Failed to fetch event analytics.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Campus Events & Check-In</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Schedule technical symposia, sports meets, print QR entry passes, and compile scans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE EVENT */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateEvent} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <PlusCircle className="h-5 w-5 text-primary-600" /> Schedule Event
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Symposium 2026"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Max Registrations</label>
                <input
                  type="number"
                  required
                  value={maxRegistrations}
                  onChange={(e) => setMaxRegistrations(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Event Date</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Venue Location</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Main Auditorium"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Event Description</label>
              <textarea
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about workshops or hacks..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {saving ? 'Scheduling...' : 'Publish Event'}
            </button>
          </form>
        </div>

        {/* EVENTS DIRECTORY WITH ANALYTICS & QR */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors space-y-4">
            <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Active Campus Events</h3>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-slate-500 text-xs">No active events scheduled yet.</p>
            ) : (
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {events.map(event => (
                  <div 
                    key={event.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[9px] font-bold rounded uppercase">
                        {event.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1">{event.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5 text-primary-500" /> {event.venue}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {event.qrCodeUrl && (
                        <div className="p-1 bg-white border rounded-xl" title="Click to view full check-in QR code">
                          <img src={event.qrCodeUrl} alt="QR Code" className="h-10 w-10 cursor-zoom-in" onClick={() => window.open(event.qrCodeUrl)} />
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleViewAnalytics(event.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                        View Scans
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event registrations scans panel */}
          {selectedEventId && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
              <h4 className="font-extrabold text-sm mb-4 flex items-center gap-1.5 text-slate-400 uppercase tracking-wider">
                <BarChart3 className="h-4.5 w-4.5 text-primary-500" /> Event Registration Scans Analysis
              </h4>

              {loadingAnalytics ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
                </div>
              ) : !analytics ? (
                <p className="text-slate-500 text-xs">Failed to load analytics.</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Registrations</span>
                      <strong className="text-lg font-black">{analytics.totalRegistrations}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Checked In</span>
                      <strong className="text-lg font-black text-green-500">{analytics.checkins}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Check-in Ratio</span>
                      <strong className="text-lg font-black text-primary-500">{analytics.checkinRatio}%</strong>
                    </div>
                  </div>

                  {/* Registrations list */}
                  <div className="max-h-[30vh] overflow-y-auto border rounded-2xl p-4 divide-y divide-slate-100 dark:divide-slate-800">
                    {analytics.registrations.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-4">No student registrations recorded.</p>
                    ) : (
                      analytics.registrations.map(r => (
                        <div key={r.id} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{r.student.name}</span>
                            <span className="text-slate-400 font-mono block text-[9px]">Roll: {r.student.rollNumber} | Dept: {r.student.department.code}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            r.checkedIn ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {r.checkedIn ? 'Checked In' : 'Registered'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminEvents;
