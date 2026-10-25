/**
 *  File :UserProfile.jsx
 *
 * Description :This file defines the UserProfile component, which serves as a container for displaying and managing
 * user profile-related information and actions within the application. It renders the ProfileInfo component
 * and provides props for handling profile, payment, and tax information modals, as well as notification data.
 * The component is designed to be used in the profile module and supports both desktop and back office agent views.
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29


 * Props:
 * @param {string} activeTab - The currently active tab in the profile section.
 * @param {function} setLoading - Function to set the loading state.
 * @param {boolean} isProfileModalOpen - Indicates if the profile modal is open.
 * @param {function} setIsProfileModalOpen - Function to toggle the profile modal.
 * @param {boolean} isPaymentModalOpen - Indicates if the payment modal is open.
 * @param {function} setIsPaymentModalOpen - Function to toggle the payment modal.
 * @param {boolean} isTaxInfoModalOpen - Indicates if the tax info modal is open.
 * @param {function} setIsTaxInfoModalOpen - Function to toggle the tax info modal.
 * @param {function} fetchNotificationData - Function to fetch notification data.
 * @param {boolean} isBackOfficeAgent - Indicates if the user is a back office agent.
 * @param {boolean} isDesktop - Indicates if the view is on a desktop device.
 * @param {object} notificationData - Data related to user notifications.
 */

import React from "react";
import ProfileInfo from "./ProfileInfo";
const UserProfile = ({
  activeTab,
  setLoading,
  isProfileModalOpen,
  setIsProfileModalOpen,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  isTaxInfoModalOpen,
  setIsTaxInfoModalOpen,
  fetchNotificationData,
  isBackOfficeAgent,
  isDesktop,
  notificationData,
  isProfileAccess,
  isLoading

}) => {
  return (
    <div className={`gap-2' grid min-w-[263px] grid-cols-1`}>
      <ProfileInfo
        activeTab={activeTab}
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        setLoading={setLoading}
        fetchNotificationData={fetchNotificationData}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        isBackOfficeAgent={isBackOfficeAgent}
        isDesktop={isDesktop}
        notificationData={notificationData}
        isProfileAccess={isProfileAccess}
        isLoading={isLoading}
      />

      {/* <DirectDepositInfo setLoading={setLoading}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        fetchNotificationData={fetchNotificationData}
      /> */}

      {/* <TaxInfo setLoading={setLoading}
        isTaxInfoModalOpen={isTaxInfoModalOpen}
        setIsTaxInfoModalOpen={setIsTaxInfoModalOpen}
        fetchNotificationData={fetchNotificationData}
      /> */}
    </div>
  );
};

export default UserProfile;
