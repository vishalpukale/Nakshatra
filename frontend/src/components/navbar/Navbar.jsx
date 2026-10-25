import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLogo } from "../../assets/index";
import Footer from "../Footer";
import { useRegistration } from "../../modules/registration/RegistrationProvider";

const Navbar = () => {
  const location = useLocation();
  const { openFlow } = useRegistration();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] text-white px-4 py-2 rounded-md"
      : "text-white hover:text-primary-600 transition-colors";

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <img src={AppLogo} className="h-25" alt="Nakshatra" />
              </motion.div>
            </Link>

            <button
              type="button"
              className="rounded-md px-3 py-2 text-white md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>

            <div className="hidden items-center space-x-8 md:flex">
              <Link to="/" className={isActive("/")}>Home</Link>
              <Link to="/events/little-stars" className={isActive("/events/little-stars")}>Little Stars</Link>
              <Link to="/events/the-star-of-india" className={isActive("/events/the-star-of-india")}>Competitions</Link>
              <Link to="/about-us" className={isActive("/about-us")}>About Us</Link>
              <button type="button" className="text-white" onClick={() => openFlow("query")}>Queries</button>
              <button
                type="button"
                className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white"
                onClick={() => openFlow("register")}
              >
                Register
              </button>
            </div>
          </div>

          {menuOpen ? (
            <div className="flex flex-col gap-3 pb-4 md:hidden">
              <Link to="/" className={isActive("/")} onClick={closeMenu}>Home</Link>
              <Link to="/events/little-stars" className={isActive("/events/little-stars")} onClick={closeMenu}>Little Stars</Link>
              <Link to="/events/the-star-of-india" className={isActive("/events/the-star-of-india")} onClick={closeMenu}>Competitions</Link>
              <Link to="/about-us" className={isActive("/about-us")} onClick={closeMenu}>About Us</Link>
              <button type="button" className="text-left text-white" onClick={() => { closeMenu(); openFlow("query"); }}>Queries</button>
              <button type="button" className="text-left text-white" onClick={() => { closeMenu(); openFlow("register"); }}>Register</button>
            </div>
          ) : null}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Navbar;
