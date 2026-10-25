/**
 * File :Licenses.jsx
 * Description :
 * This React component displays a list of licenses associated with an agent or user profile.
 * It fetches license data from the backend using Redux actions and displays details such as license number,
 * issued date, expiration date, state, LOA (Line of Authority), and a link to view the license PDF.
 * The component also handles loading states, displays a message when no data is available,
 * and provides navigation to instructions for uploading E&O insurance certificates.
 * It is used in the profile module and supports both agent and back office agent views.
 *
 *  Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29
 *
 *
 * @param {Object} props - Component props
 * @param {Function} props.setLoading - Function to set the loading state
 * @param {Array} props.notificationData - Array of notification data to adjust layout height
 * @param {boolean} props.isBackOfficeAgent - Flag to determine if the user is a back office agent
 */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchStateLicenseData } from "../slice/profileSlice";
import { dateFormat } from "../../../services/utils";
import { map } from "lodash";
// onboarding module removed; state lookup disabled.
import { Avatar, EmailModel, Image } from "../../../ui-controls/index";
import noDataImage from "../../../assets/images/no_data_found.png";
import { Email, LicenseSVG } from "../../../assets/index";
// admin-dashboard removed; email template API disabled.
import { toast } from "react-toastify";

const Licenses = ({
  setLoading,
  notificationData,
  isBackOfficeAgent,
  isComplianceAccess,
}) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openEmailModel, setOpenEmailModel] = useState(false);
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // admin state removed — selectedCountry not available
  const agentId = new URLSearchParams(search).get("aid");
  const userId = new URLSearchParams(search).get("id");
  const { userData } = useSelector((state) => state?.signin || {});
  const { isLoading, stateLicenseData } = useSelector(
    (state) => state?.profile || {},
  );

  // const [stateList, setStateList] = useState([]);
  // console.log("stateLicenseData", isBackOfficeAgent);

  useEffect(() => {
    // fetchStateList();

    fetchEmailSubject();
    fetchProfileData();
  }, [agentId]);

  const fetchEmailSubject = () => {
    // Email templates endpoint removed along with admin module.
    // Keep empty templates to avoid breaking UI.
    setEmailSubject("");
    setEmailBody("");
  };

  // const fetchStateList = () => {
  //   dispatch(
  //     getStateByCountry({
  //       countryId: selectedCountry.id || userData.countryId,
  //     }),
  //   ).then(({ payload }) => {
  //     if (payload?.status === 200) {
  //       setStateList(payload?.data?.data);
  //     }
  //   });
  // };

  const fetchProfileData = () => {
    setLoading(true);
    dispatch(
      fetchStateLicenseData({
        agentId: agentId || userData?.id,
        userCountryCompanyId: userData.countryCompanyId,
      }),
    )
      .then(
        (response) => {
          setLoading(false);
          if (response?.payload?.status === 200) {
            // setStateLicenseData(response?.payload?.data?.data || []);
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
  // const findStateName = (state) => {
  //   const role = stateList?.find((value) => value?.code === state);
  //   return role ? role?.name : "--";
  // };

  // const sortedStateLicenses = [...stateLicenseData].sort((a, b) => {
  //   if (a.isResidentState && !b.isResidentState) return -1;
  //   if (!a.isResidentState && b.isResidentState) return 1;

  //   if (a.status === "Active" && b.status !== "Active") return -1;
  //   if (a.status !== "Active" && b.status === "Active") return 1;

  //   const aDate = new Date(a.expires || 0);
  //   const bDate = new Date(b.expires || 0);
  //   return bDate - aDate;
  // });

  const sortedStateLicenses = [...stateLicenseData].sort((a, b) => {
    const aDate = new Date(a.expires || 0);
    const bDate = new Date(b.expires || 0);
    const now = new Date();
  
    const aIsExpired = aDate < now;
    const bIsExpired = bDate < now;
  
    // 1. Demote expired resident licenses
    if (a.isResidentState && aIsExpired && !(b.isResidentState && bIsExpired)) return 1;
    if (b.isResidentState && bIsExpired && !(a.isResidentState && aIsExpired)) return -1;
  
    // 2. Prioritize resident state
    if (a.isResidentState && !b.isResidentState) return -1;
    if (!a.isResidentState && b.isResidentState) return 1;
  
    // 3. Prioritize Active status
    if (a.status === "Active" && b.status !== "Active") return -1;
    if (a.status !== "Active" && b.status === "Active") return 1;
  
    // 4. Sort by expiry date (descending: latest first)
    return bDate - aDate;
  });
  

  console.log("sortedStateLicenses: ", sortedStateLicenses);
  const HEIGHTS = {
    withNotifications: "h-[calc(100dvh-220px)]",
    withoutNotifications: "h-[calc(100dvh-160px)]",
  };

  const containerHeight =
    notificationData.length !== 0
      ? HEIGHTS.withNotifications
      : HEIGHTS.withoutNotifications;

  const handleNavigateToInstruction = () => {
    if (!isBackOfficeAgent) {
      navigate(`/agent/instructions?code=${"LIC"}`);
    } else {
      navigate(`/admin/instructions?code=${"LIC"}`);
    }
  };

  const handleSendEmail = (item) => {
    console.log("item", item);
    if (!item?.email) {
      alert("No email found for this agent.");
      return;
    }

    const agentName =
      `${item?.title || ""} ${item?.agentFirstName || ""} ${item?.agentLastName || ""}`.trim();

    const formattedExpiry = item?.expires
      ? dateFormat(item?.expires, "DD MMM YYYY")
      : "--";

    const subject = emailSubject
      ?.replace(/{{agentName}}/g, agentName || "--")
      .replace(/{{agentCode}}/g, item.agentCode || "--")
      .replace(/{{email}}/g, item.email || "--")
      .replace(/{{licenseNum}}/g, item.licenseNum || "--")
      .replace(/{{expires}}/g, formattedExpiry);

    const body = emailBody
      ?.replace(/{{agentName}}/g, agentName || "--")
      .replace(/{{agentCode}}/g, item.agentCode || "--")
      .replace(/{{email}}/g, item.email || "--")
      .replace(/{{licenseNum}}/g, item.licenseNum || "--")
      .replace(/{{expires}}/g, formattedExpiry);

    setSelectedAgent({
      ...item,
      subject,
      body,
    });

    setEmailSubject(subject);
    setEmailBody(body);
    setOpenEmailModel(true);
  };

  return (
    <>
      <div
        className={`${containerHeight} rounded-br-lg rounded-bl-lg border border-gray-200 bg-white pb-3`}
      >
        <div
          className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-hide h-full overflow-x-hidden overflow-y-auto p-5 ${!stateLicenseData?.length ? "grid place-content-center" : ""}`}
        >
          {stateLicenseData?.length ? (
            <>
              <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
                <div className="mb-3">
                  <p className="text-txt-md-13 word-break word-break text-links mt-3 text-justify font-medium lg:w-[55vw]">
                    All agents with an active license are required to carry an
                    active GFI Errors and Omission (E&O) Insurance. Upload your
                    existing E&O policy certificate{" "}
                    <span
                      className="cursor-pointer text-blue-500 hover:underline"
                      onClick={() => handleNavigateToInstruction()}
                    >
                      Click here
                    </span>
                  </p>
                </div>
              </div>
              {map(sortedStateLicenses, (item, index) => {
                const isExpired =
                  item.expires && new Date(item.expires) < new Date();
                return (
                  <div
                    className="relative mt-5 rounded-lg border border-gray-200 p-5 md:mt-2"
                    key={index}
                  >
                    <div className="grid grid-cols-1 gap-4 min-[410px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
                      <div>
                        <div className="text-txt-md-12 text-links font-semibold">
                          License Number
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                          {item.isResidentState && (
                            <img
                              src={LicenseSVG}
                              alt="Residential"
                              className="!h-4 !w-4"
                              title="Residential License"
                            />
                          )}
                          <div className="text-txt-md-13 font-medium text-[#202020]">
                            {item?.licenseNum}
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="text-txt-md-12 text-links font-semibold">
                          Issued Date
                        </div>
                        <div className="text-txt-md-13 font-medium text-[#202020]">
                          {dateFormat(item?.licensedOn, "DD MMM YYYY")}
                        </div>
                      </div>
                      <div>
                        <div className="text-txt-md-12 text-links font-semibold">
                          Expiration Date
                        </div>
                        <div className="text-txt-md-13 font-medium text-[#202020]">
                          {dateFormat(item?.expires, "DD MMM YYYY")}
                        </div>
                      </div>

                      <div>
                        <div className="text-txt-md-12 text-links font-semibold">
                          State
                        </div>
                        <div className="text-txt-md-13 font-medium text-[#202020]">
                          {/* {findStateName(item?.state)} */}
                          {item?.state?.name || "--"}
                        </div>
                      </div>
                      <div>
                        <div className="text-txt-md-12 text-links font-semibold">
                          Status
                        </div>
                        <div className="text-txt-md-13 font-medium text-[#202020]">
                          {/* {findStateName(item?.state)} */}
                          {
                            <span
                              className={`${isExpired ? "text-red-500" : !isExpired ? "text-green-500" : "text-dark-gray"}`}
                            >
                              {item?.status || "--"}
                            </span>
                          }
                        </div>
                      </div>

                      {/* <div className="">
                    <div className="text-txt-md-14 font-semibold text-links">
                      File
                    </div>

                    {item?.licenseUrl !== "" ? (
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
                  </div> */}
                    </div>
                    <div className="absolute top-6 right-0">
                      {isComplianceAccess && (
                        <div className="mr-10 ml-auto cursor-pointer">
                          <Avatar
                            icon={"icon-mail"}
                            onClick={() => handleSendEmail(item)}
                            imgStyle={"h-4 w-4"}
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <div>
                        <div className="text-txt-md-12 text-links font-semibold">
                          Loa
                        </div>
                        <div className="text-txt-md-13 font-medium text-[#202020]">
                          {item?.loa || "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {!isLoading && (
                <div className="m-auto flex w-[50%] justify-center lg:w-[20%]">
                  <Image
                    src={noDataImage}
                    alt="No Data Available"
                    className="h-full w-full rounded-lg bg-cover bg-center"
                    isHoverEnable={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EmailModel
        dialogStyle="rounded-sm-6 pt-3"
        closeModal={() => setOpenEmailModel(false)}
        visible={openEmailModel}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        handleSendEmail={async () => {
          if (!selectedAgent?.email) {
            toast.error("Email not found for the selected agent.");
            return;
          }

          console.log("selectedAgent", selectedAgent);

          const agentName =
            `${selectedAgent?.title || ""} ${selectedAgent?.agentFirstName || ""} ${selectedAgent?.agentLastName || ""}`.trim();
          const formattedExpiry = selectedAgent?.expires
            ? dateFormat(selectedAgent.expires, "DD MMM YYYY")
            : "--";

          const finalSubject = emailSubject
            ?.replace(/{{agentName}}/g, agentName)
            ?.replace(/{{agentCode}}/g, selectedAgent.agentCode || "--")
            ?.replace(/{{email}}/g, selectedAgent.email || "--")
            ?.replace(/{{licenseNum}}/g, selectedAgent.licenseNum || "--")
            ?.replace(/{{expires}}/g, formattedExpiry);

          const finalBody = emailBody
            ?.replace(/{{agentName}}/g, agentName)
            ?.replace(/{{agentCode}}/g, selectedAgent.agentCode || "--")
            ?.replace(/{{email}}/g, selectedAgent.email || "--")
            ?.replace(/{{licenseNum}}/g, selectedAgent.licenseNum || "--")
            ?.replace(/{{expires}}/g, formattedExpiry);

          const payload = {
            to: selectedAgent.email,
            subject: finalSubject,
            body: finalBody,
          };

          try {
            setLoading(true);
            // Replace with your actual email dispatch API
            // admin-dashboard/email API removed. Simulate success for now.
            toast.success(`(Simulated) Email sent to ${selectedAgent.email}`, {
              theme: "colored",
            });
          } catch (err) {
            console.error("Email send error:", err);
            toast.error("Failed to send email.", { theme: "colored" });
          } finally {
            setOpenEmailModel(false);
            setLoading(false);
          }
        }}
        isNoteVisible={true}
      />
    </>
  );
};

export default Licenses;
