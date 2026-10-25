import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventCard from "../landing/component/EventCard";
import { apiUrl } from "../../services/apiBase";
import { fetchEvents, fetchForm } from "../../services/registrationApi";
import RegistrationForm from "./RegistrationForm";

const GROUPS = {
  "little-stars": {
    type: "littlestars",
    title: "Little Stars",
    subtitle: "Choose an audition, then register.",
  },
  "talent-hunt": {
    type: "littlestars",
    title: "Little Stars",
    subtitle: "Choose an audition, then register.",
  },
  competitions: {
    type: "intercollege",
    title: "Competitions",
    subtitle: "Choose a competition, then register.",
  },
  "the-star-of-india": {
    type: "intercollege",
    title: "Competitions",
    subtitle: "Choose a competition, then register.",
  },
};

function EventPage() {
  const { slug } = useParams();
  const group = GROUPS[slug];
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setEvent(null);
    setEvents([]);
    setError("");
    setLoading(true);

    if (group) {
      fetchEvents()
        .then((body) => {
          if (!cancelled) {
            setEvents((body.data || []).filter((item) => item.type === group.type));
          }
        })
        .catch((loadError) => {
          if (!cancelled) setError(loadError.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      fetchForm(slug)
        .then((body) => {
          if (!cancelled) setEvent(body.data.event);
        })
        .catch((loadError) => {
          if (!cancelled) setError(loadError.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [slug, group]);

  if (group) {
    return (
      <div className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">{group.title}</h1>
            <p className="text-xl text-gray-400">{group.subtitle}</p>
          </div>
          {error ? <p className="text-center text-red-400">{error}</p> : null}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <EventCard key={item.id} event={item} />
            ))}
          </div>
          {loading ? <p className="text-center text-gray-400">Loading events...</p> : null}
          {!loading && !error && events.length === 0 ? (
            <p className="text-center text-gray-400">Events will appear here once they are published.</p>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-gray-400">
            {event?.type === "littlestars" ? "Current talent hunt" : "Competition"}
          </p>
          <h1 className="mb-4 text-4xl font-bold">{event?.name || "Event"}</h1>
          <p className="mb-6 text-gray-300">{event?.description}</p>
          {event?.imageUrl ? (
            <img src={apiUrl(event.imageUrl)} alt={event.name} className="mb-6 h-72 w-full rounded-xl object-cover" />
          ) : null}
          <div className="rounded-xl border border-white/10 p-5">
            <h2 className="mb-2 text-2xl font-semibold">
              {Number(event?.price) > 0 ? `Registration fee: ₹${event.price}` : "Registration is free"}
            </h2>
            <p className="text-gray-300">
              {event?.location ? `${event.location}. ` : ""}
              Share your state, current city, and hometown, then upload an audition video.
            </p>
            {error ? <p className="mt-3 text-red-400">{error}</p> : null}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Register now</h2>
          <RegistrationForm eventSlug={slug} tone="dark" />
        </div>
      </section>
    </div>
  );
}

export default EventPage;
