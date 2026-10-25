import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ImageCarousel from "../../../components/carousal/ImageCarousel";
import EventCard from "../component/EventCard";
import StateCard from "../component/StateCard";
import { BannerOne, BannerThree, BannerTwo } from "../../../assets/index";
import { apiUrl } from "../../../services/apiBase";
import { fetchEvents, fetchGallery, fetchSiteContent, fetchStates } from "../../../services/registrationApi";
import { useRegistration } from "../../registration/RegistrationProvider";

const PARTICIPATING_CODES = ["MH", "TS", "AP", "KA", "KL"];

const Index = () => {
  const { openFlow } = useRegistration();
  const [events, setEvents] = useState([]);
  const [states, setStates] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [site, setSite] = useState({
    heroTitle: "The Star of India — Where Talent Finds Its Purpose",
    heroSubtitle: "India's premier platform to discover, recognize, and celebrate talent across music, dance, and performing arts.",
  });
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchEvents(),
      fetchStates(),
      fetchGallery().catch(() => ({ data: [] })),
      fetchSiteContent().catch(() => ({ data: null })),
    ])
      .then(([eventBody, stateBody, galleryBody, siteBody]) => {
        if (cancelled) return;
        setEvents(eventBody.data || []);
        const allStates = stateBody.data || [];
        const marked = allStates.filter((state) => state.isParticipating);
        const participating = marked.length
          ? marked
          : allStates.filter((state) => PARTICIPATING_CODES.includes(state.code));
        setStates(participating);
        setGallery(galleryBody.data || []);
        if (siteBody.data?.heroTitle) setSite(siteBody.data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentEvents = events.filter((event) => event.type === "littlestars");
  const upcomingEvents = events.filter((event) => event.type === "intercollege");
  const heroImages = gallery.filter((image) => image.placement === "hero").map((image) => apiUrl(image.imageUrl));
  const galleryImages = gallery.filter((image) => image.placement === "gallery").map((image) => apiUrl(image.imageUrl));
  const fallbackGallery = [BannerOne, BannerTwo, BannerThree, ...events.map((event) => apiUrl(event.imageUrl)).filter(Boolean)];

  return (
    <div className="min-h-screen bg-black">
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageCarousel
            images={heroImages.length ? heroImages : [BannerOne, BannerTwo, BannerThree]}
            autoSlide={true}
            interval={4000}
            heightClass="h-full"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="relative z-20 max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-3xl font-bold text-white md:text-5xl"
          >
            {site.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-lg text-white/90"
          >
            {site.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button
              type="button"
              className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white"
              onClick={() => openFlow("register")}
            >
              Register
            </button>
            <button
              type="button"
              className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white"
              onClick={() => openFlow("partner")}
            >
              Become a Partner
            </button>
            <button
              type="button"
              className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white"
              onClick={() => openFlow("mission")}
            >
              Join the Mission
            </button>
          </motion.div>
        </div>
      </section>

      {loadError ? (
        <p className="px-4 py-6 text-center text-red-400">
          The registration service is not reachable. Start it on port 3001, then refresh. {loadError}
        </p>
      ) : null}

      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Participating States</h2>
            <p className="text-xl">Maharashtra, Telangana, Andhra Pradesh, Karnataka, and Kerala</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {states.map((state) => (
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        </div>
      </section>

      <EventSection
        title="Current Events"
        subtitle="Little Stars, the free talent hunt"
        events={currentEvents}
      />
      <EventSection
        title="Upcoming Competitions"
        subtitle="The Star of India intercollege showcase"
        events={upcomingEvents}
      />

      <section className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-4xl font-bold text-white">Gallery</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(galleryImages.length ? galleryImages : fallbackGallery).slice(0, 6).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" className="h-56 w-full rounded-xl object-cover" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              type="button"
              className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white"
              onClick={() => openFlow("query")}
            >
              Send a query
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function EventSection({ title, subtitle, events }) {
  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
          <p className="text-xl text-gray-400">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {events.length === 0 ? (
          <p className="text-center text-gray-400">Events will appear here once the registration service is running.</p>
        ) : null}
      </div>
    </section>
  );
}

export default Index;
