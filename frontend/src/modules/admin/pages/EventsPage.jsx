import { useEffect, useState } from "react";
import { fetchManagedEvents, removeEvent, saveEvent } from "../../../services/adminApi";

const emptyEvent = {
  name: "",
  type: "littlestars",
  description: "",
  imageUrl: "",
  location: "",
  venue: "",
  startDate: "",
  endDate: "",
  registrationTillDate: "",
  paymentRequired: false,
  price: "",
  isActive: true,
};

const fieldClass = "mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-white";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const body = await fetchManagedEvents();
    setEvents(body.data || []);
  };

  useEffect(() => {
    load().catch((loadError) => setError(loadError.message));
  }, []);

  const edit = (event) => {
    setEditingId(event.id);
    setConfirmId(null);
    setMessage("");
    setError("");
    setForm({
      name: event.name || "",
      type: event.type || "littlestars",
      description: event.description || "",
      imageUrl: event.imageUrl || "",
      location: event.location || "",
      venue: event.venue || "",
      startDate: event.startDate || "",
      endDate: event.endDate || "",
      registrationTillDate: event.registrationTillDate || "",
      paymentRequired: Boolean(event.paymentRequired),
      price: event.price ?? "",
      isActive: event.isActive !== false,
    });
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setMessage("");
    try {
      await saveEvent(
        {
          ...form,
          price: form.paymentRequired ? Number(form.price) : 0,
        },
        editingId
      );
      setMessage(editingId ? "Event updated. It is live on the public site." : "Event created and shown on the public site.");
      setForm(emptyEvent);
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const handleRemove = async (id) => {
    setError("");
    try {
      await removeEvent(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyEvent);
      }
      setConfirmId(null);
      setMessage("Event removed from the public site.");
      await load();
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Events</h1>
      <p className="mb-6 mt-1 text-sm text-white/60">
        Current events appear in the Little Stars section. Upcoming competitions appear in the competitions section.
      </p>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {message ? <p className="mb-4 text-green-400">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <p className="text-sm text-white/50">
                    {event.type === "littlestars" ? "Current event" : "Upcoming competition"}
                    {event.isActive ? "" : " · Hidden"}
                    {` · ${event.registrationCount} registration${event.registrationCount === 1 ? "" : "s"}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-md border border-white/20 px-3 py-1 text-sm" onClick={() => edit(event)}>
                    Edit
                  </button>
                  {confirmId === event.id ? (
                    <button type="button" className="rounded-md bg-red-700 px-3 py-1 text-sm" onClick={() => handleRemove(event.id)}>
                      Confirm remove
                    </button>
                  ) : (
                    <button type="button" className="rounded-md border border-white/20 px-3 py-1 text-sm" onClick={() => setConfirmId(event.id)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {events.length === 0 ? <p className="text-white/50">No events yet.</p> : null}
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-3 font-semibold">{editingId ? "Update event" : "Create event"}</h2>
          <label className="mb-3 block text-sm">
            Name
            <input className={fieldClass} value={form.name} onChange={(input) => setForm({ ...form, name: input.target.value })} required />
          </label>
          <label className="mb-3 block text-sm">
            Where it shows
            <select className={fieldClass} value={form.type} onChange={(input) => setForm({ ...form, type: input.target.value })}>
              <option value="littlestars">Current events</option>
              <option value="intercollege">Upcoming competitions</option>
            </select>
          </label>
          <label className="mb-3 block text-sm">
            Description
            <textarea className={fieldClass} rows="4" value={form.description} onChange={(input) => setForm({ ...form, description: input.target.value })} />
          </label>
          <label className="mb-3 block text-sm">
            Image address
            <input className={fieldClass} value={form.imageUrl} onChange={(input) => setForm({ ...form, imageUrl: input.target.value })} placeholder="https://..." />
          </label>
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Location
              <input className={fieldClass} value={form.location} onChange={(input) => setForm({ ...form, location: input.target.value })} />
            </label>
            <label className="text-sm">
              Venue
              <input className={fieldClass} value={form.venue} onChange={(input) => setForm({ ...form, venue: input.target.value })} />
            </label>
          </div>
          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              Starts
              <input type="date" className={fieldClass} value={form.startDate} onChange={(input) => setForm({ ...form, startDate: input.target.value })} />
            </label>
            <label className="text-sm">
              Ends
              <input type="date" className={fieldClass} value={form.endDate} onChange={(input) => setForm({ ...form, endDate: input.target.value })} />
            </label>
            <label className="text-sm">
              Register until
              <input type="date" className={fieldClass} value={form.registrationTillDate} onChange={(input) => setForm({ ...form, registrationTillDate: input.target.value })} required />
            </label>
          </div>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.paymentRequired} onChange={(input) => setForm({ ...form, paymentRequired: input.target.checked })} />
            Charge a registration fee
          </label>
          {form.paymentRequired ? (
            <label className="mb-3 block text-sm">
              Price (INR)
              <input type="number" min="0" className={fieldClass} value={form.price} onChange={(input) => setForm({ ...form, price: input.target.value })} />
            </label>
          ) : null}
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(input) => setForm({ ...form, isActive: input.target.checked })} />
            Visible on the public site
          </label>
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2">
              {editingId ? "Update event" : "Create event"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="rounded-md border border-white/20 px-4 py-2"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyEvent);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventsPage;
