import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../services/apiBase";
import { fetchForm } from "../../services/registrationApi";
import RegistrationForm from "./RegistrationForm";

function EventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchForm(slug)
      .then((body) => {
        if (!cancelled) setEvent(body.data.event);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

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
