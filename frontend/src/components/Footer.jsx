import { Link } from "react-router-dom";
import { AppLogo, Facebook, Instagram, Youtube } from "../assets/index";
import { CONTACT_PHONES, INSTAGRAM_URL } from "../modules/registration/content";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <img className="h-40" src={AppLogo} alt="Nakshatra" />
          </div>

          <div className="mt-6 font-medium">
            <ul className="space-y-2">
              <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/events/little-stars" className="transition-colors hover:text-white">Little Stars</Link></li>
              <li><Link to="/events/the-star-of-india" className="transition-colors hover:text-white">Competitions</Link></li>
              <li><Link to="/about-us" className="transition-colors hover:text-white">About</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-white">Terms</Link></li>
              <li><Link to="/admin/login" className="transition-colors hover:text-white">Admin</Link></li>
            </ul>
          </div>

          <div className="mt-6 font-medium">
            <ul className="space-y-2">
              {CONTACT_PHONES.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className="transition-colors hover:text-white">{phone.display}</a>
                </li>
              ))}
              <li className="flex gap-2">
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <img className="h-6" src={Instagram} alt="" />
                </a>
                <img className="h-6 opacity-40" src={Facebook} alt="" />
                <img className="h-6 opacity-40" src={Youtube} alt="" />
              </li>
              <li className="text-[12px]">© Nakshatra {currentYear}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
