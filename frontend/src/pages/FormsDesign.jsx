import React, { version } from "react";
import { useNavigate } from "react-router-dom";

const FormsDesign = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1.5rem 2rem" }}>
      <h3>Form Design</h3>
    </div>
  );
};

export default FormsDesign;
