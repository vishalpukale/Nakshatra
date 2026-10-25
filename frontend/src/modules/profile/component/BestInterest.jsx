/**
 * File : BestInterest.jsx
 * Description :
 * This React component manages the Best Interest certificate section for an agent's profile.
 * It allows users (agents or back-office agents) to view, add, and update Best Interest course certificates.
 * The component displays a list of certificates, provides a modal form for adding/updating certificate details,
 * and supports file uploads for certificate documents. It also includes validation, Redux integration for data fetching/updating,
 * and navigation to step-by-step instructions. The UI adapts based on the user's role (agent or back-office agent).
 *
 * Main features:
 * - Fetch and display a list of Best Interest certificates for a given agent.
 * - Add or update certificate details including course name, provider, course ID, completion date, and certificate file.
 * - Form validation and error handling.
 * - File upload and preview functionality.
 * - Edit capability for back-office agents.
 * - Navigation to instructions for submitting the Best Interest form.
 *
 * Dependencies:
 * - React, Redux, React Router, Lodash, Toast notifications, and custom UI controls.
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * @component
 * @param {Object} props
 * @param {Function} props.setLoading - Function to set loading state in parent.
 * @param {boolean} props.isBackOfficeAgent - Flag to determine if the user is a back-office agent.
 */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CustomDatePicker,
  DocumentUploader,
  Modal,
  TextInput,
} from "../../../ui-controls/index";
import { useDispatch } from "react-redux";
import {
  getAgentCertificateByCode,
  updateAgentCertificate,
} from "../slice/profileSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  dateFormat,
  truncateByChars,
  validatefromSpace,
} from "../../../services/utils";
import _, { map } from "lodash";
import { editIcon } from "../../../assets";
import { toast } from "react-toastify";
import TooltipCommon from "../../../ui-controls/tooltip";
import TruncatedTooltipCell from "../../../ui-controls/new-tooltip";

const BestInterest = ({ setLoading, isBackOfficeAgent , isComplianceAccess }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const navigate = useNavigate();

  const agentId = new URLSearchParams(search).get("aid");
  const userId = new URLSearchParams(search).get("id");
  const [formData, setFormData] = useState({
    courseName: "",
    providerName: "",
    courseId: "",
    completionDate: "",
    file: [],
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bestInterestList, setBestInterestList] = useState([]);
  const [originalBestInterestObject, setOriginalBestInterestObject] = useState(
    {},
  );

  const handleModalOpen = () => {
    setFormData({
      courseName: "",
      providerName: "",
      courseId: "",
      completionDate: "",
      file: [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  useEffect(() => {
    fetchAgentCertificate();
  }, []);

  const fetchAgentCertificate = () => {
    const CertificateTypeCode = "BI";
    setLoading(true);

    dispatch(getAgentCertificateByCode({ code: CertificateTypeCode, agentId }))
      .then((res) => {
        setBestInterestList(res?.payload?.certificate);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error in Fetching Best Intrest Course: ", error);
      });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName || !validatefromSpace(formData.courseName)) {
      newErrors.courseName = "Course name is required";
    }
    if (!formData.providerName || !validatefromSpace(formData.providerName)) {
      newErrors.providerName = "Provider name is required";
    }
    if (!formData.courseId || !validatefromSpace(formData.courseId)) {
      newErrors.courseId = "Course ID is required";
    }
    if (!formData.completionDate) {
      newErrors.completionDate = "Completion date is required";
    }
    if (!formData.file.length) {
      newErrors.file = "Please upload at least one file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (formData.isActive && hasFormChanged()) {
      setIsModalOpen(false);
      return;
    }

    if (validateForm()) {
      const formPayload = new FormData();
      formPayload.append("agentId", agentId);
      formPayload.append("certificateTypeCode", "BI");
      formPayload.append("courseName", formData.courseName);
      formPayload.append("providerName", formData.providerName);
      formPayload.append("courseId", formData.courseId);
      formPayload.append("completionDate", formData.completionDate);
      formPayload.append("userId", userId || "");
      if (formData.file[0]?.file) {
        formPayload.append("file", formData.file[0].file);
      }

      if (formData.isActive) {
        formPayload.append("id", originalBestInterestObject?.id);
      }
      setLoading(true);

      dispatch(updateAgentCertificate(formPayload))
        .then((res) => {
          if (res?.payload?.status === 200) {
            fetchAgentCertificate();
            handleModalClose();
            toast.success(
              `Certificate ${originalBestInterestObject.id ? "Updated" : "Added"} Successfully.`,
              {
                theme: "colored",
              },
            );
          } else {
            toast.error("Something went wrong. Try again later", {
              theme: "colored",
            });
          }
        })
        .catch((error) => {
          setLoading(false);

          console.error("Error in Fetching Best Intrest Course:", error);
        })
        .finally(() => setLoading(false));
    }
  };

  const onChange = (e) => {
    const { name, value } = e?.target || {};
    const sanitizedValue =
      name === "courseName" || name === "providerName" || name === "courseId"
        ? value
            // Allow letters, digits, spaces, and hyphens
            .replace(/[^A-Za-z0-9-\s]/g, "")
            // Remove leading spaces
            .replace(/^\s+/, "")
            // Remove a leading hyphen if it's the first character
            .replace(/^-/, "")
        : value;

    setFormData((currState) => {
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

  const onDateChange = (e) => {
    setFormData((currState) => {
      return {
        ...currState,
        completionDate: e,
      };
    });
    setErrors((currState) => {
      return {
        ...currState,
        completionDate: "",
      };
    });
  };

  const handleEditBestInterest = (item) => {
    const mimeMap = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      pdf: "application/pdf",
    };
    const mimeType = mimeMap[item?.certificateUrl?.split(".")?.pop()];

    let file = item?.certificateUrl
      ? [
          {
            file: {},
            name: item?.certificateUrl?.split("/")?.pop(),
            preview: item?.certificateUrl,
            size: "",
            type: mimeType,
          },
        ]
      : [];

    setOriginalBestInterestObject({
      ...item,
      file: file,
    });

    setFormData({
      courseName: item.courseName || "",
      providerName: item?.providerName || "",
      courseId: item.courseId || "",
      file: file,
      completionDate: item?.completionDate || "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (fileArray) => {
    setFormData((currState) => ({
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
    const updatedFiles = formData.file.filter((_, i) => i !== index);
    setFormData((currState) => ({
      ...currState,
      file: updatedFiles,
    }));
    setErrors((currState) => ({
      ...currState,
      file: "",
    }));
  };

  const hasFormChanged = () => {
    const previousData = {
      courseName: originalBestInterestObject.courseName || "",
      providerName: originalBestInterestObject?.providerName || "",
      courseId: originalBestInterestObject.courseId || "",
      file: originalBestInterestObject?.file instanceof File || false,
      completionDate: originalBestInterestObject?.completionDate || "",
    };

    const currentData = {
      courseName: formData.courseName || "",
      providerName: formData?.providerName || "",
      courseId: formData.courseId || "",
      file: formData?.file[0]?.file instanceof File || false,
      completionDate: formData?.completionDate || "",
    };

    return _.isEqual(previousData, currentData);
  };
  const onHandleViewPdf = (event) => {
    const fileUrl = event?.certificateUrl;
    if (fileUrl !== "") {
      const pdfWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
      if (pdfWindow) {
        pdfWindow.focus();
      } else {
        console.error("Failed to open PDF in a new tab.");
      }
    }
  };

  const handleNavigateToInstruction = () => {
    if (!isBackOfficeAgent) {
      navigate(`/agent/instructions?code=${"BI"}`);
    } else {
      navigate(`/admin/instructions?code=${"BI"}`);
    }
  };
  return (
    <>
      <div className="mb-1.5 rounded-br-lg rounded-bl-lg border-gray-200 bg-white p-5 pt-1">
        <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
          <div className="mb-3">
            <h2 className="text-txt-md-18 text-primary-theme-1 font-bold">
              Best Interest
            </h2>
            <p className="text-txt-md-13 word-break mt-3 text-justify font-medium text-[#707EAE]">
              For step-by-step instructions on submitting the Best Interest
              form, {"  "}
              <span
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={handleNavigateToInstruction}
              >
                Click here
              </span>
            </p>
          </div>
          {isComplianceAccess && (<div className="w-full md:justify-self-end lg:w-auto">
            <Button
              size="md"
              name="Add"
              isDisabled={false}
              isActive={true}
              onClick={handleModalOpen}
              btnStyle="w-full bg-white border text-primary-theme-1 pt-[2px] !rounded-lg !h-[35.33px]  !text-primary-theme-1 shadow-sm !bg-white px-6 py-1 text-sm font-medium hover:bg-primary-theme-1 hover:text-white text-txt-md-14 font-semibold"
            />
          </div>)}
          
        </div>

        {map(bestInterestList, (item, index) => {
          return (
            <div
              key={index}
              className={`relative mt-3 grid grid-cols-2 items-start gap-4 border-b border-gray-200 pb-2 md:grid-cols-3 lg:static lg:mt-2 lg:grid-cols-[repeat(5,1fr)_auto] lg:gap-5 ${index !== 0 && "mt-10"}`}
            >
              <div>
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  Course Name
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {item?.courseName?.length > 13 ? (
                    <TooltipCommon
                      label={item?.courseName}
                      id={`${index}-bi-course-name-tooltip`}
                    >
                      <span className="block max-w-[120px] truncate text-sm">
                        {truncateByChars(item?.courseName, 13)}
                      </span>
                    </TooltipCommon>
                  ) : (
                    <span className="text-sm">{item?.courseName || "--"}</span>
                  )}
                  {/* {
                    <TruncatedTooltipCell
                      value={item?.courseName}
                      rowId={index}
                      direction="right"
                      tooltipIdPrefix="bic-course-tooltip"
                    />
                  } */}
                </div>
              </div>
              <div className="">
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  Provider Name
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {item?.providerName?.length > 15 ? (
                    <TooltipCommon
                      label={item?.providerName}
                      id={`${index}-bi-provider-name-tooltip`}
                    >
                      <span className="block max-w-[120px] truncate text-sm">
                        {truncateByChars(item?.providerName, 15)}
                      </span>
                    </TooltipCommon>
                  ) : (
                    <span className="text-sm">
                      {item?.providerName || "--"}
                    </span>
                  )}
                  {/* {
                    <TruncatedTooltipCell
                      value={item?.providerName}
                      rowId={index}
                      direction="right"
                      tooltipIdPrefix="bic-providerName-tooltip"
                    />
                  } */}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  Course ID
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {item?.courseId?.length > 15 ? (
                    <TooltipCommon
                      label={item?.courseId}
                      id={`${index}-amlanuities-provider-name-tooltip`}
                    >
                      <span className="block max-w-[120px] truncate text-sm">
                        {truncateByChars(item?.courseId, 15)}
                      </span>
                    </TooltipCommon>
                  ) : (
                    <span className="text-sm">{item?.courseId || "--"}</span>
                  )}
                  {/* {
                  <TruncatedTooltipCell
                    value={item?.courseId}
                    rowId={index}
                    direction="right"
                    tooltipIdPrefix="bic-courseId-tooltip"
                  />
                  } */}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  Course Completion Date
                </div>
                <div className="text-txt-md-13 font-medium text-[#202020]">
                  {dateFormat(item?.completionDate, "DD MMM YYYY") || "--"}
                </div>
              </div>
              <div>
                <div className="text-txt-md-12 font-semibold text-[#707EAE]">
                  File
                </div>
                {item?.certificateUrl ? (
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
              {isBackOfficeAgent && isComplianceAccess ? (
                <div className="w-17 lg:static">
                  <Avatar
                    size="xs"
                    title="Edit BI"
                    src={editIcon}
                    btnStyle="relative  w-13 h-13 -top-px head-initial avatar-disabled cursor-pointer"
                    onClick={() => handleEditBestInterest(item)}
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
        title={formData.isActive ? "Update Best Interest" : "Add Best Interest"}
        bodyStyle={" !max-w-2xl"}
      >
        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 -mr-3 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-x-0 gap-y-0 md:grid-cols-1 md:gap-x-1 md:gap-y-3">
            <div className="col-span-1">
              <TextInput
                id={`courseName`}
                type="text"
                placeholder="Enter Course Name"
                label="Course Name"
                name="courseName"
                value={formData.courseName}
                onChange={onChange}
                isRequired={true}
                maxLength={250}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass="!text-txt-md-12 font-semibold"
              />
              <div className="mt-1 h-1 text-xs text-red-500">
                {errors.courseName}
              </div>
            </div>
            <div className="col-span-1">
              <TextInput
                id="providerName"
                type="text"
                placeholder="Enter Provider Name"
                label="Provider Name"
                name="providerName"
                value={formData.providerName}
                onChange={onChange}
                isRequired={true}
                maxLength={250}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass="!text-txt-md-12 font-semibold"
              />
              <div className="mt-1 h-1 text-xs text-red-500">
                {errors.providerName}
              </div>
            </div>
            <div className="col-span-1">
              <TextInput
                id="courseId"
                type="text"
                placeholder="Enter Course ID"
                label="Course ID"
                name="courseId"
                value={formData.courseId}
                onChange={onChange}
                isRequired={true}
                maxLength={50}
                inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
                labelClass="!text-txt-md-12 font-semibold"
              />
              <div className="mt-1 h-1 text-xs text-red-500">
                {errors.courseId}
              </div>
            </div>
            <div className="col-span-1">
              {/* <TextInput
              id="completionDate"
              type="date"
              placeholder="Select Date"
              label="Course Completion Date"
              name="completionDate"
              value={formData.completionDate}
              onChange={onChange}
              inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
              labelClass="!text-txt-md-12 font-semibold"
            /> */}

              <CustomDatePicker
                showIcon
                label="Course Completion Date"
                value={formData.completionDate}
                onChange={onDateChange}
                placeholder="Select Date"
                dateFormat="MM/dd/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="scroll"
                isRequired={true}
                labelClassName="!text-txt-md-12 font-semibold"
                minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
                className="border-grayBorder rounded-sm-6 input-text-field !text-primary-theme-1 !text-txt-md-13 !placeholder:!font-[450] block w-full pr-10 pl-3 shadow-sm placeholder:text-[14px] disabled:opacity-50"
              />
              <div className="mt-1 h-1 text-xs text-red-500">
                {errors.completionDate}
              </div>
            </div>
            <div className="mt-2">
              <DocumentUploader
                files={formData.file || []}
                removeFile={handleRemoveFile}
                setErrors={setErrors}
                setFiles={handleFileChange}
              />
              <div className="mt-1 h-4 text-xs text-red-500">{errors.file}</div>
            </div>
          </div>
        </div>
        <div className="mt-1 mb-3">
          <Button
            size="lg"
            name={formData.isActive ? "Update" : "Save"}
            isDisabled={false}
            isActive={true}
            onClick={handleSubmit}
            btnStyle="w-full disabled:opacity-40 items-center flex justify-center rounded-md focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in text-txt-md-14 h-10 pb-0.5 cursor-pointer"
          />
        </div>
      </Modal>
    </>
  );
};

export default BestInterest;
