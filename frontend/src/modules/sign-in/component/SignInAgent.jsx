/**
 * --------------------------------------------------------
 * File        : SignInAgent.js
 * Description : Component for handling agent sign-in with OTP verification.
 *               Manages timer, OTP resending, and login flow.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Sends and validates OTP using Redux actions.
 * - Handles UI states for mobile input and OTP verification.
 * - Navigates based on user status (NEW, ONBOARDING, ACTIVE).
 * - Displays error messages via Dialog and Acknowledge components.
 */

import React, { useEffect, useRef, useState } from "react";
import { fetchAllCountry, getOTP, signInAsAgent } from "../slice/signinSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  InputBox,
  Label,
  LinkButton,
  TextInput,
} from "../../../ui-controls/index";
import {
  UNAUTHENTICATED_ROUTES,
  USER_STATUS,
} from "../../../services/constants";
import { Acknowledge } from "../../../components";
import { Dialog } from "../../../ui-controls";
// import { countryOptions } from "../../../services/constants";
import { set, trim } from "lodash";


const INITIAL_LOGIN_STATE = {
  mobileNum: "",
  OTP: "",
  email: "",
  password: "",
};

const INITIAL_ERROR_STATE = {
  mobileNumError: "",
  OTPError: "",
};

const SignInAgent = ({ loginData, setLoginData, setLoading, redirectTo, isOtpSent, setOtpSent }) => {
  // Form validation error state
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const { countryOptions } = useSelector((state) => state.signin);
  // Timer & resend logic state
  const [timer, setTimer] = useState(30);
  const [isResend, setResend] = useState(false);
  const [istoastDelay, setToastDelay] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [countryPhoneCode, setcountryPhoneCode] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const timerRef = useRef(null);

      useEffect(() => {
       setLoading(true);
            dispatch(fetchAllCountry({})).then(({ payload }) => {
            if (payload?.status === 200) {
              const data = payload?.data.data;
              setLoading(false);
          setcountryPhoneCode(data[1])
            }else{

              setLoading(false);
            }
           
          });
        
        }, []);
  

  const closeModal = () => {
    setOpenDialog(false);
  };
  /**
   * Starts or restarts the OTP resend countdown timer.
   */
  const startTimer = () => {
    setTimer(30);
    setResend(false);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(timerRef.current);
          setResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  
  // Cleanup timer when component unmounts.
  useEffect(() => {
    return () => clearInterval(timerRef.current); // clean up on unmount
  }, []);

  // Sends OTP again (resend) if toast delay is not active.
  const resetOtp = () => {
    if (istoastDelay) return;
    if (countryPhoneCode === undefined) {
      alert("Please select country code!");
      return;
    }

    let obj = {
      mobile: loginData.mobileNum,
      email: loginData.email,
      countryPhoneCode: countryPhoneCode.phoneCode || countryOptions[1].phoneCode,
      countryId:countryPhoneCode.id || countryOptions[1].id,
      type: "mobile",
    };

    setLoading(true);
    setToastDelay(true);

    dispatch(getOTP(obj))
      .then((res) => {
        const { message } = res?.payload?.data;
        setDialogMessage(message);
        setLoading(false);
        if (res?.payload?.status === 200) {
          startTimer();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setOpenDialog(true);
      })
      .finally(() => {
        const timer = setTimeout(() => {
          clearTimeout(timer);
          setToastDelay(false)
        }, 4000);
      });
  };

  // Validates if entered mobile number is 10 digits.
  const validateMobileNUm = () => {
    const newErrors = {};
    const regex = /^[0-9]{10}$/;
    if (!regex.test(loginData.mobileNum)) {
      newErrors.mobileNumError = "* Invalid Mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sends OTP to the entered mobile number after validation.
  const onSendOtp = () => {
    if (countryPhoneCode === undefined) {
      alert("Please select country code!");
      return;
    }

    const obj = {
      mobile: loginData.mobileNum,
        countryPhoneCode: countryPhoneCode.phoneCode || countryOptions[1].phoneCode,
      countryId:countryPhoneCode.id || countryOptions[1].id,
      email: loginData.email,
      type: "mobile",
    };

    if (validateMobileNUm() && countryPhoneCode) {
      setLoading(true);
      dispatch(getOTP(obj))
        .then((res) => {
          const { message } = res?.payload?.data;
          setDialogMessage(message);
          if (res?.payload?.status === 200) {
            setOtpSent(true);
            setLoading(false);
            startTimer();
          } else {
            setOpenDialog(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err?.message);
          setLoading(false);
        });
    }
  };

  //Handles input field changes and resets errors.
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setErrors({});
    setLoginData((currState) => ({
      ...currState,
      [name]: value?.replace(/[^0-9]/g, ''),
      // value?.replace(/[^0-9]/g, '')
    }));
    setErrors((currState) => ({
      ...currState,
      [name]: "",
    }));
  };

  // Allows user to change the entered mobile number.
  const onChangeMobileNo = () => {
    setOtpSent(false);
    startTimer();
    setLoginData((currState) => ({
      ...currState,
      OTP: "",
    }));
  };

  //Verifies OTP and logs the agent in.
  //Navigates based on returned user status.
  const onSignInClick = () => {
    const newErrors = {};
    const obj = {
      // userId: 1,
      mobile: loginData.mobileNum,
      countryPhoneCode: countryPhoneCode.phoneCode || countryOptions[1].phoneCode,
      countryId:countryPhoneCode.id || countryOptions[1].id,
      email: loginData.email || "",
      type: "mobile",
      otp: loginData.OTP,
    };

    if (loginData.OTP.length === 6 && countryPhoneCode !== undefined) {
      try {
        setLoading(true);
        dispatch(signInAsAgent(obj)).then(({ payload }) => {
          const { data, message } = payload?.data;
          setDialogMessage(message);

          if (payload?.status === 200) {
            if (data?.user?.status === USER_STATUS.NEW) {
              navigate(`/sign-in?type=${data?.user?.status}`, {
                replace: true,
              });
            } else if (data?.user?.status === USER_STATUS.ONBOARDING) {
              navigate("/agent", { replace: true });
              // navigate("/agent/onboarding");
            } else if (data?.user?.status === USER_STATUS.ACTIVE) {
              if (
                redirectTo &&
                !UNAUTHENTICATED_ROUTES.includes(trim(redirectTo))
              ) {

                // Decode agentObject using useMemo to avoid recalculating
                const decodedAgentObject = getPayload()
                if (
                  decodedAgentObject?.leaderUserId &&
                  decodedAgentObject?.leaderUserId !== data?.user.id
                ) {
                    alert("Your are not authorized to approve or reject agent.");
                  navigate("/agent", { replace: true });
                } else {
                  navigate(redirectTo, { replace: true });
                }
              } else {
                navigate("/agent", { replace: true });
              }
            }
            setLoginData(INITIAL_LOGIN_STATE);
            setLoading(false);
          } else if (payload?.status === 400) {
            newErrors.OTPError = "* Invalid OTP";
            setOpenDialog(true);
            setErrors(newErrors);
            setLoading(false);
          } else {
            setOpenDialog(true);
            setLoading(false);
          }
        });
      } catch (error) {
        setLoading(false);
        console.error("Error during navigation or side effects:", error);
      }
    } else {
      newErrors.OTPError = "* Invalid OTP";
      setErrors(newErrors);
    }
  };
  const getPayload = () => {
    console.log(redirectTo,search)
    // const agentObject = new URLSearchParams(search).get("payload");
       const agentObject = new URLSearchParams(redirectTo).get("payload");
    if (!agentObject) {
      // console.warn("No 'payload' parameter found in the URL.");
      return null;
    }
    try {
      return JSON.parse(atob(agentObject)); // Decode and parse Base64 string
    } catch (error) {
      console.error("Error decoding Base64 string:", error.message);
      return null;
    }
  }
  // return (
  //   <div>
  //     <div className="mb-4">
  //       <InputBox
  //         id={"mobile-number"}
  //         type="text"
  //         placeholder={"Enter Mobile Number"}
  //         label={"Mobile Number"}
  //         name={"mobileNum"}
  //         isDisabled={isOtpSent}
  //         countryCodeDisabled={isOtpSent}
  //         maxLength={10}
  //         onChange={inputChangeHandler}
  //         value={loginData?.mobileNum || ""}
  //         inputStyle="input-field text-sm"
  //         autoFocus={true}
  //         required
  //         countryPhoneCode={true}
  //         onCountryChange={(country) => setcountryPhoneCode(country)}
  //         secondName={
  //           isOtpSent && (
  //             <LinkButton
  //               isActive={true}
  //               size={"xs"}
  //               label={`Change Mobile No.`}
  //               btnStyle="!text-primary-accent !text-txt-md-12 !mt-2 text-end !mr-0"
  //               onClick={onChangeMobileNo}
  //             />
  //           )
  //         }
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") {
  //             onSendOtp();
  //           }
  //         }}
  //       />
  //       {errors.mobileNumError ? (
  //         <div className="text-txt-md-12 text-red-500">
  //           {errors.mobileNumError}
  //         </div>
  //       ) : (
  //         <div
  //           className={
  //             !isOtpSent
  //               ? "text-txt-md-12 mb-[34px] text-red-500"
  //               : "text-txt-md-12 text-red-500"
  //           }
  //         >
  //           {" "}
  //         </div>
  //       )}
  //     </div>

  //     {!isOtpSent ? (
  //       <Button
  //         size={"md"}
  //         name={"Send OTP"}
  //         isDisabled={false}
  //         isActive={true}
  //         onClick={onSendOtp}
  //         btnStyle="w-full !font-medium disabled:opacity-40 !bg-primary-theme rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer"
  //       />
  //     ) : (
  //       <div>
  //         <div className="position-relative mb-2">
  //           <TextInput
  //             id={"OTP"}
  //             type="text"
  //             placeholder={"Enter 6 digit OTP"}
  //             label={"OTP"}
  //             name={"OTP"}
  //             onChange={inputChangeHandler}
  //             maxLength={6}
  //             value={loginData?.OTP || ""}
  //             inputStyle="input-field text-sm"
  //             autoFocus={true}
  //             required
  //             onKeyDown={(e) => {
  //               if (e.key === "Enter") {
  //                 onSignInClick();
  //               }
  //             }}
  //           />

  //           {errors.OTPError ? (
  //             <div className="text-txt-md-12 text-red-500">
  //               {errors.OTPError}
  //             </div>
  //           ) : (
  //             <div className="mb-[26px]"> </div>
  //           )}
  //         </div>

  //         <div>
  //           <Button
  //             size={"md"}
  //             name={"Sign in"}
  //             isDisabled={false}
  //             isActive={true}
  //             onClick={onSignInClick}
  //             btnStyle="w-full !font-medium !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer mt-2"
  //           />
  //         </div>

  //         {isResend ? (
  //           <div className="text-right">
  //             <LinkButton
  //               isActive={true}
  //               label="Resend OTP"
  //               btnStyle="btn-style !text-primary-theme text-txt-14 font-medium"
  //               onClick={resetOtp}
  //             />
  //           </div>
  //         ) : (
  //           <div className="mt-2 text-right">
  //             <Label
  //               lblStyle="!text-primary-theme text-txt-md-14 font-medium"
  //               size="xs"
  //               label={`Resend OTP 00:${timer < 10 ? `0${timer}` : timer}`}
  //             />
  //           </div>
  //         )}
  //       </div>
  //     )}

  //     <Dialog
  //       dialogStyle="error-dialog"
  //       closeModal={closeModal}
  //       visible={isOpenDialog}
  //     >
  //       <Acknowledge
  //         message={dialogMessage}
  //         errorIcon={"icon-URL-not-found1"}
  //       />
  //     </Dialog>
  //   </div>
  // );

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <h5 className="text-txt-32 my-0 w-full !text-left font-bold md:text-center">
      Sign in to the GFI Tevah portal
      </h5>
      <div className="text-txt-md-14 text-links mb-4 w-full !text-left font-medium md:text-center">
      {isOtpSent
      ? "Please enter your 6-digit OTP"
      : "Please enter your 10-digit mobile number to receive an OTP"}
      </div>
  
      {/* Existing Layout */}
      <div className="mb-4">
        <InputBox
          id={"mobile-number"}
          type="text"
          placeholder={"Enter Mobile Number"}
          label={"Mobile Number"}
          name={"mobileNum"}
          isDisabled={isOtpSent}
          countryCodeDisabled={isOtpSent}
          maxLength={10}
          onChange={inputChangeHandler}
          value={loginData?.mobileNum || ""}
          inputStyle="input-field text-sm"
          autoFocus={true}
          required
          countryPhoneCode={true}
          countryOptions={countryOptions}
          PhoneCode={countryPhoneCode}
          onCountryChange={(country) => setcountryPhoneCode(country)}
          secondName={
            isOtpSent && (
              <LinkButton
                isActive={true}
                size={"xs"}
                label={`Change Mobile No.`}
                btnStyle="!text-primary-accent !text-txt-md-12 !mt-2 text-end !mr-0"
                onClick={onChangeMobileNo}
              />
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendOtp();
            }
          }}
        />
        {errors.mobileNumError ? (
          <div className="text-txt-md-12 text-red-500">
            {errors.mobileNumError}
          </div>
        ) : (
          <div
            className={
              !isOtpSent
                ? "text-txt-md-12 mb-[34px] text-red-500"
                : "text-txt-md-12 text-red-500"
            }
          >
            {" "}
          </div>
        )}
      </div>
  
      {!isOtpSent ? (
        <Button
          size={"md"}
          name={"Send OTP"}
          isDisabled={false}
          isActive={true}
          onClick={onSendOtp}
          btnStyle="w-full !font-medium disabled:opacity-40 !bg-primary-theme rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer"
        />
      ) : (
        <div>
          <div className="position-relative mb-2">
            <TextInput
              id={"OTP"}
              type="text"
              placeholder={"Enter 6 digit OTP"}
              label={"OTP"}
              name={"OTP"}
              onChange={inputChangeHandler}
              maxLength={6}
              value={loginData?.OTP || ""}
              inputStyle="input-field text-sm"
              autoFocus={true}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSignInClick();
                }
              }}
            />
  
            {errors.OTPError ? (
              <div className="text-txt-md-12 text-red-500">
                {errors.OTPError}
              </div>
            ) : (
              <div className="mb-[26px]"> </div>
            )}
          </div>
  
          <div>
            <Button
              size={"md"}
              name={"Sign in"}
              isDisabled={false}
              isActive={true}
              onClick={onSignInClick}
              btnStyle="w-full !font-medium !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer mt-2"
            />
          </div>
  
          {isResend ? (
            <div className="text-right">
              <LinkButton
                isActive={true}
                label="Resend OTP"
                btnStyle="btn-style !text-primary-theme text-txt-14 font-medium"
                onClick={resetOtp}
              />
            </div>
          ) : (
            <div className="mt-2 text-right">
              <Label
                lblStyle="!text-primary-theme text-txt-md-14 font-medium"
                size="xs"
                label={`Resend OTP 00:${timer < 10 ? `0${timer}` : timer}`}
              />
            </div>
          )}
        </div>
      )}
  
      <Dialog
        dialogStyle="error-dialog"
        closeModal={closeModal}
        visible={isOpenDialog}
      >
        <Acknowledge message={dialogMessage} errorIcon={"icon-URL-not-found1"} />
      </Dialog>
    </div>
  );
  
};

export default SignInAgent;
