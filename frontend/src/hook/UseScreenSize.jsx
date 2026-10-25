/**
 * --------------------------------------------------------
 * File        : UseScreenSize.js
 * Description : Custom React hook to track and provide
 *               current screen dimensions and device type
 *               (mobile, tablet, desktop) based on width breakpoints.
 * Authors     : Developer team
 * Created On  : 2025-07-17
 * Updated On  : 2025-07-17
 * --------------------------------------------------------
 * Notes:
 * - Listens to window resize events to update state.
 * - Provides width, height, and boolean flags for device types.
 * - Skips execution on server side (SSR).
 */

import { useState, useEffect } from "react";

const UseScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 768) {
        isMobile = true;
      } else if (width >= 768 && width < 1023) {
        isTablet = true;
      } else {
        isDesktop = true;
      }

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    handleResize(); // Run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

export default UseScreenSize;
