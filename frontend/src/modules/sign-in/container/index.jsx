/**
 * --------------------------------------------------------
 * File        : SignIn.js
 * Description : Container component for rendering the sign-in screen,
 *               including the header and main sign-in logic component.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Renders a consistent header across pages.
 * - Wraps and displays <SignInPage />, which handles login flows.
 */

import React from "react";
import Header from "../../../components/header";
import SignInPage from "../component/SignInPage";
import { useLocation } from "react-router-dom";

const SignIn = () => {
  return (
    <div>
      {/* Top-level header visible on all auth pages */}
      <Header />
      <div className="4xl:mt-28 mt-14"></div>
      {/* Main login/signup logic container */}
      <SignInPage />
    </div>
  );
};

export default SignIn;
