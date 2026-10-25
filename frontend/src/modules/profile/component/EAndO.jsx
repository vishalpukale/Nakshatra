/**
 *  File : EAndO.jsx
 * Description :
 * This React component provides the UI and logic for managing Errors and Omissions (E&O) insurance information for agents.
 * It allows users to view, add, and update E&O policy details, including policy number, start and expiration dates, case and total limits, and uploading policy certificate files.
 * The component supports both agent and back-office/admin roles, with additional edit capabilities for back-office agents.
 * It integrates with Redux for state management, uses custom UI controls, and provides form validation, file upload, and feedback via toast notifications.
 * 
 * Main Features:
 * - Fetch and display a list of E&O policies for a given agent.
 * - Add new E&O policy or edit existing ones via a modal form.
 * - Validate form fields and uploaded files.
 * - Upload and preview policy certificate files (PDF/image).
 * - Navigate to E&O instructions based on user role.
 * - Responsive and accessible UI with tooltips and error messages.
 * 
 *  *  Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29
 *

 */
import React, { useEffect, useState } from "react";
import { Avatar, CustomDatePicker, TextInput } from "../../../ui-controls";
import { Button } from "../../../ui-controls/index";
import { Modal } from "../../../ui-controls";
import { DocumentUploader } from "../../../ui-controls/index";
import { fetchEAndOData, updateAgentEAndO } from "../slice/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  dateFormat,
  formatAmount,
  truncateByChars,
} from "../../../services/utils";
import _, { map } from "lodash";
import { editIcon } from "../../../assets";
import { toast } from "react-toastify";
import TooltipCommon from "../../../ui-controls/tooltip";
import TruncatedTooltipCell from "../../../ui-controls/new-tooltip";
// const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes
const EAndO = ({ setLoading, isBackOfficeAgent, isComplianceAccess }) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agentId = new URLSearchParams(search).get("aid");
  const userId = new URLSearchParams(search).get("id");

  const [basicDetails, setBasicDetails] = useState({
    EONumber: "",
    startDate: "",
    endDate: "",
    file: [],
    caseLimit: "",
    totalLimit: "",
    isActive: true,
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [eAndOList, setEAndOList] = useState([]);
  const [originalEAndOObject, setOriginalEAndOObject] = useState({});
  const { userData } = useSelector((state) => state?.signin || {});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    setLoading(true);
    dispatch(fetchEAndOData({ agentId: agentId, userCountryCompanyId: userData.countryCompanyId}))
      .then(
        (response) => {
          setLoading(false);
          if (response?.payload?.status === 200) {
            setEAndOList(response?.payload?.data?.data);
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

  const validateForm = () => {
    const newErrors = {};

    if (!basicDetails.EONumber) {
      newErrors.EONumber = "E&O Number is required";
    }
    if (!basicDetails.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!basicDetails.endDate) {
      newErrors.endDate = "Expiration date is required";
    }
    if (!basicDetails.file.length) {
      newErrors.file = "Please upload at least one file";
    }
    if (
      basicDetails.startDate &&
      basicDetails.endDate &&
      new Date(basicDetails.startDate) > new Date(basicDetails.endDate)
    ) {
      newErrors.endDate = "End date cannot be before the start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalOpen = () => {
    setBasicDetails({
      EONumber: "",
      startDate: "",
      endDate: "",
      caseLimit: "",
      totalLimit: "",
      file: [],
      isActive: false,
    });
    setErrors({});
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    // fetchProfileData();
    setIsModalOpen(false);
    setErrors({});
    // setBasicDetails({
    //   EONumber: "",
    //   startDate: "",
    //   endDate: "",
    //   file: [],
    // });
  };
  const onChange = (e) => {
    const { name, value } = e?.target || {};
    const sanitizedValue =
      name === "EONumber"
        ? value
          // Remove all spaces
          .replace(/\s+/g, "")
          // Convert to uppercase
          .toUpperCase()
          // Remove anything that's not a capital letter, digit, or hyphen
          .replace(/[^A-Z0-9-]/g, "")
          // Remove hyphen if it's the first character
          .replace(/^-/, "")
        : name === "caseLimit" || name === "totalLimit"
          ? value?.replace(/[^0-9]/g, "")
          : value;
    setBasicDetails((currState) => {
      return {
        ...currState,
        [name]: sanitizedValue,
      };
    });

    setErrors((currState) => {
      return {
        ...currState,
        [name]: "",
      };
    });
  };

  const onStartDateChange = (e) => {
    setBasicDetails((currState) => {
      return {
        ...currState,
        startDate: e,
      };
    });
    setErrors((currState) => {
      return {
        ...currState,
        startDate: "",
      };
    });
  };
  const onEndDateChange = (e) => {
    setBasicDetails((currState) => {
      return {
        ...currState,
        endDate: e,
      };
    });
    setErrors((currState) => {
      return {
        ...currState,
        endDate: "",
      };
    });
  };

  const handleFileChange = (fileArray) => {
    setBasicDetails((currState) => ({
      ...currState,
      file: fileArray,
    }));

    if (fileArray.length > 0) {
      setErrors((currState) => ({
        ...currState,
        file: "",
      }));
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = basicDetails.file.filter((_, i) => i !== index);
    setBasicDetails((currState) => ({
      ...currState,
      file: updatedFiles,
    }));
    setErrors((currState) => ({
      ...currState,
      file: "",
    }));
  };
  const handleSubmit = () => {
    if (basicDetails.isActive && hasFormChanged()) {
      setIsModalOpen(false);
      return;
    }

    if (validateForm()) {
      // Perform the submit action here
      const formPayload = new FormData();
      formPayload.append("agentId", agentId || "");
      formPayload.append("EONumber", basicDetails.EONumber);
      formPayload.append("startDate", basicDetails.startDate);
      formPayload.append("endDate", basicDetails.endDate);
      formPayload.append("caseLimit", basicDetails.caseLimit);
      formPayload.append("totalLimit", basicDetails.totalLimit);
      formPayload.append("userId", userId || "");
      // formPayload.append("id", originalEAndOObject?.id);

      if (basicDetails.file[0]?.file) {
        formPayload.append("file", basicDetails.file[0].file);
      }
      if (basicDetails.isActive) {
        formPayload.append("id", originalEAndOObject?.id);
      }
      setLoading(true);
      dispatch(updateAgentEAndO(formPayload)).then((res) => {
        if (res?.payload?.status === 200) {
          fetchProfileData();
          setLoading(false);
          setIsModalOpen(false);
          toast.success(
            `Certificate ${originalEAndOObject.id ? "Updated" : "Added"} Successfully.`,
            {
              theme: "colored",
            },
          );
        } else {
          setLoading(false);
          console.error(res.payload.message);
          toast.error("Something went wrong. Try again later", {
            theme: "colored",
          });
        }
      });
    }
  };

  const onHandleViewPdf = (event) => {
    const fileUrl = event?.policyUrl;
    if (fileUrl !== "") {
      const pdfWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
      if (pdfWindow) {
        pdfWindow.focus();
      } else {
        console.error("Failed to open PDF in a new tab.");
      }
    }
  };

  const handleEditEAndO = (item) => {
    const mimeMap = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      pdf: "application/pdf",
    };
    const mimeType = mimeMap[item?.policyUrl?.split(".")?.pop()];

    let file = item?.policyUrl
      ? [
        {
          file: {},
          name: item?.policyUrl?.split("/")?.pop(),
          preview: item?.policyUrl,
          size: "",
          type: mimeType,
        },
      ]
      : [];

    setOriginalEAndOObject({
      ...item,
      file: file,
    });

    setBasicDetails({
      EONumber: item.policyNo || "",
      startDate: item?.startedOn || "",
      endDate: item.expiresOn || "",
      file: file,
      caseLimit: item?.caseLimit || "",
      totalLimit: item?.totalLimit || "",
      isActive: true,
    });

    setIsModalOpen(true);
  };

  const hasFormChanged = () => {
    const previousData = {
      EONumber: originalEAndOObject.EONumber || "",
      startDate: originalEAndOObject?.startDate || "",
      endDate: originalEAndOObject.endDate || "",
      file: originalEAndOObject?.file instanceof File || false,
      caseLimit: originalEAndOObject?.caseLimit || "",
      totalLimit: originalEAndOObject?.totalLimit || "",
    };

    const currentData = {
      EONumber: basicDetails.EONumber || "",
      startDate: basicDetails?.startDate || "",
      endDate: basicDetails.endDate || "",
      file: basicDetails?.file[0]?.file instanceof File || false,
      caseLimit: basicDetails?.caseLimit || "",
      totalLimit: basicDetails?.totalLimit || "",
    };

    return _.isEqual(previousData, currentData);
  };

  const handleNavigateToInstruction = () => {
    if (!isBackOfficeAgent) {
      navigate(`/agent/instructions?code=${"EAO"}`);
    } else {
      navigate(`/admin/instructions?code=${"EAO"}`);
    }
  };
  return (
    <>
      <div className="mb-1.5 rounded-br-lg rounded-bl-lg border-gray-200 bg-white p-5 pt-3">
        <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
          <div className="mb-3">
            <h2 className="text-txt-md-18 text-primary-theme-1 font-bold">
              E&O Setup
            </h2>
            <p className="text-txt-md-13 word-break mt-3 text-justify font-medium text-links lg:w-[55vw]">
              All agents with an active license are required to carry an active
              GFI Errors and Omission (E&O) Insurance. Upload your existing E&O
              policy certificate{" "}
              <span
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => handleNavigateToInstruction()}
              >
                Click here
              </span>
            </p>
          </div>
        {isComplianceAccess && (<div className="w-full md:justify-self-end lg:w-auto">
            <Button
              size="md"
              name="Add"
              isActive={true}
              onClick={() => handleModalOpen()}
              btnStyle="w-full bg-white border text-primary-theme-1 pt-[2px] !rounded-lg !h-[35.33px]  !text-primary-theme-1 shadow-sm !bg-white px-6 py-1 text-sm font-medium hover:bg-primary-theme-1 hover:text-white text-txt-md-14 font-semibold"
            />
          </div>)}
        </div>

        {map(eAndOList, (item, index) => {
          return (
            <div
              key={index}
              className={`relative mt-3 grid grid-cols-2 items-start gap-4 border-b border-gray-200 pb-2 md:grid-cols-3 lg:static lg:mt-2 lg:grid-cols-[repeat(6,1fr)_auto] lg:gap-5 ${index !== 0 && "mt-10"}`}
            >
              <div>
                <div className="text-txt-md-12 font-semibold text-links">
                  E&O Number
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {item?.policyNo?.length > 13 ? (
                    <TooltipCommon
                      label={item?.policyNo}
                      id={`${index}-eo-policy-tooltip`}
                    >
                      <span className="block max-w-[120px] truncate text-sm">
                        {truncateByChars(item?.policyNo, 13)}
                      </span>
                    </TooltipCommon>
                  ) : (
                    <span className="text-sm">{item?.policyNo || "--"}</span>
                  )}
                  {/* {
                    <TruncatedTooltipCell
                      value={item?.policyNo}
                      rowId={index}
                      direction="right"
                      tooltipIdPrefix="eno-tooltip"
                    />
                  } */}
                </div>
              </div>
              <div className="">
                <div className="text-txt-md-12 font-semibold text-links">
                  Start Date
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {dateFormat(item?.startedOn, "DD MMM YYYY")}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-links">
                  Expiration Date
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {dateFormat(item?.expiresOn, "DD MMM YYYY")}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-links">
                  Case Limit
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {formatAmount(item?.caseLimit)}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-links">
                  Total Limit
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {formatAmount(item?.totalLimit)}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-links">
                  File
                </div>
                {item?.policyUrl ? (
                  <div
                    className="text-txt-md-14 cursor-pointer font-semibold text-[#1ABADC] hover:underline"
                    onClick={() => onHandleViewPdf(item)}
                  >
                    View PDF
                  </div>
                ) : (
                  <div className="text-txt-md-12 font-semibold text-links">
                    --
                  </div>
                )}
              </div>
              {isBackOfficeAgent && isComplianceAccess ? (
                <div className="absolute top-[-8px] right-[-18px] md:top-[-12px] md:right-0 lg:static lg:w-17">
                  <Avatar
                    size="xs"
                    title="Edit E&O"
                    src={editIcon}
                    btnStyle="relative w-13 h-13 -top-px head-initial avatar-disabled cursor-pointer"
                    onClick={() => handleEditEAndO(item)}
                  />
                </div>
              ): null}
            </div>
          );
        })}
      </div>{" "}
      <Modal
        dialogStyle="h-hp-400 !rounded-xl pt-3 update-profile-detail-modal"
        outerDivStyle=" !rounded-xl"
        closeModal={handleModalClose}
        visible={isModalOpen}
        title={basicDetails.isActive ? "Update E&O Setup" : "Add New E&O Setup"}
        bodyStyle={" !max-w-2xl"}
      >
        <div className="">
          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 -mr-3 overflow-y-auto pr-2">
            <div className="">
              <TextInput
                id={"EONumber"}
                type="text"
                placeholder={"Enter E&O Number"}
                label={"E&O Number"}
                name={"EONumber"}
                onChange={onChange}
                value={basicDetails?.EONumber || ""}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass={"!text-txt-md-12 font-semibold"}
                maxLength={50}
                isRequired={true}
              />
              <div className="mt-1 h-4">
                {" "}
                {/* Fixed height error container */}
                {errors.EONumber && (
                  <div className="text-xs text-red-500">{errors.EONumber}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
               
                <CustomDatePicker
                  showIcon
                  label={"Start Date"}
                  name={"startDate"}
                  value={basicDetails?.startDate || ""}
                  onChange={onStartDateChange}
                  placeholder="Select Start Date"
                  dateFormat="MM/dd/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  isRequired={true}
                  dropdownMode="scroll"
                  minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
                  labelClassName="!text-txt-md-12 font-semibold"
                  maxDate={basicDetails?.endDate || ""}
                  className="border-grayBorder rounded-sm-6 input-text-field !text-txt-md-13 !text-primary-theme-1 !placeholder:!font-[450] block w-full pr-10 pl-3 shadow-sm placeholder:text-[14px] disabled:opacity-50"
                />
                <div className="mt-1 h-4">
                  {" "}
                  {/* Fixed height error container */}
                  {errors.startDate && (
                    <div className="text-xs text-red-500">
                      {errors.startDate}
                    </div>
                  )}
                </div>
              </div>
              <div>
                
                <CustomDatePicker
                  showIcon
                  placeholder={"Select Expiration Date"}
                  label={"Expiration Date"}
                  name={"endDate"}
                  value={basicDetails?.endDate || ""}
                  onChange={onEndDateChange}
                  dateFormat="MM/dd/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="scroll"
                  isRequired={true}
                  minDate={
                    basicDetails?.startDate ||
                    new Date(new Date().getFullYear() - 120, 0, 1)
                  }
                  labelClassName="!text-txt-md-12 font-semibold"
                  className="border-grayBorder rounded-sm-6 input-text-field !text-primary-theme-1 !text-txt-md-13 !placeholder:!font-[450] block w-full pr-10 pl-3 shadow-sm placeholder:text-[14px] disabled:opacity-50"
                />
                <div className="mt-1 h-4">
                  {" "}
                  {errors.endDate && (
                    <div className="text-xs text-red-500">{errors.endDate}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <TextInput
                  id={"caseLimit"}
                  type="text"
                  placeholder={"Case Limit"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label={"Case Limit"}
                  name={"caseLimit"}
                  value={basicDetails?.caseLimit || ""}
                  onChange={onChange}
                  inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                  labelClass={"!text-txt-md-12 font-semibold"}
                  maxLength={12}
                  minLength={5}
                />
                <div className="mt-1 h-4">
                 
                </div>
              </div>
              <div>
                <TextInput
                  id={"totalLimit"}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={"Total Limit"}
                  label={"Total Limit"}
                  name={"totalLimit"}
                  value={basicDetails?.totalLimit || ""}
                  onChange={onChange}
                  inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                  labelClass={"!text-txt-md-12 font-semibold"}
                  maxLength={12}
                  minLength={5}
                />
                <div className="mt-1 h-4">
                 
                </div>
              </div>
            </div>

           

            <div className="">
              <DocumentUploader
                files={basicDetails?.file || []}
                setFiles={handleFileChange}
                removeFile={handleRemoveFile}
                setErrors={setErrors}
              />
              <div className="mt-1 h-4">
                {errors.file && (
                  <div className="text-xs text-red-500">{errors.file}</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-1 mb-3">
            <Button
              size={"md"}
              name={basicDetails.isActive ? "Update" : "Save"}
              isDisabled={false}
              isActive={true}
              onClick={handleSubmit}
              btnStyle={
                "w-full disabled:opacity-40 items-center flex justify-center rounded-md focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in text-txt-md-14 !h-10 pb-0.5 cursor-pointer"
              }
            />
          </div>
        </div>{" "}
      </Modal>
    </>
  );
};

export default EAndO;
