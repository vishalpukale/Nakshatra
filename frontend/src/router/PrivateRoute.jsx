/**
 * --------------------------------------------------------
 * File        : PrivateRoute.js
 * Description : Custom route wrapper that protects private routes based on
 *               authentication status and user access permissions.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Redirects to `/sign-in` if the user is not authenticated.
 * - Redirects to `/unauthorized` if the user lacks permission for the route.
 * - Requires `screen` prop to match against user's access rights.
 */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { canAccessRoute, getToken } from "../services/utils";
import { selectUserLoggedIn } from "../modules/sign-in/slice/signinSlice";
import { some } from "lodash";
import Unauthorized from "./Unauthorized";

const PrivateRoute = ({ children, screen }) => {
  const isLoggedIn = useSelector(selectUserLoggedIn);
  const { userData } = useSelector(({ signin }) => signin);
  const currentPath = location.pathname;
  const jwt_token = getToken();
  const { agentDashboardData } = useSelector((state) => state.agentDashboard);
 
  if (!isLoggedIn || !jwt_token) {
    const { href, origin } = window.location;
    const redirect_to = encodeURIComponent(href.replace(origin, ""));
    let to = `/sign-in`
    if (href.includes("agent/agent-approval?agent_id")) {
      to = `/sign-in?redirect_to=${redirect_to}`
    }
    return <Navigate replace to={to} />;
  }

  const hasMenuAccess = some(
    userData?.userAccess,
    ({ moduleCode }) => moduleCode === screen,
  );

  const userStatus = agentDashboardData?.status; 
  const isBlocked = canAccessRoute(currentPath, userStatus);
  
  if (!hasMenuAccess || !isBlocked) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
