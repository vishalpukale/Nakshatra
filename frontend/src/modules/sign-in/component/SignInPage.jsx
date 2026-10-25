/**
 * --------------------------------------------------------
 * File        : SignInPage.js
 * Description : Handles the user login and sign-up process for the GFI Tevah portal.
 *               Includes functionality for both agent and admin logins,
 *               as well as the creation of a new agent account.
 * Authors     : Developer Team
 * Created On  : 2025-04-21
 * Updated On  : 2025-04-21
 * --------------------------------------------------------
 * Notes:
 * - Allows users to toggle between agent and admin login types.
 * - Supports referral code functionality to display referrer name.
 * - Includes a section for agent account creation.
 * - Displays a loading spinner while performing API requests.
 * - Includes links for Privacy Policy and Terms & Conditions.
 * - The page layout adapts for different screen sizes.
 */

import React, { useState, useEffect } from "react";
import Advertisement from "./Advertisement";
import SignInAgent from "./SignInAgent";
import SignInAdmin from "./SignInAdmin";
import { Label, LinkButton } from "../../../ui-controls/index";
import { CircularLoader } from "../../../components";
import CreateAgent from "./CreateAgent";
import { USER_STATUS } from "../../../services/constants";
// Referral code functionality removed with onboarding module.
import { useLocation, useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const FORM_INITIAL_STATE = {
  mobileNum: "",
  OTP: "",
  email: "",
  password: "",
  countryPhoneCode: "",
};

const SignInPage = () => {
  const [loginData, setLoginData] = useState(FORM_INITIAL_STATE);
  const urlParams = new URLSearchParams(window.location.search);
  // const type = urlParams.get("type") || USER_STATUS.AGENT; // Default to 'agent'
  const redirectTo = urlParams.get("redirect_to");
  const [isLoading, setLoading] = useState(false);
  const [isOtpSent, setOtpSent] = useState(false);

  const [referrerName, setReferrerName] = useState(null); // To store the referrer name
  const navigate = useNavigate();
  // Capture the referral code from the URL and store it in localStorage

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlType = params.get("type");

  const [type, setType] = useState(urlType || "agent");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    if (urlType) {
      setType(urlType);
    }
  }, [urlType]);

  useEffect(() => {
    const referralCode = urlParams.get("referal");
    if (referralCode) {
      const now = new Date().getTime();
      localStorage?.setItem("referralCode", referralCode);
      localStorage?.setItem("referralCodeTimestamp", now.toString());

      fetchReferralDetails(referralCode);
    } else {
      // Check local storage if no referral in URL
      const storedCode = localStorage.getItem("referralCode");
      if (storedCode && isReferralValid()) {
        fetchReferralDetails(storedCode);
      } else {
        // Remove expired or invalid referral
        localStorage.removeItem("referralCode");
        localStorage.removeItem("referralCodeTimestamp");
      }
    }
  }, []);

  const isReferralValid = () => {
    const timestamp = localStorage.getItem("referralCodeTimestamp");
    if (!timestamp) return false;

    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    const now = new Date()?.getTime();

    return now - parseInt(timestamp) <= ONE_WEEK;
  };

  // Lightweight local stub for referral lookup. Onboarding was removed,
  // so this function keeps behavior safe by not attempting network calls.
  const fetchReferralDetails = async (referralCode) => {
    try {
      // No-op: onboarding module removed. Keep referrerName null so UI degrades gracefully.
      setReferrerName(null);
    } catch (error) {
      setReferrerName(null);
    }
  };

  /**
   * Toggles between admin and agent login types.
   * Resets form fields when toggled.
   */

  const handleLoginTypeToggle = () => {
    let signType =
      type === USER_STATUS.AGENT || type === USER_STATUS.NEW
        ? USER_STATUS.ADMIN
        : USER_STATUS.AGENT;

    navigate(`/sign-in?type=${signType}`, { replace: true });
    setOtpSent(false);
    setLoginData(FORM_INITIAL_STATE);
  };

  // let title = "";
  // let subtitle = "";

  // if (isPasswordReset) {
  //   title = "Change Your Password";
  //   subtitle =
  //     "Your password must be reset before you can access the portal. Please enter a new password below.";
  // } else if (type === USER_STATUS.ADMIN) {
  //   title = "Admin Sign in";
  //   subtitle = "Sign in using email to explore features of GFI portal";
  // } else if (type === USER_STATUS.AGENT) {
  //   title = "Sign in to the GFI Tevah portal";
  //   subtitle = isOtpSent
  //     ? "Please enter your 6-digit OTP"
  //     : "Please enter your 10-digit mobile number to receive an OTP";
  // } else {
  //   title = "Create Agent Account";
  //   subtitle = "Give Basic details to create your account";
  // }

  return (
    <>
      {isLoading ? <CircularLoader /> : null}
      <div className="mt-[-56px] flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100">
        <div className="flex h-full w-full max-w-full overflow-hidden shadow-lg">
          {/* Left Section: Advertisement (Hidden on small screens) */}
          <div className="hidden items-center justify-center md:flex md:w-67/120">
            <Advertisement setLoading={setLoading} />
          </div>

          {/* Right Section: SignIn Form */}
          {/* <div className="grid-col grid h-full w-full bg-white p-5 md:w-53/120 "> */}
          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 grid h-[100dvh] w-full overflow-y-auto bg-white p-5 md:w-53/120 md:items-center lg:max-h-[100vh]">
            {/* Top Section */}
            {/* <div className="mt-20 px-0 sm:mt-auto sm:px-10 md:pb-5 lg:px-11"> */}
            <div
              className={`mr-0 mb-0 ml-0 px-0 sm:px-10 md:pb-5 lg:px-11 ${type === USER_STATUS.NEW || isPasswordReset ? "mt-10" : "mt-auto"}`}
            >
              {/* {" "}
             
              <h5 className="text-txt-32 my-0 w-full !text-left font-bold md:text-center">
                {title}
              </h5>
              <div className="text-txt-md-14 text-links mb-4 w-full !text-left font-medium md:text-center">
                {subtitle}
              </div> */}
              <div className="w-full">
                {import.meta.env.VITE_APP_IS_AGENT == "true" ? (
                  type === USER_STATUS.NEW ? (
                    <CreateAgent setLoading={setLoading} />
                  ) : (
                    <SignInAgent
                      setLoading={setLoading}
                      loginData={loginData}
                      setLoginData={setLoginData}
                      redirectTo={redirectTo}
                      isOtpSent={isOtpSent}
                      setOtpSent={setOtpSent}
                    />
                  )
                ) : isPasswordReset ? (
                  <ResetPassword
                    setLoading={setLoading}
                    setIsPasswordReset={setIsPasswordReset}
                  />
                ) : (
                  <SignInAdmin
                    setLoading={setLoading}
                    loginData={loginData}
                    setLoginData={setLoginData}
                    redirectTo={redirectTo}
                    setIsPasswordReset={setIsPasswordReset}
                  />
                )}

                {/* {isPasswordReset ? (
                  <ResetPassword setLoading={setLoading} setIsPasswordReset={setIsPasswordReset} />
                ) : type === USER_STATUS.ADMIN ? (
                  <SignInAdmin
                    setLoading={setLoading}
                    loginData={loginData}
                    setLoginData={setLoginData}
                    redirectTo={redirectTo}
                    setIsPasswordReset={setIsPasswordReset}
                  />
                ) : type === USER_STATUS.AGENT ? (
                  <SignInAgent
                    setLoading={setLoading}
                    loginData={loginData}
                    setLoginData={setLoginData}
                    redirectTo={redirectTo}
                    isOtpSent={isOtpSent}
                    setOtpSent={setOtpSent}
                  />
                ) : type === USER_STATUS.NEW ? (
                  <CreateAgent setLoading={setLoading} />
                ) : null} */}
              </div>
            </div>

            {/* Bottom Section */}
            {!isPasswordReset ? (
              <div className="mt-auto mb-10 sm:mb-0 sm:px-11">
                <div className="flex w-full justify-end gap-2">
                  {/* <LinkButton
                    isActive={true}
                    label={
                      type === USER_STATUS.ADMIN
                        ? "Sign in as Agent"
                        : "Sign in as Admin"
                    }
                    btnStyle={"btn-style !text-gray-600"}
                    onClick={handleLoginTypeToggle}
                  /> */}

                  {/* <Label lblStyle={""} size="lg" label="&#8226;" /> */}

                  <LinkButton
                    isActive={true}
                    label={`Privacy Policy`}
                    btnStyle={"btn-style !text-gray-600 !mr-0"}
                    onClick={() => {
                      window.open("/privacy-policy", "_blank");
                    }}
                  />

                  <Label
                    lblStyle={""}
                    size="lg"
                    label="&#8226;"
                  // className="!hidden sm:!flex"
                  />

                  <LinkButton
                    isActive={true}
                    label={`Terms & Conditions`}
                    btnStyle={"btn-style !text-gray-600 !mr-0"}
                    onClick={() => {
                      window.open("/terms-and-conditions", "_blank");
                    }}
                  />
                </div>

                {/* <div className="ml-2 grid place-items-center text-center">
                  <LinkButton
                    isActive={true}
                    label={`Terms & Conditions`}
                    btnStyle={"btn-style !text-gray-600 sm:!hidden !flex"}
                    onClick={() => {
                      window.open("/terms-and-conditions", "_blank");
                    }}
                  />
                </div> */}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
