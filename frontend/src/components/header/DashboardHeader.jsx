/**
 * --------------------------------------------------------
 * File        : DashboardHeader.js
 * Description : Displays the header of the dashboard,
 *               including navigation items, user avatar,
 *               and mobile menu functionality.
 * Authors     : Developer Team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-21
 * --------------------------------------------------------
 * Notes:
 * - Displays navigation buttons for various sections of the dashboard.
 * - Features a responsive design with a mobile menu for smaller screens.
 * - Includes a user avatar with a popover to display user information.
 * - Allows users to interact with the dashboard, view different sections,
 *   and access user-related settings.
 * - Inactivity tracking can be implemented as needed.
 */

import React, { Fragment, useEffect, useRef, useState } from "react";
import { canAccessRoute, getNameInitials } from "../../services/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  PopOverDialog,
  Tooltip,
  Button,
  ErrorDialog,
  LinkButton,
} from "../../ui-controls";
import { LogoLogin, Info, Notifications, HomeIcon } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../modules/sign-in/slice/signinSlice";
import { map } from "lodash";

const popOverLinks = [
  {
    id: "profile",
    label: "My Profile",
    route: `/agent/profile`,
    accessCode: "AGT_STG9",
  },
  {
    id: "instructions",
    label: "Instruction",
    route: "/agent/instructions",
  },
  {
    id: "faqs",
    label: "FAQs",
    route: "/faq",
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    route: "/terms-and-conditions",
  },
];

const ButtonControl = ({
  size,
  name,
  isDisabled,
  isHoverEnable,
  isActive,
  isSecondary,
  btnStyle,
  onClick,
}) => {
  return (
    <Button
      size={size}
      name={name}
      isDisabled={isDisabled}
      isHoverEnable={isHoverEnable}
      isSecondary={isSecondary}
      isActive={isActive}
      btnStyle={btnStyle}
      onClick={!isDisabled ? onClick : () => {}}
    />
  );
};

const DashboardHeader = ({
  isDisabled,
  // user,
  navItems,
  name,
  onModuleChange,
}) => {
  // const { userData } = useSelector(({ signin }) => signin);
  const { agentDashboardData } = useSelector((state) => state.agentDashboard);

  const currentStatus = agentDashboardData?.status;
  // const isFullyOnboarded =
  //   ALLOWED_STATUSES_FOR_ALL_PATHS.includes(currentStatus);

  const [isOpenPop, setPopOver] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const navigate = useNavigate();
  const { agentBasicDetail } = useSelector((state) => state.onboarding);
  const location = useLocation();
  // const role = user?.role ?? "";
  const dispatch = useDispatch();
  useEffect(() => {
    // Inactivity tracking logic...
  }, []);

  const handleNavigation = (btnName) => {
    setActiveButton(btnName.moduleId);
    onModuleChange?.(btnName.moduleName);
    navigate(`/agent${btnName.moduleUrl}`);
  };

  const handleOptionClick = (item) => {
    if (item.id === "profile") {
      navigate(
        `${item.route}?aid=${agentBasicDetail?.id}&id=${agentBasicDetail?.userId}&code=${"LIC"}`,
      );
    } else if (item.id === "instructions") {
      navigate(`/agent/instructions?code=${"EAO"}`);
    } else {
      navigate(item.route);
    }
  };
  const logoutAction = () => {
    dispatch(logout());
    // navigate(0);
  };

  const onLogoClick = () => {
    navigate("/agent");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPopOver(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


const handleMobileHome=()=>{
  navigate("/agent");
  setShowMobileMenu(false)
}
  return (
    <>
      {/* 4xl:h-24 */}
      <nav className="bg-primary-theme fixed top-0 z-10 w-full">
        <div className="flex px-2 sm:px-6">
          {/* Logo */}
          <div className="grid cursor-pointer">
            <Avatar
              size="sm"
              title="logo"
              isRounded={false}
              isDisabled={isDisabled}
              src={LogoLogin}
              onClick={onLogoClick}
              imgStyle={"site-logo 4xl:h-hp-48 !h-7"}
            />
          </div>

          <div className="flex-grow"></div>

{/* 4xl:mt-5 */}
          <div className=" relative w-auto flex-none">
            <div className="relative flex h-14 items-center justify-end">
              {/* pc view */}

              <div className="hidden items-center gap-2 xl:flex">
               {navItems.length && <div className={`grid cursor-pointer`}>
                  <Avatar
                    size="md"
                    title="logo"
                    isRounded={false}
                    isDisabled={isDisabled}
                    src={HomeIcon}
                    onClick={onLogoClick}
                    imgStyle={"site-logo 4xl:h-hp-48 !h-7"}
                  />
                </div>}
                {navItems.map((btnName) => {
                  if (
                    btnName.moduleCode === "AGT-OB" ||
                    btnName.moduleCode === "AGT-CR"
                  ) {
                    return null;
                  }
                  const navPath = `/agent${btnName.moduleUrl}`;
                  const isActive = location.pathname.includes(navPath);
                  return (
                    <Fragment key={btnName.moduleId}>
                      {(() => {
                        const path = `/agent/${(btnName.moduleUrl || "").replace(/^\/+/, "")}`;

                        const isBlocked = !canAccessRoute(path, currentStatus);
                        return (
                          <ButtonControl
                            size="custom"
                            name={btnName.moduleName}
                            isDisabled={isBlocked}
                            isHoverEnable={false}
                            isActive={activeButton === btnName.moduleId}
                            onClick={() => {
                              if (isBlocked) return; // Prevent navigation
                              handleNavigation(btnName);
                              setShowMobileMenu(false);
                            }}
                            btnStyle={`px-2 py-3 mr-0 text-sm rounded-lg border-none h-5 flex items-center ${
                              isBlocked
                                ? "!bg-gray-400 !text-white cursor-not-allowed"
                                : isActive
                                  ? "!bg-white !text-indigo-900 font-bold"
                                  : "!bg-primary-theme !text-white"
                            }`}
                          />
                        );
                      })()}
                    </Fragment>
                  );
                })}

                {/* User Avatar with PopOver */}
                <div
                  className="flex w-32 justify-around rounded-[30.07px] bg-white/10 p-1"
                  ref={dropdownRef}
                >
                  <Avatar
                    onClick={() => {
                      /* setShowConfirmDialog(true) */
                    }}
                    src={Notifications}
                  />
                  <Avatar src={Info} />

                  <PopOverDialog
                    visible={isOpenPop}
                    onCloseModel={() => setPopOver(false)}
                    pannelClass={"absolute right-0"}
                    isPointerIcon={false}
                    icon={
                      <Tooltip
                        id="user"
                        // label={getLastNameInitials(name)}
                        tooltipStyle="tooltip-style"
                        lblStyle="labelClass uppercase"
                        tagStyle="inline-custom"
                      >
                        <Avatar
                          size="sm"
                          title="User"
                          isRounded={true}
                          isDisabled={false}
                          icon={"plus"}
                          // onClick={() => setShowConfirmDialog(true)}
                          onClick={() => setPopOver(!isOpenPop)}
                          data={getNameInitials(name)}
                          btnStyle={
                            "relative -top-px head-initial avatar-disabled cursor-pointer"
                          }
                        />
                      </Tooltip>
                    }
                  >
                    <div className="bg-white px-3 py-1 text-sm shadow-sm">
                      {map(popOverLinks, (item, index) => {
                        if (
                          item.id === "profile" &&
                          agentBasicDetail?.status !== "AGT_STG9"
                        ) {
                          return null;
                        }

                        return (
                          <div className="mt-2" key={index}>
                            <LinkButton
                              key={item.id}
                              isActive={true}
                              onClick={() => handleOptionClick(item)}
                              label={item.label}
                              btnStyle={
                                "text-txt-md-12 font-medium !text-[#414141]"
                              }
                            />
                          </div>
                        );
                      })}
                      <hr className="mt-1 border-[#EAEAEA]" />
                      <LinkButton
                        key={"logout"}
                        isActive={true}
                        onClick={() => setShowConfirmDialog(true)}
                        label={"Logout"}
                        btnStyle={
                          "text-txt-md-12 font-medium !text-primary-theme mt-1 mb-2"
                        }
                      />
                    </div>
                  </PopOverDialog>
                </div>
              </div>

              {/* Icons */}
              <div className="ml-4 xl:hidden">
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className="text-white"
                >
                  ☰
                </button>
              </div>

              {/* Mobile Side Menu */}

              {showMobileMenu && (
                <div className="bg-opacity-60 bg-black-100 fixed inset-0 z-50 flex justify-end xl:hidden">
                  <div className="scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-hide scrollbar-thin h-[calc(100dvh)] w-2/3 max-w-xs space-y-4 overflow-y-auto bg-white p-6">
                    <button
                      className="mb-4 text-right font-bold text-sky-950"
                      onClick={() =>   setShowMobileMenu(false)}
                    >
                      ✕ Close
                    </button>
                    <div
                      className="flex w-32 justify-around rounded-[30.07px] bg-black/10 p-1 text-left"
                      ref={dropdownRef}
                    >
                      <Avatar
                        onClick={() => {
                          /* setShowConfirmDialog(true) */
                        }}
                        src={Notifications}
                      />
                      <Avatar src={Info} />

                      <PopOverDialog
                        visible={isOpenPop}
                        onCloseModel={() => setPopOver(false)}
                        pannelClass={"absolute right-0"}
                        isPointerIcon={false}
                        icon={
                          <Tooltip
                            id="user"
                            // label={getLastNameInitials(name)}
                            tooltipStyle="tooltip-style"
                            lblStyle="labelClass uppercase"
                            tagStyle="inline-custom"
                          >
                            <Avatar
                              size="sm"
                              title="User"
                              isRounded={true}
                              isDisabled={false}
                              icon={"plus"}
                              // onClick={() => setShowConfirmDialog(true)}
                              onClick={() => setPopOver(!isOpenPop)}
                              data={getNameInitials(name)}
                              btnStyle={
                                "relative -top-px head-initial avatar-disabled cursor-pointer"
                              }
                            />
                          </Tooltip>
                        }
                      >
                        <div className="bg-white px-3 py-1 text-sm shadow-sm">
                          
                          {map(popOverLinks, (item, index) => {
                            if (
                              item.id === "profile" &&
                              agentBasicDetail?.status !== "AGT_STG9"
                            ) {
                              return null;
                            }

                            return (
                              <div className="mt-2" key={index}>
                                <LinkButton
                                  key={item.id}
                                  isActive={true}
                                  onClick={() => handleOptionClick(item)}
                                  label={item.label}
                                  btnStyle={
                                    "text-txt-md-12 font-medium !text-[#414141]"
                                  }
                                />
                              </div>
                            );
                          })}
                          <hr className="mt-1 border-[#EAEAEA]" />
                          <LinkButton
                            key={"logout"}
                            isActive={true}
                            onClick={() => setShowConfirmDialog(true)}
                            label={"Logout"}
                            btnStyle={
                              "text-txt-md-12 font-medium !text-primary-theme mt-1 mb-2"
                            }
                          />
                        </div>
                      </PopOverDialog>
                    </div>
                    <ButtonControl
                      key={"home-btn"}
                      size="custom"
                      name={"Home"}
                      isDisabled={false}
                      isHoverEnable={false}
                      onClick={() => handleMobileHome()}
                      btnStyle={`w-full text-left pl-4 py-2 rounded-md   text-sky-900
                      `}
                    />
                    {navItems.slice(0, -1).map((btnName) => {
                      const navPath = `/agent${btnName.moduleUrl}`;
                      const isActive = location.pathname === navPath;

                      // const path = `/admin/${(btnName.moduleUrl || "").replace(/^\/+/, "")}`;

                      // const blockedPaths = [
                      //   "/agent/dashboard",
                      //   "/agent/commissions",
                      //   "/agent/compliance",
                      //   "/agent/contracting",
                      //   "/agent/client-management",
                      //   "/agent/training",
                      //   "/agent/team-reports",
                      // ];
                      const isBlocked = !canAccessRoute(navPath, currentStatus);
                      // !isFullyOnboarded && blockedPaths.includes(navPath);

                      return (
                        <ButtonControl
                          key={btnName.moduleId}
                          size="custom"
                          name={btnName.moduleName}
                          isDisabled={isBlocked}
                          isHoverEnable={false}
                          isActive={activeButton === btnName.moduleName}
                          onClick={() => {
                            if (isBlocked) return;
                            setActiveButton(btnName.moduleName);
                            handleNavigation(btnName);
                            setShowMobileMenu(false);
                          }}
                          btnStyle={`w-full text-left pl-4 py-2 rounded-md ${
                            isBlocked
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : isActive
                                ? "bg-black-100 text-white"
                                : "text-sky-900"
                          }`}
                        />
                      );
                    })}
                    <ButtonControl
                      key={"logout-btn"}
                      size="custom"
                      name={"Logout"}
                      isDisabled={false}
                      isHoverEnable={false}
                      onClick={() => setShowConfirmDialog(true)}
                      btnStyle={`w-full text-left pl-4 py-2 rounded-md text-red-900`}
                    />
                  </div>
                </div>
              )}

              {/* User Avatar with PopOver */}
            </div>
          </div>
        </div>
      </nav>
      <ErrorDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          logoutAction();
        }}
        dialogHeader="Are you sure you want to Logout?"
        // dialogDetail="Your changes will not be saved if you leave this page."
        confirmText="Logout"
        cancelBtn="Cancel"
      />
    </>
  );
};

export default DashboardHeader;
