/**
 * --------------------------------------------------------
 * Component   : BackButtonHeader
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
import { Cross, backArrow } from "../../assets";
import { useNavigate } from "react-router-dom";

const BackButtonHeader = ({
  children,
  isDisabled,
  isDialogBox,
  header,
  dialogHeader,
  dialogDetail,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const onBackClick = () => {
    if (isDialogBox) {
      setShowConfirmDialog(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <nav className="4xl:h-24 bg-primary-theme fixed top-0 z-10 w-full">
        <div className="flex px-6">
          <div className="flex items-center justify-center align-middle text-amber-50">
            <Avatar
              src={backArrow}
              onClick={() => onBackClick()}
              style={{ height: "30px", width: "30px", cursor: "pointer" }}
            />
            <Label
              label={header}
              size="lg"
              lblStyle={"!text-txt-29  ml-3 line-clamp-1"}
            />
          </div>

          <div className="flex-grow"></div>

          <div className="4xl:mt-5 relative w-52 flex-none">
            <div className="relative flex h-14 items-center justify-end"></div>
          </div>
        </div>
      </nav>

      <ErrorDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => navigate(-1)}
        dialogHeader={dialogHeader}
        dialogDetail={dialogDetail}
        confirmText="Exit"
        cancelBtn="Cancel"
      />
    </>
  );
};

export default BackButtonHeader;
