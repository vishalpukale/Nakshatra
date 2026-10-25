/**
 *  File : DirectDepositInfo.jsx
 *  Description :
 *   This React component displays and manages the user's direct deposit (bank account) information.
 *   It allows users to view their saved bank details (bank name, account type, routing number, and account number)
 *   and provides a modal form to update or add new direct deposit information.
 *   The component handles form validation, error display, and communicates with Redux actions to fetch and update data.
 *   It also provides user feedback via toast notifications and supports truncated display with tooltips for long values.
 *
 *   Main features:
 *   - Fetches and displays current direct deposit info for a user/agent.
 *   - Allows updating or adding bank details via a modal form.
 *   - Validates input fields (bank name, account type, routing and account numbers).
 *   - Integrates with Redux for data fetching and updating.
 *   - Provides user feedback and error handling.
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * @component
 * @module DirectDepositInfo
 * @prop {Function} setLoading - Function to set loading state in parent.
 * @prop {boolean} isPaymentModalOpen - Controls visibility of the modal.
 * @prop {Function} setIsPaymentModalOpen - Function to open/close the modal.
 * @prop {Function} fetchNotificationData - Function to refresh notification data after update.
 */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Avatar, Button, Tooltip } from "../../../ui-controls/index";
import { Wallet } from "../../../assets";
import { Modal, Dropdown } from "../../../ui-controls";
import { TextInput } from "../../../ui-controls";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchActivityLog,
  fetchDirectDepositData,
  updateDirectDepositData,
} from "../slice/profileSlice";
import _ from "lodash";
import { toast } from "react-toastify";
import { accountTypes } from "../../../services/constants";
import TooltipCommon from "../../../ui-controls/tooltip";
import { CloseEye, OpenEye } from "../../../assets";
// onboarding module removed — functionality stubbed locally
import TruncatedTooltip from "../../../ui-controls/truncated-tooltip";

const DirectDepositInfo = ({
  setLoading,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  fetchNotificationData,
  isProfileAccess,
  isAgentProfile,
  userData,
}) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const agentId = new URLSearchParams(search).get("aid");
  const newAgentId = parseInt(agentId, 10);
  const userId = new URLSearchParams(search).get("id");
  const [formErrors, setFormErrors] = useState({});
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountType: "",
    routingNum: "",
    accountNum: "",
  });
  const [savedBankDetails, setSavedBankDetails] = useState({});
  const [tempSavedBankDetails, setTempSavedBankDetails] = useState(false);

  const [isBankDetailsVisible, setIsBankDetailsVisible] = useState({
    routingNum: false,
    accountNum: false,
  });
  useEffect(() => {
    fetchBankAccountDetails();
  }, []);

  const fetchBankAccountDetails = () => {
    dispatch(fetchDirectDepositData({ agentId }))
      .then((response) => {

        const data = response?.payload?.data?.data;
        if (response?.payload?.status === 200 && data) {
          const { bankName, accountType, routingNum, accountNum } = data;
          setTempSavedBankDetails(response?.payload?.data?.isDataExist)
          const matchedAccountType = accountTypes?.find(
            (status) => status?.key === +accountType,
          );

          const updatedDetails = {
            bankName,
            accountType: matchedAccountType,
            routingNum,
            accountNum,
          };

          setSavedBankDetails(data);
          setBankDetails((prev) => ({ ...prev, ...updatedDetails }));
        }
      })
      .catch((error) => {
        console.error("Error fetching bank details:", error);
      });
  };

  const handleModalOpen = () => {
    setIsPaymentModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    setFormErrors({});
    setIsBankDetailsVisible({
      routingNum: false,
      accountNum: false,
    });
    const { bankName, accountType, routingNum, accountNum } =
      savedBankDetails || {};
    const matchedAccountType = accountTypes?.find(
      (status) => status?.key === +accountType,
    );
    setBankDetails((prev) => ({
      ...prev,
      bankName,
      accountType: matchedAccountType,
      routingNum,
      accountNum,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};

    // Real-time validation for bankName and accountType
    if (name === "bankName" && value) {
      if (containsEmoji(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: `${name === "bankName" ? "Bank name" : "Account type"}  must contain only alphabet`,
        }));
        return; // Prevent setting invalid value
      }
    }
    if ((name === "routingNum" || name === "accountNum") && value) {
      const onlyNumbersRegex = /^\d+$/; // Matches digits only

      if (!onlyNumbersRegex.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: `${name === "routingNum" ? "Routing number" : "Account number"} must contain only numbers`,
        }));
        return;
      }
    }

    // const sanitizedValue =
    //   name === "routingNum" || name === "accountNum"
    //     ? value?.replace(/[^0-9]/g, "")
    //     : value;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is valid
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const containsEmoji = (str) => {
    // Unicode ranges for emojis
    const emojiRegex =
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

    return emojiRegex.test(str);
  };

  const maskValue = (value) => {
    if (!value) return "--";
    if (value.length <= 4) return "*".repeat(value.length);
    return "*".repeat(value.length - 4) + value.slice(-4);
  };

  const validateBankDetails = () => {
    const newErrors = {};

    // Use trimmed bank name for validation to avoid errors from accidental spaces
    const trimmedBankName = bankDetails?.bankName?.trim();

    // Bank name validation
    if (!trimmedBankName) {
      newErrors.bankName = "Bank name is required";
    }

    // Account type validation
    // if (!bankDetails?.accountType?.trim()) {
    //   newErrors.accountType = "Account Type is required";
    // }

    // Account number validation
    if (isBankDetailsVisible?.accountNum && !bankDetails?.accountNum?.trim()) {
      newErrors.accountNum = "Account number is required";
    } else if (
      isBankDetailsVisible?.routingNum &&
      !/^\d+$/.test(bankDetails?.accountNum)
    ) {
      newErrors.accountNum = "Account number must contain only digits";
    }
    //  else if (bankDetails.accountNum.length < 8 || bankDetails.accountNum.length > 17) {
    //   newErrors.accountNum = "Account number must be between 8 and 17 digits";
    // }

    // Routing number validation
    if (!bankDetails?.routingNum?.trim()) {
      newErrors.routingNum = "Routing number is required";
    }
    //  else if (!/^\d{9}$/.test(bankDetails.routingNum)) {
    //   newErrors.routingNum = "Routing number must be exactly 9 digits";
    // }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit updated bank info to API
   */
  const handleFormSubmit = () => {
    if (checkFormChanges()) {
      setIsPaymentModalOpen(false);
      return;
    }

    if (validateBankDetails()) {
      const { routingNum, accountNum } = bankDetails || {};
      const updateParams = {
        id: savedBankDetails?.id,
        bankName: bankDetails?.bankName?.trim(),
        accountType: parseFloat(bankDetails?.accountType.key),
        // routingNum: bankDetails?.routingNum,
        // accountNum: bankDetails?.accountNum,
        agentId: newAgentId,
        updatedBy: parseFloat(userId),
        userId: parseFloat(userId),
      };
      if (isBankDetailsVisible.routingNum) {
        updateParams.routingNum = routingNum;
      }
      if (isBankDetailsVisible.accountNum) {
        updateParams.accountNum = accountNum;
      }
      if(!tempSavedBankDetails){
        updateParams.routingNum = routingNum;
        updateParams.accountNum = accountNum;
      }
      dispatch(updateDirectDepositData(updateParams))
        .then(({ payload }) => {
          if (payload?.status === 200) {
            toast.success("Bank Details Added Successfully.", {
              theme: "colored",
            });
            setIsBankDetailsVisible({
              routingNum: false,
              accountNum: false,
            });
            fetchBankAccountDetails();
            setIsPaymentModalOpen(false);
            fetchNotificationData();
            dispatch(fetchActivityLog({ userId }));
          }
        })
        .catch((error) => {
          console.log("Error in updating Deposit Info.", error?.message);
          toast.error("Something Went Wrong. Try Again Later.", {
            theme: "colored",
          });
        })
        .finally(() => {
        });
    }
  };

  /**
   * Compare current form values with saved values to avoid redundant update
   */
  const checkFormChanges = () => {
    const previousData = {
      bankName: savedBankDetails?.bankName,
      accountType: +savedBankDetails?.accountType,
      routingNumber: savedBankDetails?.routingNum,
      accountNumber: savedBankDetails?.accountNum,
    };

    const currentData = {
      bankName: bankDetails?.bankName,
      accountType: bankDetails?.accountType?.key,
      routingNumber: bankDetails?.routingNum,
      accountNumber: bankDetails?.accountNum,
    };

    return _.isEqual(previousData, currentData);
  };

  /**
   * On dropdown change (account type), update state and clear error
   */
  const handleFormFieldChange = (value, name) => {
    setBankDetails((prevState) => ({ ...prevState, [name]: value }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const dropDownStyle =
    "dropdown w-full mt-1 px-0 !text-primary-theme-1 !font-[450] !text-txt-md-13";
  const mainStyle = "!border-gray-300 !rounded-sm-6 !text-txt-md-13";
  const itemStyle = "!text-primary-theme-1 !font-[450] !text-txt-md-13";
  let accountTypeValue = accountTypes?.find(
    (status) => status?.key === +savedBankDetails?.accountType,
  );

  // const isTruncatedBankName = savedBankDetails?.bankName?.length > 10;
  // const bankName = isTruncatedBankName
  //   ? `${savedBankDetails?.bankName?.slice(0, 10)}...`
  //   : savedBankDetails?.bankName;

  // const isTruncatedAccountNum = savedBankDetails?.accountNum?.length > 18;
  // const accountNum = isTruncatedAccountNum
  //   ? `${savedBankDetails?.accountNum?.slice(0, 18)}...`
  //   : savedBankDetails?.accountNum;

  const isTruncated = savedBankDetails?.bankName?.length > 15;
  const displayName = isTruncated
    ? `${savedBankDetails?.bankName.slice(0, 14)}...`
    : savedBankDetails?.bankName || "--";

  const isTruncatedAccountNum = savedBankDetails?.accountNum?.length > 15;
  const displayNameAccountNum = isTruncatedAccountNum
    ? `${savedBankDetails?.accountNum?.slice(0, 14)}...`
    : savedBankDetails?.accountNum || "--";

  const handleBankDetailsDisplay = (type) => {
    setIsBankDetailsVisible((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    // Previously this dispatched `showBankDetails` from onboarding slice.
    // That module has been removed. Keep a local stub that simply toggles
    // visibility and does not attempt any server-side reveal.
    // If server reveal is required, reintroduce a dedicated API call.
    setLoading(false);
  };
  return (
    <>
      {/* <div className="mt-1 h-fit rounded-lg border border-gray-200 bg-white p-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-hide"> */}
      {/* Direct Deposit Info */}
      <div className="">
        <div className="-mx-4 mt-6 mb-4 border-b border-gray-200"></div>
        <div className="mb-2 grid grid-cols-[1fr_auto] items-center">
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <span>
              <Avatar
                size={"xs"}
                onClick={() => {
                  /* setShowConfirmDialog(true) */
                }}
                src={Wallet}
              />
            </span>
            <span className="text-txt-md-14 text-black-500 font-semibold">
              <h3>Direct Deposit Info</h3>
            </span>
          </div>
         {(isProfileAccess || isAgentProfile) && ( <button
            onClick={() => handleModalOpen()}
            className="text-txt-md-14 text-primary-accent cursor-pointer font-semibold hover:underline"
          >
            Update
          </button>)}
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-txt-md-14 text-primary-theme-1 font-medium">
              Bank Name
            </span>

            <span className="text-txt-md-14 flex items-center justify-end gap-2 text-right font-medium text-[#707EAE]">
               <div className="min-w-0 flex-1">
          <TruncatedTooltip
            text={savedBankDetails?.bankName} 
            className=" cursor-pointer"/>
        </div>
              {/* {isTruncated ? (
                <TooltipCommon label={savedBankDetails?.bankName} id="34">
                  {" "}
                  <span className="block max-w-[110px] truncate">
                    {displayName}
                  </span>
                </TooltipCommon>
              ) : (
                <span className="">{displayName}</span>
              )} */}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-txt-md-14 text-primary-theme-1 font-medium">
              Account Type
            </span>
            <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
              {accountTypeValue?.name || "--"}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-txt-md-14 text-primary-theme-1 font-medium">
              Routing Number
            </span>
            {/* <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
              {savedBankDetails?.routingNum
                ? savedBankDetails?.routingNum
                : "--"}
            </span> */}
            <div className="grid grid-cols-[1fr_auto] items-center justify-items-end gap-2">
              <div className="text-txt-md-14 font-medium text-[#707EAE]">
                {/* {savedBankDetails?.routingNum
                  ? isBankDetailsVisible.routingNum
                    ? savedBankDetails.routingNum
                    : maskValue(savedBankDetails.routingNum)
                  : "--"} */}
                {bankDetails?.routingNum
                  ? isBankDetailsVisible.routingNum
                    ? bankDetails.routingNum
                    : maskValue(bankDetails.routingNum)
                  : "--"}
              </div>
              {savedBankDetails?.routingNum && (isProfileAccess || isAgentProfile) ? (
                <img
                  src={!isBankDetailsVisible.routingNum ? CloseEye : OpenEye}
                  alt="Toggle visibility"
                  className="h-[17px] w-[18px] cursor-pointer"
                  onClick={() => handleBankDetailsDisplay("routingNum")}
                />
              ): null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-txt-md-14 text-primary-theme-1 font-medium">
              Account Number
            </span>
            <div className="grid grid-cols-[1fr_auto] items-center justify-items-end gap-2">
              <div className="text-txt-md-14 font-medium text-[#707EAE]">
                {/* {savedBankDetails?.accountNum
                  ? isBankDetailsVisible.accountNum
                    ? savedBankDetails.accountNum
                    : maskValue(savedBankDetails.accountNum)
                  : "--"} */}
                {bankDetails?.accountNum
                  ? isBankDetailsVisible.accountNum
                    ? bankDetails.accountNum
                    : maskValue(bankDetails.accountNum)
                  : "--"}
              </div>
              {savedBankDetails?.accountNum && (isProfileAccess || isAgentProfile) ? (
                <img
                  src={!isBankDetailsVisible.accountNum ? CloseEye : OpenEye}
                  alt="Toggle visibility"
                  className="h-[17px] w-[18px] cursor-pointer"
                  onClick={() => handleBankDetailsDisplay("accountNum")}
                />
              ): null}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      <Modal
        dialogStyle="h-hp-400 !rounded-xl pt-3 update-profile-detail-modal"
        outerDivStyle=" !rounded-xl"
        closeModal={handleModalClose}
        visible={isPaymentModalOpen}
        title={`${Object.keys(savedBankDetails || {})?.length ? "Update" : "Add"} Direct Deposit Info`}
        // bodyStyle={" !max-w-3xl"}
      >
        <div className="">
          <div className="md:gap-4">
            <div className="">
              <TextInput
                id={"bankName"}
                type="text"
                placeholder={"Enter Bank Name"}
                label={"Bank Name"}
                name={"bankName"}
                onChange={handleInputChange}
                value={bankDetails?.bankName || ""}
                maxLength={50}
                isRequired={true}
                autoFocus={true}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass={"!text-txt-md-12 font-semibold"}
              />
              <div className="mt-1 h-4">
                {formErrors.bankName && (
                  <div className="text-xs text-red-500">
                    {formErrors.bankName}
                  </div>
                )}
              </div>
            </div>
            <div className="">
              {/* <TextInput
                id={"accountType"}
                type="text"
                placeholder={"Enter Account Type"}
                label={"Account Type"}
                name={"accountType"}
                value={bankDetails?.accountType || ""}
                onChange={handleInputChange}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass={"!text-txt-md-12 font-semibold"}
              /> */}
              <div>
                <label className="text-color-text !text-txt-md-12 block font-semibold">
                  Account Type
                </label>
              </div>
              <Dropdown
                id="accountType"
                name="accountType"
                value={bankDetails?.accountType || {}}
                placeholder="Select Account Type"
                options={accountTypes}
                optionLabel="name"
                optionValue="key"
                onChange={(e) => {
                  handleFormFieldChange(e, "accountType");
                }}
                dropdownStyle={dropDownStyle}
                mainStyle={`md:!px-1.5 md!py-2.5 ${mainStyle}`}
                menuStyle="menu !px-0 !py-0"
                iconStyle="!h-4 !w-4 !top-[0.66rem]"
                itemStyle={itemStyle}
                maxLength={250}
              />

              <div className="mt-1 h-4">
                {formErrors.accountType && (
                  <div className="text-xs text-red-500">
                    {formErrors.accountType}
                  </div>
                )}
              </div>
            </div>
            <div className="">
              <TextInput
                id={"routingNum"}
                type={"text"}
                placeholder={"Enter Routing Number"}
                label={"Routing Number"}
                name="routingNum"
                value={bankDetails?.routingNum || ""}
                onChange={handleInputChange}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass={"!text-txt-md-12 font-semibold"}
                maxLength={12}
                isRequired={true}
                isIconVisible={tempSavedBankDetails === false ? false :true}
                imageIcon={
                  !isBankDetailsVisible.routingNum ? CloseEye : OpenEye
                }
                handleHideAndShow={() => handleBankDetailsDisplay("routingNum")}
                isDisabled={tempSavedBankDetails === false ? false:!isBankDetailsVisible?.routingNum ? true : false}
              />
              <div className="mt-1 h-4">
                {formErrors.routingNum && (
                  <div className="text-xs text-red-500">
                    {formErrors.routingNum}
                  </div>
                )}
              </div>
            </div>
            <div className="">
              <TextInput
                id={"accountNum"}
                type={"text"}
                placeholder={"Enter Account Number"}
                label={"Account Number"}
                name="accountNum"
                value={bankDetails?.accountNum || ""}
                onChange={handleInputChange}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass={"!text-txt-md-12 font-semibold"}
                maxLength={20}
                isRequired={true}
                isIconVisible={tempSavedBankDetails === false ? false :true}
                imageIcon={
                  !isBankDetailsVisible.accountNum ? CloseEye : OpenEye
                }
                handleHideAndShow={() => handleBankDetailsDisplay("accountNum")}
                isDisabled={tempSavedBankDetails === false ? false :  !isBankDetailsVisible?.accountNum ? true : false}
              />
              <div className="mt-1 h-4">
                {formErrors.accountNum && (
                  <div className="text-xs text-red-500">
                    {formErrors.accountNum}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="-mx-4 mt-2 mb-4 border-b border-gray-200"></div>
        <div className="mt-3 grid">
          <div className="grid grid-cols-2 gap-4 md:justify-self-end">
            <Button
              size="md"
              name="Cancel"
              isDisabled={false}
              isActive={true}
              onClick={handleModalClose}
              btnStyle="sm:w-full md:w-[120px] border border-[#1F3E63] !text-[#1F3E63] bg-white hover:bg-gray-50 rounded-md font-medium text-txt-md-14 !h-9"
            />
            <Button
              size="md"
              name="Save"
              isDisabled={false}
              isActive={true}
              onClick={handleFormSubmit}
              btnStyle="sm:w-full md:w-[120px] bg-[#1F3E63] text-white hover:bg-[#173250] rounded-md font-medium text-txt-md-14 !h-9"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DirectDepositInfo;
