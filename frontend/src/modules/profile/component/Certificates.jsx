/**
 * File :  Certificates.jsx
 * Description :
 * This file defines the `Certificates` React component, which serves as a container for displaying
 * various certification-related sections within a user's profile. It includes components for E&O,
 * AML Annuities, Best Interest, Annuities, and LTC certifications. The component dynamically adjusts
 * its height based on the presence of notification data and provides a scrollable area for its content.
 *
 * Props:
 * @param {function} setLoading - Function to set the loading state in the parent component.
 * @param {Array} notificationData - Array containing notification objects; used to adjust container height.
 * @param {boolean} isBackOfficeAgent - Flag indicating if the current user is a back office agent.
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * Usage:
 * This component is intended to be used within the profile module to manage and display
 * certification-related information for users.
 */
import React from "react";
import EAndO from "./EAndO";
import AMLAnnuities from "./AMLAnnuities";
import BestInterest from "./BestInterest";
import Annuities from "./Annuities";
import LTC from "./LTC";

              
  const Certificates = ({ setLoading, notificationData, isBackOfficeAgent, isComplianceAccess }) => {
  const HEIGHTS = {
    withNotifications: "h-[calc(100dvh-220px)]",
    withoutNotifications: "h-[calc(100dvh-160px)]",
  };

  const containerHeight =
    notificationData.length !== 0
      ? HEIGHTS.withNotifications
      : HEIGHTS.withoutNotifications;

  return (
    <>
      <div
        className={`${containerHeight} rounded-br-lg rounded-bl-lg border border-gray-200 bg-white pb-3`}
      >
        <div
          className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-hide h-full overflow-x-hidden overflow-y-auto`}
        >
          {/* E&O Setup */}
          <EAndO
            setLoading={setLoading}
            isBackOfficeAgent={isBackOfficeAgent}
            isComplianceAccess={isComplianceAccess}
          />
          {/* State License */}
          {/* <StateLicense setLoading={setLoading} /> */}
          {/* Continuing Education */}
          <div className="text-txt-md-25 text-links rounded-tl-lg rounded-tr-lg border-gray-200 bg-white p-5 pb-1">
            <h1 className="text-txt-lg-18 font-semibold">
              Continuing Education
            </h1>
          </div>
          <AMLAnnuities
            setLoading={setLoading}
            isBackOfficeAgent={isBackOfficeAgent}
            isComplianceAccess={isComplianceAccess}
          />
          {/* Best Interest */}
          <BestInterest
            setLoading={setLoading}
            isBackOfficeAgent={isBackOfficeAgent}
            isComplianceAccess={isComplianceAccess}
          />
          {/* Annuities */}
          <Annuities
            setLoading={setLoading}
            isBackOfficeAgent={isBackOfficeAgent}
            isComplianceAccess={isComplianceAccess}
          />
          {/* LTC */}
          <LTC setLoading={setLoading} isBackOfficeAgent={isBackOfficeAgent} isComplianceAccess={isComplianceAccess} />
        </div>
      </div>
    </>
  );
};

export default Certificates;
