/**
 * --------------------------------------------------------
 * Component   : OnboardingHeader
 * Description : Displays the header with avatar, label,
 *               and a timeout handler for inactivity.
 *               Contains a confirm dialog for exiting.
 * --------------------------------------------------------
 * Props:
 * - header (string): The title/label to display.
 * - isDisabled (bool): Flag to disable certain elements.
 * - dialogHeader (string): Title for the confirmation dialog.
 * - dialogDetail (string): Detail for the confirmation dialog.
 * --------------------------------------------------------
 */

import React, { useState } from "react";

import { Avatar, Label, ErrorDialog } from "../../ui-controls";
import { Cross } from "../../assets";
import { useNavigate } from "react-router-dom";

const OnboardingHeader = ({
  children,
  isDisabled,
  header,
  dialogHeader,
  dialogDetail,
  headerClassName,
  navbarStyles, isOpenedByMail = false,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const onCloseClick = () => {
    if (isOpenedByMail) {

      navigate("/agent");
    } else {
      navigate(-1);
    }
  }

  return (
    <>
      <nav className={`4xl:h-24 bg-primary-theme fixed top-0 z-10 w-full ${navbarStyles || ""}`}>
        <div className="flex px-6">
          <div className="flex items-center justify-center align-middle text-amber-50">
            <Avatar
              src={Cross}
              onClick={() => setShowConfirmDialog(true)}
              style={{ height: "30px", width: "30px", cursor: "pointer" }}
            />
            <Label
              label={header}
              size="lg"
              // lblStyle={"!text-txt-29  ml-5 line-clamp-1"}
              lblStyle={`text-txt-29 ml-5 line-clamp-1 ${headerClassName || ""}`} />
          </div>

          <div className="flex-grow"></div>

          <div className="4xl:mt-5 relative w-52 flex-none">
            <div className="relative flex h-14 items-center justify-end">
              {/* <LinkButton
                isDisabled={isDisabled}
                isActive={true}
                label={`FAQs`}
                btnStyle={"btn-style !text-white !p-2"}
                onClick={() => {
                  window.open("/faq", "_blank");
                }}
              />

              <LinkButton
                isDisabled={isDisabled}
                isActive={true}
                label={`Contact Us`}
                btnStyle={"btn-style !text-white !p-2"}
                onClick={() => {
                  window.open("/contact-us", "_blank");
                }}
              /> */}

              {/* <PopOverDialog
                visible={isOpenPop}
                onCloseModel={() => setPopOver(false)}
                pannelClass={"left-24"}
                isPointerIcon={true}
                icon={
                  <Tooltip
                    id="user"
                    label={getLastNameInitials(name)}
                    tooltipStyle="tooltip-style"
                    lblStyle="labelClass uppercase"
                    tagStyle="inline-custom"
                  >
                    <Avatar
                      size="sm"
                      title="User"
                      isRounded={true}
                      isDisabled={true}
                      icon={"plus"}
                      data={getNameInitials(name)}
                      imgStyle={"mb-1"}
                      btnStyle={"relative -top-px head-initial avatar-disabled"}
                      onClick={() => {}}
                    />
                  </Tooltip>
                }
              >
                <div className="w-28">
                  <div className="p-3.5 bg-gray-50">
                    <div className="flex justify-center mb-2 text-lg text-black-500">
                      {role}
                    </div>
                  </div>
                </div>
              </PopOverDialog> */}
            </div>
          </div>
        </div>
      </nav>
      <ErrorDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => onCloseClick()}
        dialogHeader={dialogHeader ? dialogHeader : "Are you sure you want to exit the onboarding?"}
        dialogDetail={dialogDetail}
        // ?dialogDetail:"We will save the step for onboarding onto platform soon. Lorem ipsum dummy text about this"
        confirmText="Exit"
        cancelBtn="Cancel"
      />
    </>
  );
};

export default OnboardingHeader;
