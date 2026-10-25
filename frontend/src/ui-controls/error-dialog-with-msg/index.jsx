import React from "react";
import PropTypes from "prop-types";
import { Dialog, Avatar, Button, TextArea } from "../index";
import DangerCircle from "../../assets/icons/DangerCircle.svg";

const ErrorDialogWithMessage = ({
  visible,
  onClose,
  onConfirm,
  dialogHeader = "Confirmation",
  dialogDetail,
  confirmText = "Yes",
  cancelText = "No",
  successBtn = "",
  isSingleButtonDialog = false,
  showReasonInput = false,
  reason = "",
  reasonError="",
  setReason = () => {},
  reasonPlaceholder = "Enter rejection reason",
  title="Please enter a reason for rejecting the request."
}) => {
  return (
    <Dialog visible={visible} closeModal={onClose} dialogStyle="!rounded-2xl">
      <div className="text-center">
        <Avatar src={DangerCircle} />

        <div className="mt-4 text-lg font-medium text-black">
          {dialogHeader}
        </div>

        <div className="mt-2 mb-4 px-4 text-sm font-medium text-slate-500">
          {dialogDetail}
        </div>

        {showReasonInput && (
          <>
            <div className="mb-2 text-sm font-medium text-black">
              {title}
            </div>
            <TextArea
              placeholder={reasonPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus={true}
              textAreaStyle="!text-sm font-bold text-left input-field !h-15 leading-tight"
              onKeyDown={(e) => {
                if (e.key === "Enter" && reason) {
                  onConfirm();
                }
              }}
            />
            <div className="mt-1 h-4">
              {reasonError && (<div className="text-xs text-red-500">{reasonError}</div>)}
            </div>
          </>
        )}

        <div className="mt-4 flex justify-center gap-4">
          {isSingleButtonDialog ? (
            <Button
              name="Okay"
              onClick={onClose}
              isActive={true}
              btnStyle="pb-1 pl-4 pr-4 rounded-sm !text-white !bg-primary-theme"
            />
          ) : (
            <>
              <Button
                name={cancelText}
                onClick={onClose}
                isActive={true}
                btnStyle="pb-1 w-[131px] h-[34px] rounded-sm !text-black !bg-white"
              />
              <Button
                name={confirmText}
                onClick={() => {
                 //   onClose();
                 
                  onConfirm && onConfirm();
                }}
                isActive={true}
                isHoverEnable={false}
                isDisabled={showReasonInput && !reason} 
                btnStyle={`pb-1 w-[131px] h-[34px] rounded-sm bg-red-500 text-white border-none ${successBtn}`}
              />
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

ErrorDialogWithMessage.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  dialogHeader: PropTypes.string,
  dialogDetail: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isSingleButtonDialog: PropTypes.bool,
  successBtn: PropTypes.string,
  showReasonInput: PropTypes.bool,
  reason: PropTypes.string,
  setReason: PropTypes.func,
  reasonPlaceholder: PropTypes.string,
};

export default ErrorDialogWithMessage;
