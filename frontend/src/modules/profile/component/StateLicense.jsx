/*
  *  File : StateLicense.js
 *   Description : A component for managing state licenses for agents in the profile module.
 * This component provides functionality to:
 * - View existing state licenses with details like license number, issued date, expiration date, state, and attached documents
 * - Add new state licenses through a modal form
 * - Update existing state licenses
 * - Upload and manage license documents
 * - Validate license data including:
 *   - Duplicate license number check
 *   - Required field validation
 *   - Date validation (expiration after issued date)
 *   - File upload requirements
 * 
 *  Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * @component
 * @param {Object} props
 * @param {Function} props.setLoading - Function to control loading state of parent component
 * @requires react
 * @requires react-redux
 * @requires react-router-dom
 * @requires lodash
 * 
 */

import React, { useEffect, useState } from "react";
import { Dropdown, TextInput } from "../../../ui-controls";
import { Avatar, Button, LinkButton } from "../../../ui-controls/index";
import { Modal } from "../../../ui-controls";
import { DocumentUploader } from "../../../ui-controls/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStateLicenseData,
  updateAgentStateLicense,
} from "../slice/profileSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { map } from "lodash";
import { dateFormat } from "../../../services/utils";
import { RESIDENTIAL_STATUS } from "../../../services/constants";

const StateLicense = ({ setLoading }) => {
  const { userData } = useSelector((state) => state?.signin || {});
  const { search } = useLocation();
  const dispatch = useDispatch();
  const selectedCountry = useSelector((state) => state?.admin?.selectedCountry);
  const agentId = new URLSearchParams(search).get("aid");
  const [licenses, setLicenses] = useState([
    {
      licenseNum: "",
      licensedOn: "",
      expires: "",
      state: "",
      residentialState: { name: "Yes", code: 1, slug: "yes" },
      file: [],
    },
  ]);
  const [originalStateLicenseData, setStateLicenseData] = useState([]);

  const [stateList, setStateList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    fetchStateLicenseData();

    setIsModalOpen(false);
    setErrors({});
  };
  useEffect(() => {
    fetchStateList();
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    setLoading(true);
    dispatch(fetchStateLicenseData({ agentId: agentId }))
      .then(
        (response) => {
          setLoading(false);
          if (response?.payload?.status === 200) {
            setStateLicenseData(response?.payload?.data?.data || []);
            setLicenses(response?.payload?.data?.data || []);
          }
        },
        (error) => {
          setLoading(false);
          console.log(error?.message);
        },
      )
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchStateList = () => {
    // Onboarding module removed; default to empty list so UI degrades safely.
    setStateList([]);
  };

  const isDuplicateLicenseNumber = (licenseNum, currentIndex, licenses) => {
    return licenses.some(
      (license, index) =>
        index !== currentIndex &&
        license.licenseNum.toLowerCase() === licenseNum.toLowerCase(),
    );
  };

  const validateField = (type, value, index) => {
    let errorMessage = "";

    switch (type) {
      case "licenseNum":
        if (!value || value.trim() === "") {
          errorMessage = "License number is required";
        } else if (isDuplicateLicenseNumber(value, index, licenses)) {
          errorMessage = "License number already exists";
        }
        break;
      case "licensedOn":
        if (!value) {
          errorMessage = "Issued date is required";
        }
        break;
      case "expires":
        if (!value) {
          errorMessage = "Expire date is required";
        } else if (
          licenses[index].licensedOn &&
          new Date(value) <= new Date(licenses[index].licensedOn)
        ) {
          errorMessage = "Expiration date must be after issued date";
        }
        break;
      case "state":
        if (!value) {
          errorMessage = "State is required";
        }
        break;
      case "residentialState":
        if (!value) {
          errorMessage = "Residential state is required";
        }
        break;
      case "file":
        if (!value || value.length === 0) {
          errorMessage = "Please upload a license document";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create FormData
      const formData = new FormData();

      // Append stringified array
      formData.append("licenses", JSON.stringify(licenses));

      // Example: append a file (if any exist in the 'file' field)
      licenses.forEach((license, index) => {
        if (license.file && license.file.length > 0) {
          formData.append(`file_${index}`, license.file[0].file); // Assuming file is an array and you want the first file
        }
      });
      formData.append("agentId", agentId);

      setLoading(true);
      dispatch(updateAgentStateLicense(formData)).then((res) => {
        if (res?.payload?.status === 200) {
          fetchProfileData();

          setIsModalOpen(false);
          setLoading(false);
        } else {
          setLoading(false);
          console.error(res.payload.message);
        }
      });
    }
  };

  const onChange = (e, type, index) => {
    const updatedLicenses = [...licenses];
    let value;

    // Handle different input types
    if (type === "licenseNum") {
      value = e.target.value;
      updatedLicenses[index].licenseNum = value;
    } else if (type === "licensedOn") {
      value = e.target.value;
      updatedLicenses[index].licensedOn = value;

      // If expiration date exists and is now invalid due to issued date change
      if (
        updatedLicenses[index].expires &&
        new Date(value) >= new Date(updatedLicenses[index].expires)
      ) {
        setErrors((prev) => ({
          ...prev,
          [`expires_${index}`]: "Expiration date must be after issued date",
        }));
      } else if (
        errors[`expires_${index}`] ===
        "Expiration date must be after issued date"
      ) {
        // Clear the error if it's now valid
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`expires_${index}`];
          return newErrors;
        });
      }
    } else if (type === "expires") {
      value = e.target.value;
      updatedLicenses[index].expires = value;
    } else if (type === "state") {
      value = e;
      updatedLicenses[index].state = value;
    } else if (type === "residentialState") {
      value = e;
      updatedLicenses[index].residentialState = value;
    } else if (type === "file") {
      value = e;
      updatedLicenses[index].file = value;
    }

    setLicenses(updatedLicenses);

    // Perform real-time validation
    const errorMessage = validateField(type, value, index);

    // Update errors state
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (errorMessage) {
        newErrors[`${type}_${index}`] = errorMessage;
      } else {
        delete newErrors[`${type}_${index}`];
      }
      return newErrors;
    });
  };

  const handleRemoveFile = (fileIndex, licenseIndex) => {
    const updatedLicenses = [...licenses];
    updatedLicenses[licenseIndex].file = updatedLicenses[
      licenseIndex
    ].file.filter((_, i) => i !== fileIndex);
    setLicenses(updatedLicenses);
  };

  const addAnotherLicense = () => {
    setLicenses([
      ...licenses,
      {
        licenseNum: "",
        licensedOn: "",
        expires: "",
        state: "",
        residentialState: RESIDENTIAL_STATUS[0], //default to "Yes"
        file: [],
      },
    ]);
  };
  const onRemoveForm = (index) => {
    // Don't allow removing if there's only one license form
    if (licenses.length <= 1) return;

    const updatedLicenses = licenses.filter((_, i) => i !== index);
    setLicenses(updatedLicenses);

    // Update errors to remove any references to this index
    const newErrors = {};
    Object.keys(errors).forEach((key) => {
      if (!key.endsWith(`_${index}`)) {
        newErrors[key] = errors[key];
      }
    });
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    licenses.forEach((license, index) => {
      // Validate License Number
      if (!license.licenseNum || license.licenseNum.trim() === "") {
        newErrors[`licenseNum_${index}`] = "License number is required";
        isValid = false;
      }

      // Validate Issued Date
      if (!license.licensedOn) {
        newErrors[`licensedOn_${index}`] = "Issued date is required";
        isValid = false;
      }

      // Validate Expire Date
      if (!license.expires) {
        newErrors[`expires_${index}`] = "Expire date is required";
        isValid = false;
      }

      // Validate State
      if (!license.state) {
        newErrors[`state_${index}`] = "State is required";
        isValid = false;
      }

      // Validate Residential State
      if (!license.residentialState) {
        newErrors[`residentialState_${index}`] =
          "Residential state is required";
        isValid = false;
      }

      // Validate File Upload
      if (!license.file || license.file.length === 0) {
        newErrors[`file_${index}`] = "Please upload a license document";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const findStateName = (state) => {
    const role = stateList?.find((value) => value?.code === state);
    return role ? role?.name : "";
  };
  const onHandleViewPdf = (event) => {
    const fileUrl = event?.licenseUrl;
    if (fileUrl !== "") {
      const pdfWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
      if (pdfWindow) {
        pdfWindow.focus();
      } else {
        console.error("Failed to open PDF in a new tab.");
      }
    }
  };
  return (
    <>
      <div className="mb-1.5 rounded-lg border border-gray-200 bg-white p-5">
        <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
          <div className="mb-3">
            <h2 className="text-txt-md-18 text-primary-theme-1 font-bold">
              State License
            </h2>
            <p className="text-txt-md-13 mt-3 text-justify font-medium text-[#707EAE] lg:w-5/6">
              Lorem ipsum dummy text a short explanation here Please complete
              this form if you have a new application to submit with ANICO. One
              form for the writing agent and one form for the split agent. To
              know how to set up this{" "}
              <span className="cursor-pointer text-blue-500 hover:underline">
                Click here
              </span>
            </p>
          </div>

          <div className="w-full md:justify-self-end lg:w-auto">
            <Button
              size="md"
              name="Add"
              isDisabled={false}
              isActive={true}
              onClick={() => handleModalOpen()}
              btnStyle="w-full bg-white border text-primary-theme-1 pt-[2px] !rounded-lg !h-[35.33px]  !text-primary-theme-1 shadow-sm !bg-white px-6 py-1 text-sm font-medium hover:bg-primary-theme-1 hover:text-white text-txt-md-14 font-semibold"
            />
          </div>
        </div>

        {map(originalStateLicenseData, (item, index) => (
          <div
            className="mt-5 grid grid-cols-2 gap-4 md:mt-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-5"
            key={index}
          >
            <div className="">
              <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                License Number
              </div>
              <div className="text-txt-md-13 font-medium text-[#202020]">
                {item?.licenseNum}
              </div>
            </div>
            <div className="">
              <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                Issued Date
              </div>
              <div className="text-txt-md-13 font-medium text-[#202020]">
                {dateFormat(item?.licensedOn, "DD MMM YYYY")}
              </div>
            </div>
            <div>
              <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                Expiration Date
              </div>
              <div className="text-txt-md-13 font-medium text-[#202020]">
                {dateFormat(item?.expires, "DD MMM YYYY")}
              </div>
            </div>
            <div>
              <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                State
              </div>
              <div className="text-txt-md-13 font-medium text-[#202020]">
                {findStateName(item?.state) || item?.state?.name || item?.state}
              </div>
            </div>
            <div>
              <div className="text-txt-md-14 font-semibold text-[#707EAE]">
                File
              </div>
              {item?.licenseUrl ? (
                <div
                  className="text-txt-md-14 cursor-pointer font-semibold text-[#1ABADC] hover:underline"
                  onClick={() => onHandleViewPdf(item)}
                >
                  View PDF
                </div>
              ) : (
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  --
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        dialogStyle="h-hp-400 !rounded-xl pt-3 update-profile-detail-modal"
        outerDivStyle=" !rounded-xl"
        closeModal={handleModalClose}
        visible={isModalOpen}
        title={"Update State License"}
        bodyStyle={" !max-w-3xl"}
      >
        <div className="scrollbar-hide max-h-[70vh] overflow-y-auto">
          {licenses.map((license, index) => (
            <div key={index} className="mb-6 border-b border-gray-200">
              <div className="flex justify-between">
                {index > 0 && (
                  <h3 className="text-txt-md-14 text-primary-theme-1 font-semibold">
                    License {index + 1}
                  </h3>
                )}
                {index > 0 && (
                  <button
                    onClick={() => onRemoveForm(index)}
                    className="font-semibold text-red-500 underline hover:text-red-700"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-x-0 gap-y-0 md:grid-cols-3 md:gap-x-4 md:gap-y-3">
                <div className="col-span-1">
                  <TextInput
                    id={`licenseNum_${index}`}
                    type="text"
                    placeholder={"Enter License Number"}
                    label={"License Number"}
                    name={`licenseNum_${index}`}
                    onChange={(e) => onChange(e, "licenseNum", index)}
                    value={license.licenseNum || ""}
                    inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                    labelClass={"!text-txt-md-12 font-semibold"}
                  />
                  <div className="mt-1 h-4">
                    {errors[`licenseNum_${index}`] && (
                      <div className="text-xs text-red-500">
                        {errors[`licenseNum_${index}`]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1">
                  <TextInput
                    id={`licensedOn_${index}`}
                    type="date"
                    placeholder={"Select Date"}
                    label={"Issued Date"}
                    name={`licensedOn_${index}`}
                    value={license.licensedOn || ""}
                    onChange={(e) => onChange(e, "licensedOn", index)}
                    inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                    labelClass={"!text-txt-md-12 font-semibold"}
                  />
                  <div className="mt-1 h-4">
                    {errors[`licensedOn_${index}`] && (
                      <div className="text-xs text-red-500">
                        {errors[`licensedOn_${index}`]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1">
                  <TextInput
                    id={`expires_${index}`}
                    type="date"
                    placeholder={"Expire Date"}
                    label={"Expire Date"}
                    name={`expires_${index}`}
                    value={license.expires || ""}
                    onChange={(e) => onChange(e, "expires", index)}
                    inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                    labelClass={"!text-txt-md-12 font-semibold"}
                  />
                  <div className="mt-1 h-4">
                    {errors[`expires_${index}`] && (
                      <div className="text-xs text-red-500">
                        {errors[`expires_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-0 gap-y-0 md:grid-cols-3 md:gap-x-4 md:gap-y-3">
                <div>
                  <label className="!text-txt-md-12 mb-1 block font-semibold">
                    State
                  </label>
                  <Dropdown
                    id={`state_${index}`}
                    optionLabel="name"
                    optionValue="name"
                    options={stateList}
                    isDisabled={!stateList?.length}
                    onChange={(e) => onChange(e, "state", index)}
                    name={`state_${index}`}
                    value={license.state || ""}
                    placeholder="Select State"
                    dropdownStyle="dropdown w-full"
                    menuStyle="menu"
                  />
                  <div className="mt-1 h-4">
                    {errors[`state_${index}`] && (
                      <div className="text-xs text-red-500">
                        {errors[`state_${index}`]}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="!text-txt-md-12 mb-1 block font-semibold">
                    Residential State?
                  </label>

                  <Dropdown
                    id={`residentialState_${index}`}
                    optionLabel="name"
                    optionValue="name"
                    options={RESIDENTIAL_STATUS}
                    onChange={(e) => onChange(e, "residentialState", index)}
                    name={`residentialState_${index}`}
                    value={license.residentialState || ""}
                    placeholder="Select Option"
                    dropdownStyle="dropdown w-full"
                    menuStyle="menu"
                  />
                  <div className="mt-1 h-4">
                    {errors[`residentialState_${index}`] && (
                      <div className="text-xs text-red-500">
                        {errors[`residentialState_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <DocumentUploader
                  files={license.file || []}
                  setFiles={(files) => onChange(files, "file", index)}
                  removeFile={(fileIndex) => handleRemoveFile(fileIndex, index)}
                  setErrors={setErrors}
                />
                <div className="mt-1 h-4">
                  {errors[`file_${index}`] && (
                    <div className="text-xs text-red-500">
                      {errors[`file_${index}`]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 flex justify-between">
          <button
            onClick={addAnotherLicense}
            className="text-primary-accent hover:text-links font-semibold underline"
            type="button"
          >
            + Add Another License
          </button>
        </div>
        <div className="mt-1">
          <Button
            size={"lg"}
            name={"Save"}
            isDisabled={false}
            isActive={true}
            onClick={handleSubmit}
            btnStyle={
              "w-full disabled:opacity-40 items-center flex justify-center rounded-md focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in text-txt-md-14 !h-10 pb-0.5 cursor-pointer"
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default StateLicense;
