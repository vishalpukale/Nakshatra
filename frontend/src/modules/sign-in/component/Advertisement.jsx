/**
 * --------------------------------------------------------
 * File        : Advertisement.js
 * Description : Displays a rotating carousel of advertisements.
 *               Fetches ads via Redux and auto-rotates them every 3 seconds.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Uses `getAdvertise` Redux action to fetch ad data.
 * - Maintains local state for rotation and ad tracking.
 * - Handles loading state via parent-provided `setLoading`.
 * - UI includes image background with title, subtitle, and dot navigation.
 */

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAdvertise } from "../slice/signinSlice";
import { LinkButton } from "../../../ui-controls";
import { useNavigate } from "react-router-dom";

const Advertisement = ({ setLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0); // Tracks current ad index
  const [advertisements, setAdvertisements] = useState([]); // Stores ad data

  // Fetch advertisements on mount
  useEffect(() => {
    setLoading(true);
    const param = {
      forScreen: "login",
    };
    dispatch(getAdvertise(param))
      .then((response) => {
        if (response?.payload?.status === 200) {
          const { data } = response?.payload?.data;
          setAdvertisements(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, [dispatch]);

  // Automatically go to next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlideIndex((prevIndex) =>
        advertisements.length ? (prevIndex + 1) % advertisements.length : 0,
      );
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [advertisements]);

  const currentAd = advertisements[activeSlideIndex]; // Ad currently being displayed

  return (
    // <div className="relative h-full w-full">
    //   <div className="absolute inset-0 grid place-items-center text-white">
    //     <div className="relative h-full w-full">
    //       <div className="h-full overflow-hidden shadow-lg">
    //         {/* Show ad background */}
    //         {currentAd && (
    //           <div
    //             className="h-full w-full bg-cover bg-center"
    //             style={{
    //               backgroundImage: `url(${currentAd.thumbnailUrl})`,
    //             }}
    //           >
    //             <div className="absolute bottom-0 left-0">
    //               <div className="z-10 ml-5 px-4">
    //                 {/* Ad Title */}
    //                 <h2 className="text-txt-28 mb-2 w-[75%] font-bold">
    //                   {currentAd.title}
    //                 </h2>

    //                 {/* Ad Subtitle */}
    //                 <p className="text-txt-16 w-[90%] text-[#FFFFFFAD]">
    //                   {currentAd.subTitle}
    //                 </p>

    //                 {/* Navigation Dots */}
    //                 <div className="mt-4 flex h-[33px] justify-start">
    //                   {advertisements?.map((_, index) => (
    //                     <div
    //                       key={index}
    //                       onClick={() => setActiveSlideIndex(index)}
    //                       className={`mx-1 h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${activeSlideIndex === index
    //                         ? "bg-primary-accent"
    //                         : "bg-background-theme opacity-70"
    //                         }`}
    //                     ></div>
    //                   ))}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //         {/* Optionally add fallback UI here if currentAd is null */}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="group relative h-full w-full">
      <div className="absolute inset-0 grid place-items-center text-white">
        <div className="relative h-full w-full">
          <div className="h-full overflow-hidden shadow-lg">
            {/* Show ad background */}
            {currentAd && (
              <div
                className="relative h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentAd.thumbnailUrl})`,
                }}
              >
                {/* Bottom left: Title & subtitle */}
                <div className="absolute bottom-0 left-0">
                  <div className="z-10 ml-5 px-4">
                    <h2 className="text-txt-28 mb-2 w-[75%] font-bold">
                      {currentAd.title}
                    </h2>
                    <p className="text-txt-16 w-[90%] text-[#FFFFFFAD]">
                      {currentAd.subTitle}
                    </p>

                    {/* Navigation Dots */}
                    <div className="mt-4 flex h-[33px] justify-start">
                      {advertisements?.map((_, index) => (
                        <div
                          key={index}
                          onClick={() => setActiveSlideIndex(index)}
                          className={`mx-1 h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                            activeSlideIndex === index
                              ? "bg-primary-accent"
                              : "bg-background-theme opacity-70"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom right button — shown on hover */}
                <div>
                  <LinkButton
                    key={currentAd.id}
                    isActive={true}
                    onClick={() => window.open(currentAd.imageUrl, "_blank")}
                    label={"Details"}
                    btnStyle={"text-txt-md-12 font-medium !text-white !mr-0 bg-primary-theme-1 absolute right-4 bottom-4 rounded px-4 py-2"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
