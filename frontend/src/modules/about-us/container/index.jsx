import { useEffect, useState } from "react";
import { creatorOne, creatorTwo, EventBgImage } from "../../../assets/index";
import { ABOUT_COPY, CONTACT_PHONES } from "../../registration/content";
import { fetchSiteContent } from "../../../services/registrationApi";
import { useRegistration } from "../../registration/RegistrationProvider";
import InquiryForm from "../../registration/InquiryForm";

const AboutUs = () => {
  const { openFlow } = useRegistration();
  const [aboutCopy, setAboutCopy] = useState(ABOUT_COPY);

  useEffect(() => {
    fetchSiteContent()
      .then((body) => {
        if (body.data?.aboutCopy) setAboutCopy(body.data.aboutCopy);
      })
      .catch(() => {});
  }, []);
  const creators = [
    { name: "Abdul Shahid", image: creatorOne },
    { name: "Abdul Mansoor Sohil", image: creatorTwo },
  ];

  return (
    <div className="bg-black text-white">
      <div className="py-24 text-center text-5xl font-bold md:text-6xl">Nakshatra</div>

      <div className="space-y-4">
        <div className="text-center text-4xl font-semibold">About</div>
        <p className="px-6 text-center md:px-24">{aboutCopy}</p>
      </div>

      <div className="flex justify-center py-10">
        <button
          type="button"
          className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-8 py-3"
          onClick={() => openFlow("register")}
        >
          Register for Auditions
        </button>
      </div>

      <div className="mt-10 space-y-10">
        <div className="text-center text-4xl font-semibold">Creators of Nakshatra</div>
        <div className="flex flex-wrap justify-center gap-20">
          {creators.map((creator) => (
            <div key={creator.name} className="flex flex-col items-center space-y-2 py-2">
              <img src={creator.image} alt={creator.name} className="h-85 w-70 object-cover" />
              <div className="px-10 text-center font-medium">{creator.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 bg-cover bg-center" style={{ backgroundImage: `url(${EventBgImage})` }}>
        <div className="flex flex-col items-center gap-4 bg-black/70 px-4 py-12">
          <div className="text-center text-4xl font-semibold">For more information</div>
          <div className="w-full max-w-xl">
            <InquiryForm intent="query" tone="dark" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="w-40 rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] py-2"
              onClick={() => openFlow("register")}
            >
              Register
            </button>
            <a
              href={`tel:${CONTACT_PHONES[0].tel}`}
              className="w-40 rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] py-2 text-center"
            >
              Make a call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
