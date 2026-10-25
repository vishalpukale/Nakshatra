/**
 * --------------------------------------------------------
 * File        : CreateAgent.js
 * Description : Component for creating a new agent account.
 *               Includes form fields for user details, country/state
 *               selection, validation, and Redux integration.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-18
 * --------------------------------------------------------
 * Notes:
 * - Validates input for email, name, and location.
 * - Fetches and populates dynamic country/state lists.
 * - Uses Redux for account creation and form state.
 */

import React, { useEffect, useState } from "react";
import { Button, Dropdown, SearchableDropdown, TextInput } from "../../../ui-controls/index";
import { validateEmail, validateName } from "../../../services/utils";
import { createAgentAccount } from "../slice/signinSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_STATUS } from "../../../services/constants";
import { Acknowledge } from "../../../components";
import { Dialog } from "../../../ui-controls";
// onboarding country/state APIs removed — use inline placeholders

/**
 * CreateAgent component — form for registering an agent account.
 * @param {function} setLoading - Sets loading state from parent
 */
const CreateAgent = ({ setLoading }) => {
  const INITIAL_AGENT_STATE = {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
  };

  const [accountDetail, setAccountDetail] = useState(INITIAL_AGENT_STATE);
  const [errors, setErrors] = useState(INITIAL_AGENT_STATE);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useSelector(({ signin }) => signin);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [formConst, setFormConst] = useState({
    country: [],
    state: [],
  });

  /**
   * Closes the error dialog modal
   */
  const closeModal = () => {
    setOpenDialog(false);
  };

  /**
   * Fetches the list of countries on component mount
   */
  useEffect(() => {
    // onboarding endpoints removed during cleanup. Keep country list empty
    // or replace with a small static fallback if desired.
    setFormConst((prev) => ({ ...prev, country: [] }));
    setLoading(false);
  }, []);

  /**
   * Handles value change in form fields
   * @param {*} value - selected or typed value
   * @param {string} name - field name
   */
  const handleFormChange = (value, name) => {

    setAccountDetail((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));

    // If country changes, fetch corresponding states
    if (name === "country") {
      if (accountDetail.state.countryId !== value.id) {
        setAccountDetail((prevState) => ({ ...prevState, state: "" }));
        onSelectCountryOrState({ id: value.id });
      }
    }
  };

  /**
   * Fetches states for a selected country
   * @param {object} param0 - Country object with id
   */
  const onSelectCountryOrState = ({ id }) => {
    // onboarding state API removed — clear state list or provide static fallback
    setFormConst((prev) => ({ ...prev, state: [] }));
    setLoading(false);
  };

  /**
   * Updates form state on input typing
   * @param {Event} e - Input change event
   */
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    // ❗ List fields that should not allow whitespace
    const noWhitespaceFields = ["firstName", "lastName", "email"];

    let processedValue = value;
    if (noWhitespaceFields.includes(name)) {
      processedValue = value.replace(/\s/g, ""); // Remove all spaces (not just trim)
    }

    setAccountDetail((currState) => ({
      ...currState,
      [name]: processedValue,
    }));

    setErrors((currState) => ({
      ...currState,
      [name]: "",
    }));
  };


  /**
   * Validates form fields before submission
   * @returns {boolean} - true if valid, false otherwise
   */
  const validate = () => {
    const newErrors = {};

    // Use trimmed values for name validation to avoid errors from accidental spaces
    const trimmedFirstName = accountDetail?.firstName?.trim();
    const trimmedLastName = accountDetail?.lastName?.trim();
    const trimmedEmail = accountDetail?.email?.trim();

    if (!validateEmail(trimmedEmail) || !trimmedEmail) {
      newErrors.email = "Enter valid email";
    }
    if (!validateName(trimmedFirstName) || !trimmedFirstName) {
      newErrors.firstName = "Enter valid first name";
    }
    if (!validateName(trimmedLastName) || !trimmedLastName) {
      newErrors.lastName = "Enter valid last name";
    }
    if (!accountDetail?.country) {
      newErrors.country = "Country is required";
    }
    if (!accountDetail?.state) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission after validation
   */
  const onCreateAccount = () => {
    if (validate()) {
      onProceed();
    }
  };

  /**
   * Dispatches account creation action
   */
  const onProceed = () => {
    const authObj = {
      userId,
      firstName: accountDetail.firstName?.trim(),
      lastName: accountDetail.lastName?.trim(),
      email: accountDetail.email?.trim(),
      countryId: accountDetail.country?.id,
      stateId: accountDetail.state?.id,
    };

    setLoading(true);
    dispatch(createAgentAccount(authObj))
      .then((res) => {
        const { data, message } = res.payload?.data;
        setDialogMessage(message);

        if (res.payload.status === 200) {
          if (
            data?.user?.status === USER_STATUS.ONBOARDING ||
            data?.user?.status === USER_STATUS.ACTIVE
          ) {
            navigate("/agent", { replace: true });
          }
          setAccountDetail(INITIAL_AGENT_STATE);
          setLoading(false);
        } else {
          setLoading(false);
          setOpenDialog(true);
        }
      })
      .catch((err) => {
        setDialogMessage(message);
        setOpenDialog(true);
      });
  };

  const dropDownStyle =
    "dropdown w-full mt-1 px-0 !text-primary-theme-1 !font-[450] !text-txt-md-13";
  const mainStyle = "!border-gray-300 !rounded-sm-6";
  const itemStyle = "!text-primary-theme-1 !font-[450] !text-txt-md-13";

  return (
    <div className="w-full">
      <h5 className="text-txt-32 my-0 w-full !text-left font-bold md:text-center">
        Create Agent Account
      </h5>
      <div className="text-txt-md-14 text-links mb-4 w-full !text-left font-medium md:text-center">
        Give Basic details to create your account
      </div>
      <div className="!mt-auto w-full">
        <div className="position-relative mb-1">
          <TextInput
            id={"firstName"}
            type="text"
            isDisabled={false}
            placeholder={"Enter First Name"}
            label={"First Name"}
            name={"firstName"}
            onChange={inputChangeHandler}
            value={accountDetail.firstName}
            autoFocus={true}
            required
            inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
            labelClass={"!text-sm"}
            mainStyle={mainStyle}
            itemStyle={itemStyle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCreateAccount();
              }
            }}
          />
          {errors.firstName ? (
            <div className="text-txt-md-12 text-red-500">
              {errors.firstName}
            </div>
          ) : (
            <div className="mb-[22px]"></div>
          )}
        </div>
        <div className="position-relative mb-1">
          <TextInput
            id={"lastName"}
            type="text"
            isDisabled={false}
            placeholder={"Enter Last Name"}
            label={"Last Name"}
            name={"lastName"}
            onChange={inputChangeHandler}
            required
            value={accountDetail.lastName}
            inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
            labelClass={"!text-sm"}
            mainStyle={`mainStyle`}
            itemStyle={itemStyle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCreateAccount();
              }
            }}
          />
          {errors.lastName ? (
            <div className="text-txt-md-12 text-red-500">{errors.lastName}</div>
          ) : (
            <div className="mb-[22px]"></div>
          )}
        </div>

        <div className="position-relative mb-1">
          <TextInput
            id={"email"}
            type="text"
            placeholder={"Enter Email Address"}
            label={"Email"}
            name={"email"}
            onChange={inputChangeHandler}
            required
            value={accountDetail?.email?.trim() || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCreateAccount();
              }
            }}
            inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
            labelClass={"!text-sm"}
            mainStyle={mainStyle}
            itemStyle={itemStyle}
          />
          {errors.email ? (
            <div className="text-txt-md-12 text-red-500">{errors.email}</div>
          ) : (
            <div className="mb-[22px]"></div>
          )}
        </div>
        <div className="position-relative mb-1">
          <label className="label-sm text-color-text block text-sm">
            Country
          </label>
          <SearchableDropdown
            id="dropdown"
            placeholder="Country"
            options={formConst.country}
            optionLabel="name"
            optionValue="name"
            onChange={(e) => {
              handleFormChange(e, "country");
            }}
            name="country"
            value={accountDetail.country || ""}
            dropdownStyle={dropDownStyle}
            mainStyle={`md:!px-1.5 ${mainStyle}`}
            // menuStyle="menu !px-0 !py-0 md:text-center"
            iconStyle="!h-4 !w-4 !top-[0.66rem]"
            itemStyle={itemStyle}
          />
          {errors.country ? (
            <div className="text-txt-md-12 text-red-500">{errors.country}</div>
          ) : (
            <div className="mb-[22px]">{""}</div>
          )}
        </div>
        <div className="position-relative mb-1">
          <label className="label-sm text-color-text block text-sm">
            State
          </label>
          <SearchableDropdown
            id="dropdown"
            placeholder="State"
            options={formConst.state || []}
            optionLabel="name"
            optionValue="name"
            isDisabled={!accountDetail.country}
            onChange={(e) => {
              handleFormChange(e, "state");
            }}
            name="state"
            value={accountDetail.state || ""}
            dropdownStyle={dropDownStyle}
            mainStyle={`md:!px-1.5 ${mainStyle}`}
            // menuStyle="menu !px-0 !py-0 md:text-center"
            iconStyle="!h-4 !w-4 !top-[0.66rem]"
            itemStyle={itemStyle}
          />
          {errors.state ? (
            <div className="text-txt-md-12 text-red-500">{errors.state}</div>
          ) : (
            <div className="mb-[23px]">{""}</div>
          )}
        </div>
        <div>
          <Button
            size={"md"}
            name={"Create Account"}
            isDisabled={false}
            isActive={true}
            btnStyle={
              "w-full mt-1 disabled:opacity-40 items-center flex justify-center rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in text-sm h-hp-32 pb-0.5 cursor-pointer"
            }
            onClick={onCreateAccount}
          />
        </div>
        <Dialog
          dialogStyle="error-dialog"
          closeModal={closeModal}
          visible={isOpenDialog}
        >
          <Acknowledge
            message={dialogMessage}
            errorIcon={"icon-URL-not-found1"}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default CreateAgent;
