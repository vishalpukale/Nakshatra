/**
 * --------------------------------------------------------
 * File        : SignInAdmin.js
 * Description : Component for handling admin sign-in using email/password.
 *               Performs form validation, dispatches login action, and
 *               navigates based on user status (NEW, ONBOARDING, ACTIVE).
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Uses Redux for sign-in flow.
 * - Validates email and password before dispatching login.
 * - Shows feedback using Acknowledge & Dialog components.
 * - Uses shared loginData state passed as props.
 */

import React, { useState } from "react";
import { signInAsAdmin } from "../slice/signinSlice";
import { useDispatch } from "react-redux";
import { validateEmail } from "../../../services/utils";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../../ui-controls/index";
import { OpenEye } from "../../../assets";
import { USER_STATUS } from "../../../services/constants";
import { Acknowledge } from "../../../components";
import { Dialog } from "../../../ui-controls";
import { toast } from "react-toastify";

const SignInAdmin = ({ loginData, setLoginData, setLoading, setIsPasswordReset }) => {
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const [isOpenDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Closes the error/info dialog box.
   */
  const closeModal = () => {
    setOpenDialog(false);
  };

  /**
   * Validates email and password fields.
   * Returns true if both fields are valid.
   */
  const validateNumPassword = () => {
    const newErrors = {};

    if (!validateEmail(loginData.email) || !loginData.email) {
      newErrors.emailError = "Enter valid email";
    }

    if (!loginData.password) {
      newErrors.passwordError = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles validation before triggering the actual login call.
   */
  const onAdminLogin = () => {
    if (validateNumPassword()) {
      onLoginClick();
    }
  };

  /**
   * Calls the sign-in API for admin.
   * Based on the user status returned, navigates accordingly.
   */
  const onLoginClick = () => {
    const authObj = {
      email: loginData.email,
      password: loginData.password,
    };

    setLoading(true);

    dispatch(signInAsAdmin(authObj))
      .then((res) => {
        const { data, message } = res?.payload?.data;
        setDialogMessage(message);
        if (res?.payload?.status === 200) {
          if(data?.user.mustResetPassword){
            setIsPasswordReset(true)
            setLoading(false)
          }else{
          navigate("/admin", { replace: true });
          setOpenDialog(true);
          toast.success("Login successfully", {
            theme: "colored",
          });

          // Reset all form values after successful login
          setLoginData({
            mobileNum: "",
            OTP: "",
            email: "",
            password: "",
          });

          setLoading(false);
        } 
      }else {
          if (res?.payload?.data.message) {
            toast.error(res?.payload?.data.message, {
              theme: "colored",
            });
          }
          setLoading(false);
          setOpenDialog(true);
        }
      })
      .catch((err) => {
        setOpenDialog(true);
        setLoading(false);
      });
  };

  /**
   * Handles change in form fields and resets individual errors.
   */
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setErrors({});
    setLoginData((currState) => ({
      ...currState,
      [name]: value,
    }));

    setErrors((currState) => ({
      ...currState,
      [name]: "",
    }));
  };

  // return (
  //   <div className="grid">
  //     {/* Email Input Field */}
  //     <div className="grid">
  //       <div className="position-relative">
  //         <TextInput
  //           name="email"
  //           id="email"
  //           type="email"
  //           placeholder="Enter Email Address"
  //           label="Email"
  //           onChange={inputChangeHandler}
  //           value={loginData.email || null}
  //           inputStyle="input-field text-sm"
  //           autoFocus={true}
  //           required
  //           onKeyDown={(e) => {
  //             if (e.key === "Enter") onAdminLogin();
  //           }}
  //         />
  //         {errors.emailError ? (
  //           <div className="text-txt-md-12 text-red-500">
  //             {errors.emailError}
  //           </div>
  //         ) : (
  //           <div className="mb-[17.5px]"></div>
  //         )}
  //       </div>

  //       {/* Password Input Field */}
  //       <div className="position-relative">
  //         <TextInput
  //           name="password"
  //           id="password"
  //           type="password"
  //           placeholder="Enter Password"
  //           label="Password"
  //           onChange={inputChangeHandler}
  //           value={loginData.password || null}
  //           inputStyle="input-field text-sm"
  //           image={OpenEye}
  //           required
  //           onKeyDown={(e) => {
  //             if (e.key === "Enter") onAdminLogin();
  //           }}
  //         />

  //         {errors.passwordError ? (
  //           <div className="text-txt-md-12 text-red-500">
  //             {errors.passwordError}
  //           </div>
  //         ) : (
  //           <div className="mb-[17.5px]"></div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Login Button */}
  //     <div>
  //       <Button
  //         size="md"
  //         name="Sign in"
  //         isDisabled={false}
  //         isActive={true}
  //         btnStyle="w-full !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer !mt-1"
  //         onClick={onAdminLogin}
  //       />
  //     </div>

  //     {/* Dialog for success or failure messages */}
  //     {/* <Dialog
  //       dialogStyle="error-dialog"
  //       closeModal={closeModal}
  //       visible={isOpenDialog}
  //     >
  //       <Acknowledge message={dialogMessage} errorIcon="icon-URL-not-found1" />
  //     </Dialog> */}
  //   </div>
  // );

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <h5 className="text-txt-32 my-0 w-full !text-left font-bold md:text-center">
        Admin Sign in
      </h5>
      <div className="text-txt-md-14 text-links mb-4 w-full !text-left font-medium md:text-center">
      Sign in using email to explore features of GFI portal
      </div>
  
      {/* Existing Layout */}
      <div className="grid">
        {/* Email Input Field */}
        <div className="grid">
          <div className="position-relative">
            <TextInput
              name="email"
              id="email"
              type="email"
              placeholder="Enter Email Address"
              label="Email"
              onChange={inputChangeHandler}
              value={loginData.email || null}
              inputStyle="input-field text-sm"
              autoFocus={true}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") onAdminLogin();
              }}
            />
            {errors.emailError ? (
              <div className="text-txt-md-12 text-red-500">
                {errors.emailError}
              </div>
            ) : (
              <div className="mb-[17.5px]"></div>
            )}
          </div>
  
          {/* Password Input Field */}
          <div className="position-relative">
            <TextInput
              name="password"
              id="password"
              type="password"
              placeholder="Enter Password"
              label="Password"
              onChange={inputChangeHandler}
              value={loginData.password || null}
              inputStyle="input-field text-sm"
              image={OpenEye}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") onAdminLogin();
              }}
            />
  
            {errors.passwordError ? (
              <div className="text-txt-md-12 text-red-500">
                {errors.passwordError}
              </div>
            ) : (
              <div className="mb-[17.5px]"></div>
            )}
          </div>
        </div>
  
        {/* Login Button */}
        <div>
          <Button
            size="md"
            name="Sign in"
            isDisabled={false}
            isActive={true}
            btnStyle="w-full !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer !mt-1"
            onClick={onAdminLogin}
          />
        </div>
  
        {/* Dialog for success or failure messages */}
        {/* <Dialog
          dialogStyle="error-dialog"
          closeModal={closeModal}
          visible={isOpenDialog}
        >
          <Acknowledge message={dialogMessage} errorIcon="icon-URL-not-found1" />
        </Dialog> */}
      </div>
    </div>
  );
  

};

export default SignInAdmin;
