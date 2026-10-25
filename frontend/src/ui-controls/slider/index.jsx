// components/ResponsiveSlider.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const ResponsiveSlider = ({ children, isSingle=false }) => {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    showPrev: false,
    showNext: true,
  });
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollState({
        showPrev: scrollLeft > 5, // Small threshold for better UX
        showNext: scrollLeft < scrollWidth - clientWidth - 5,
      });
    }
  }, []);

  const smoothScroll = useCallback(
    (direction) => {
      if (!scrollRef.current || isScrolling) return;

      setIsScrolling(true);
      const container = scrollRef.current;
      const scrollAmount = Math.min(container.clientWidth * 0.8, 400); // Responsive scroll amount

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Wait for smooth scroll to complete
      setTimeout(() => {
        setIsScrolling(false);
        checkScrollState();
      }, 400);
    },
    [isScrolling, checkScrollState],
  );

  const scrollLeft = () => smoothScroll("left");
  const scrollRight = () => smoothScroll("right");

  // Debounced scroll handler for better performance
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScrollState, 50);
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkScrollState]);

  useEffect(() => {
    checkScrollState();

    // Recheck on window resize
    const handleResize = () => {
      setTimeout(checkScrollState, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScrollState]);

  return (
    <div className="relative">
      <button
        onClick={scrollLeft}
        className={`absolute top-1/2 left-4 z-5 -translate-y-1/2 rounded-full bg-[#1ABADC] p-[0.7rem] shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-[#159BB8] hover:shadow-xl ${
          scrollState.showPrev
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        disabled={!scrollState.showPrev || isScrolling}
        aria-label="Scroll left"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="size-7 transition-transform duration-200"
        >
          <path
            fillRule="evenodd"
            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        className={`absolute top-1/2 right-4 z-5  -translate-y-1/2 rounded-full bg-[#1ABADC] p-[0.7rem] shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-[#159BB8] hover:shadow-xl ${
          scrollState.showNext
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        disabled={!scrollState.showNext || isScrolling}
        aria-label="Scroll right"
      >
       
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="size-7 transition-transform duration-200"
        >
          <path
            fillRule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Better iOS scrolling
        }}
      >
        <div className={`flex w-max gap-3 pb-4 ${isSingle ? "!w-[auto] justify-center md:justify-start" : ""}`}>{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveSlider;
