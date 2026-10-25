/**
 * --------------------------------------------------------
 * File        : ResetPassword.js
 * Description : React component for resetting the user password.
 *               Includes form inputs for new password and confirmation,
 *               client-side validation, Redux integration for password reset,
 *               and user feedback with toast notifications.
 * Authors     : Developer team
 * Created On  : 2025-07-17
 * Updated On  : 2025-07-17
 * --------------------------------------------------------
 * Notes:
 * - Validates password length and matching confirmation.
 * - Dispatches resetUserPassword action and handles success/failure.
 * - Redirects user on successful password reset.
 * - Displays error messages inline and as toast notifications.
 */


import React, { useState } from "react";
import _ from "lodash";
import { Button, TextInput } from "../../../ui-controls";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "../slice/signinSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword({setLoading, setIsPasswordReset}) {
  const initialState = {
    newPassword: "",
    confirmPassword: "",
  };
  const [errors, setErrors] = useState(initialState);
  const [passwordData, setPasswordData] = useState(initialState);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setPasswordData((currState) => ({
      ...currState,
      [name]: value,
    }));
    setErrors((currState) => ({
      ...currState,
      [name]: "",
    }));
  };

  const validatePassword = () => {
    const newError = {};

    const newPassword = _.trim(passwordData?.newPassword || "");
    const confirmPassword = _.trim(passwordData?.confirmPassword || "");

    if (!newPassword) {
      newError.newPassword = "Please enter a new password.";
    } else if (newPassword.length < 6) {
      newError.newPassword =
        "Your new password must be at least 6 characters long.";
    }
    if (!confirmPassword) {
      newError.confirmPassword = "Please confirm your new password.";
    } else if (newPassword && newPassword !== confirmPassword) {
      newError.confirmPassword =
        "The passwords do not match. Please try again.";
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = () => {
    if (!validatePassword()) return;

    setLoading(true)
    const params = {
      newPassword: passwordData.newPassword,
    };
    
    dispatch(resetUserPassword(params)).then(({payload})=>{
      if(payload?.status === 200){
        setIsPasswordReset(false);
        navigate("/admin", { replace: true });
        toast.success("Login successfully", {
          theme: "colored",
        });
      }else {
        if (payload?.data.message) {
          toast.error(payload?.data.message, {
            theme: "colored",
          });
        }
        setLoading(false);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("Error in reseting password:", err.message)
    });

  };

  // return (
  //   <div className="grid">
  //     <div>
  //       <TextInput
  //         name="newPassword"
  //         id="new-password"
  //         type="password"
  //         placeholder="Enter New Password"
  //         label="New Password"
  //         onChange={inputChangeHandler}
  //         value={passwordData.newPassword || ""}
  //         inputStyle="input-field text-sm"
  //         autoComplete="new-password"
  //         autoFocus={true}
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") {
  //             handleSubmit();
  //           }
  //         }}
  //       />
  //       <div className="h-4">
  //         {errors.newPassword && (
  //           <div className="text-sm text-red-500">{errors.newPassword}</div>
  //         )}
  //       </div>
  //     </div>
  //     <div>
  //       <TextInput
  //         name="confirmPassword"
  //         id="confirmPassword"
  //         type="password"
  //         placeholder="Confirm Password"
  //         label="Confirm Password"
  //         onChange={inputChangeHandler}
  //         value={passwordData.confirmPassword || ""}
  //         inputStyle="input-field text-sm"
  //         autoFocus={true}
  //         autoComplete="new-password"
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") {
  //             handleSubmit();
  //           }
  //         }}
  //       />
  //       <div className="h-4">
  //         {errors.confirmPassword && (
  //           <div className="text-sm text-red-500">{errors.confirmPassword}</div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="my-3.5 text-center">
  //       <Button
  //         size={"md"}
  //         name={"Change Password"}
  //         onClick={handleSubmit}
  //         isDisabled={false}
  //         isActive={true}
  //         isHoverEnable={true}
  //         btnStyle="w-full !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer !mt-1"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <h5 className="text-txt-32 my-0 w-full !text-left font-bold md:text-center">
        Reset Password
      </h5>
      <div className="text-txt-md-14 text-links mb-4 w-full !text-left font-medium md:text-center">
        Enter and confirm your new password to continue
      </div>
  
      {/* Existing Layout */}
      <div className="grid">
        <div>
          <TextInput
            name="newPassword"
            id="new-password"
            type="password"
            placeholder="Enter New Password"
            label="New Password"
            onChange={inputChangeHandler}
            value={passwordData.newPassword || ""}
            inputStyle="input-field text-sm"
            autoComplete="new-password"
            autoFocus={true}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <div className="h-4">
            {errors.newPassword && (
              <div className="text-sm text-red-500">{errors.newPassword}</div>
            )}
          </div>
        </div>
  
        <div>
          <TextInput
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            onChange={inputChangeHandler}
            value={passwordData.confirmPassword || ""}
            inputStyle="input-field text-sm"
            autoFocus={true}
            autoComplete="new-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <div className="h-4">
            {errors.confirmPassword && (
              <div className="text-sm text-red-500">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
  
        <div className="my-3.5 text-center">
          <Button
            size={"md"}
            name={"Change Password"}
            onClick={handleSubmit}
            isDisabled={false}
            isActive={true}
            isHoverEnable={true}
            btnStyle="w-full !bg-primary-theme disabled:opacity-40 rounded-sm-4 focus:outline-none hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer !mt-1"
          />
        </div>
      </div>
    </div>
  );
  

}



export default ResetPassword;
