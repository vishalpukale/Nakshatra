/**
 * --------------------------------------------------------
 * File        : Profile.js
 * Description : Renders the agent profile page with tabs for Licenses, Certificates,
 *               Carrier Appointments, Documents, and Transaction History.
 * Authors     : Developer Team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-24
 * --------------------------------------------------------
 * Notes:
 * - Dynamically adjusts layout based on screen size (desktop, tablet, mobile).
 * - Provides access control based on user type and permissions.
 * - Fetches and displays notification data related to the agent.
 * - Enables navigation between different profile sections through tabs.
 */

import React, { useEffect, useState, useRef } from "react";
import DashboardHeader from "../../../components/header/DashboardHeader";
import { Avatar, Label } from "../../../ui-controls";
import UserProfile from "../component/UserProfile";
import Certificates from "../component/Certificates";
import CarrierAppointments from "../component/career-appointment/index";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useScreenSize from "../../../hook/UseScreenSize";
import { CircularLoader } from "../../../components";
import Notification from "../component/Notification";
import { fetchNotificationDataByAgentId } from "../slice/profileSlice";
import {
  desktopTabs,
  mobileTabs,
  MODULE_FIELDS,
  MODULE_SCREENS,
} from "../../../services/constants/index";
import Licenses from "../component/Licenses";
import Documents from "../component/Documents";
import TransactionHistory from "../component/TransactionHistory";
import { USER_TYPE } from "../../../services/constants";
import { backArrow } from "../../../assets";

const Profile = () => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const [isLoading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state?.signin || {});
  const { search } = useLocation();
  const agentId = new URLSearchParams(search).get("aid");
  const currentTab = new URLSearchParams(search).get("code");
  const searchParams = new URLSearchParams(window.location.search);
  const isBackOfficeAgent = userData?.userTypeCode === USER_TYPE.BACK_OFFICE;
  const isProfileAccess = !!userData.userAccess.find(
    (access) => access.moduleCode === MODULE_FIELDS.EDIT_AGENT_PROFILE,
  );
  const isComplianceAccess = !!userData.userAccess.find(
    (access) => access.moduleCode === MODULE_SCREENS.LICENSE,
  );
  const isCarrierAccess = !!userData.userAccess.find(
    (access) => access.moduleCode === MODULE_SCREENS.CONTRACT_REQUEST,
  );

  const [activeTab, setActiveTab] = useState(currentTab || "Licenses");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTaxInfoModalOpen, setIsTaxInfoModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const tabRefs = useRef({});
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchNotificationData();
  }, []);
  
  useEffect(() => {
  if ((isMobile || isTablet) && tabRefs.current[activeTab]) {
    const scrollToTab = () => {
      tabRefs.current[activeTab]?.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    };

    const animationFrame = requestAnimationFrame(scrollToTab);

    // Cleanup
    return () => cancelAnimationFrame(animationFrame);
  }
}, [isMobile, isTablet, activeTab]);


  const fetchNotificationData = () => {
    setLoading(true);
    dispatch(fetchNotificationDataByAgentId({ agentId: agentId }))
      .then(
        (res) => {
          setLoading(false);
          if (res?.payload?.status === 200) {
            const items = res?.payload?.data?.data || [];
            setNotificationData(items);
            // setNotificationData([]);
          }
        },
        (error) => {
          setLoading(false);
          setNotificationData([]);
          console.log(error?.message);
        },
      )
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const commonProps = {
    isProfileModalOpen,
    setIsProfileModalOpen,
    isTaxInfoModalOpen,
    setIsTaxInfoModalOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    activeTab,
    setLoading,
    notificationData,
    fetchNotificationData,
    isBackOfficeAgent,
    isDesktop,
    isProfileAccess,
    isComplianceAccess,
    isLoading
  };
  // console.log("desktopTabs, mobileTabs", desktopTabs, mobileTabs)

  const ProfileHeader = (
    <>
      <nav className="4xl:h-24 bg-primary-theme grid h-[54px] w-full items-center px-4 md:px-8">
        <div className="flex items-center justify-start align-middle text-white">
          <Avatar
            src={backArrow}
            onClick={() => navigate(-1)}
            style={{ height: "30px", width: "30px", cursor: "pointer" }}
          />
          <Label
            label="Agent Profile"
            size="lg"
            lblStyle={"!text-txt-18 md:!text-[20px] font-bold ml-3"}
          />
        </div>
      </nav>
    </>
  );
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    searchParams.set("code", tabName);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`,
    );

    // Scroll active tab into center on mobile/tablet
    if ((isMobile || isTablet) && tabRefs.current[tabName]) {
      tabRefs.current[tabName].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };
  return (
    <div className="bg-global h-screen bg-[#F4F7FE]">
      {isLoading ? <CircularLoader /> : null}
      {isBackOfficeAgent ? (
        ProfileHeader
      ) : (
        <DashboardHeader
          name={userData?.firstName}
          navItems={userData?.userAccess}
          user={userData}
        />
      )}{" "}
      <div></div>
      {/* <ScrollBar
        maxHeight={`calc(100dvh)`}
        maxWidth={`100%`}
        horizontal={"hidden"}
        verticle={"scroll"}
        scrollStyle={"overflow-auto"}
      > */}
      <div
        className={`s relative mx-auto grid w-full grid-cols-1 gap-4 px-5 md:px-10 lg:grid-cols-[1fr_3fr] ${isBackOfficeAgent ? `pt-5` : `pt-19`}`}
      >
        {/* Left Column - Profile Info */}
        {isMobile || isTablet ? null : (
          <div className="hidden md:block">
            <UserProfile {...commonProps} />
          </div>
        )}

        {/* Right Column - Main Content */}
        <div className="scrollbar-thin scrollbar-track-gray-100 overflow-auto">
          {/* Tabs */}
          <Notification {...commonProps} />
          <div className="rounded-tl-lg rounded-tr-lg border-b border-gray-200 bg-white">
            <nav className="scrollbar-hide ml-2 flex overflow-x-auto">
              {/* Desktop View */}
              {isDesktop ? (
                <div className="hidden w-full md:flex">
                  {desktopTabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`text-txt-md-13 mr-4 cursor-pointer p-2 font-[450] whitespace-nowrap ${
                        activeTab === tab.code
                          ? "border-primary-accent-500 text-primary-accent border-b-2"
                          : "text-gray-600"
                      } `}
                      onClick={() => handleTabChange(tab.code)}
                    >
                      {tab.displayName}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Mobile View */}
              {isMobile || isTablet ? (
                <div className="flex w-full">
                  {mobileTabs.map((tab, index) => (
                    <button
                      key={index}
                      ref={(el) => (tabRefs.current[tab.code] = el)}
                      className={`text-txt-md-13 mr-4 p-2 font-[450] whitespace-nowrap ${
                        activeTab === tab.code
                          ? "border-primary-accent-500 text-primary-accent border-b-2"
                          : "text-gray-600"
                      } `}
                      onClick={() => handleTabChange(tab.code)}
                    >
                      {tab.displayName}
                    </button>
                  ))}
                </div>
              ) : null}
            </nav>
          </div>{" "}
          {isDesktop ? null : (
            <>{activeTab === "PROF" && <UserProfile {...commonProps} />}</>
          )}
          {activeTab === "LIC" && (
            <Licenses
              setLoading={setLoading}
              notificationData={notificationData}
              isBackOfficeAgent={isBackOfficeAgent}
              isComplianceAccess={isComplianceAccess}
            />
          )}
          {activeTab === "COMP" && (
            <Certificates
              setLoading={setLoading}
              notificationData={notificationData}
              isComplianceAccess={isComplianceAccess}
              isBackOfficeAgent={isBackOfficeAgent}
            />
          )}
          {activeTab === "CAPP" && (
            <CarrierAppointments
              setLoading={setLoading}
              notificationData={notificationData}
              isBackOfficeAgent={isBackOfficeAgent}
              isCarrierAccess={isCarrierAccess}
            />
          )}
          {activeTab === "DOCS" && (
            <Documents
              setLoading={setLoading}
              notificationData={notificationData}
              isBackOfficeAgent={isBackOfficeAgent}
            />
          )}
          {activeTab === "ALOG" && (
            <TransactionHistory
              setLoading={setLoading}
              notificationData={notificationData}
              isBackOfficeAgent={isBackOfficeAgent}
              isProfileAccess={isProfileAccess}
            />
          )}
        </div>
      </div>
      {/* </ScrollBar> */}
    </div>
  );
};

export default Profile;
