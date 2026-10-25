import { Link } from "react-router-dom";
import { apiUrl } from "../../../services/apiBase";

function eventWhen(event) {
  const start = event.startDate ? new Date(event.startDate) : null;
  const end = event.endDate ? new Date(event.endDate) : null;
  if (!start || Number.isNaN(start.getTime())) return event.location || "";
  const options = { day: "numeric", month: "short", year: "numeric" };
  const startLabel = start.toLocaleDateString("en-IN", options);
  const endLabel = end && !Number.isNaN(end.getTime()) ? end.toLocaleDateString("en-IN", options) : "";
  const when = endLabel && endLabel !== startLabel ? `${startLabel} – ${endLabel}` : startLabel;
  return [event.location, when].filter(Boolean).join(" · ");
}

const EventCard = ({ event }) => {
  const fee = Number(event.price || event.registrationFee || 0);
  const image = event.imageUrl || event.images?.[0];
  const when = eventWhen(event);

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={apiUrl(image) || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 right-4 rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
          {fee > 0 ? `₹${fee}` : "FREE"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{event.name}</h3>
        {when ? <p className="mb-2 text-sm font-medium text-[#5B1D4D]">{when}</p> : null}
        <p className="mb-4 line-clamp-3 text-gray-600">{event.description}</p>
        <Link
          to={`/events/${event.id || event.slug}`}
          className="inline-block w-full rounded-lg bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-6 py-2 text-center text-white"
        >
          Learn more and register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
