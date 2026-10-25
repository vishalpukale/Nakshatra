import React, { version } from "react";
import { useNavigate } from "react-router-dom";

const DashboardDesign = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1.5rem 2rem" }}>
      <h3>Dashboard Design</h3>
    </div>
  );
};

export default DashboardDesign;
