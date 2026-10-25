/**
 *  File : Notification.jsx
 * Description :
 * This file defines the `Notification` React component, which displays a notification banner prompting users
 * to update specific profile information (such as Payment Information or Tax Information) required to receive payouts.
 * The component renders a styled message with clickable links for each missing information item, opening the corresponding modal when clicked.
 * It uses the `Avatar` UI control and an informational icon.
 *
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29
 *
 * Props:
 * - setLoading (function): Function to set the loading state (not used directly in this component).
 * - setIsPaymentModalOpen (function): Function to open the Payment Information modal.
 * - setIsProfileModalOpen (function): Function to open the Profile modal.
 * - setIsTaxInfoModalOpen (function): Function to open the Tax Information modal.
 * - notificationData (array): Array of strings representing the missing information items to be updated.
 */
import React from "react";
import { Avatar } from "../../../ui-controls";
import { InfoAdmin1 } from "../../../assets";

const Notification = ({
  setLoading,
  setIsPaymentModalOpen,
  setIsProfileModalOpen,
  setIsTaxInfoModalOpen,
  notificationData,
}) => {
  const handleOpenModal = (item) => {
    if (item === "Payment Information") {
      setIsPaymentModalOpen(true);
    } else if (item === "Tax information") {
      setIsTaxInfoModalOpen(true);
    } else {
      setIsProfileModalOpen(true);
    }
  };

  if (!Array.isArray(notificationData) || notificationData.length === 0)
    return null;

  return (
    <div className="h-[43px] col-span-full mb-3 rounded-lg border border-[#FF9E9E] bg-[#FFF7F7] pt-2 pb-2 pl-3">
      <div className="flex items-center">
        <Avatar
          size="xs"
          title="notUpdated"
          isRounded={true}
          isDisabled={true}
          src={InfoAdmin1}  
          btnStyle="relative mt-[2px] -top-px head-initial avatar-disabled opacity-100"
        />

        <span className="line-clamp-1 text-txt-md-13 text-primary-theme-1 ml-2 font-[450]">
          Update{" "}
          {notificationData.map((item, index) => {
            const isLast = index === notificationData.length - 1;
            const isSecondLast = index === notificationData.length - 2;

            return (
              <span key={index}>
                <span
                  onClick={() => handleOpenModal(item)}
                  className="text-primary-accent cursor-pointer px-1 underline"
                >
                  {item}
                </span>
                {!isLast && (isSecondLast ? " and " : ", ")}
              </span>
            );
          })}
          to get payouts
        </span>
      </div>
    </div>
  );
};

export default Notification;
