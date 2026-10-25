import { Link } from "react-router-dom";
import { apiUrl } from "../../../services/apiBase";

const EventCard = ({ event }) => {
  const fee = Number(event.price || event.registrationFee || 0);
  const image = event.imageUrl || event.images?.[0];

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
        <p className="mb-4 line-clamp-3 text-gray-600">{event.description}</p>
        <Link
          to={`/events/${event.slug}`}
          className="inline-block w-full rounded-lg bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-6 py-2 text-center text-white"
        >
          Learn more and register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
