import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const ProgressIndicator = ({
  id = "progress-bar",
  progress = 50,
  isLabelVisible = false,
  labelColor = "#e80909",
  height = "20px",
  bgColor = "#4caf50",
  baseBgColor = "#e0e0e0",
  borderRadius = "8px",
  labelAlignment = "left",
  transitionDuration="1s",
  labelSize="0.8rem"
}) => {
  return (
    <div
      id={id}
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <ProgressBar
        completed={progress}
        labelAlignment={labelAlignment}
        isLabelVisible={isLabelVisible}
        labelColor={labelColor}
        height={height}
        bgColor={bgColor}
        baseBgColor={baseBgColor}
        borderRadius={borderRadius}
        animateOnRender={true}
  transitionDuration={transitionDuration}
    labelSize={labelSize}
  
      />
    </div>
  );
};

export default ProgressIndicator;
