import React, { useState, useRef } from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

const TruncatedTooltip = ({ text, className = "", id, direction = "bottom", subLabel = "",
    showSubLabel = false, }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef(null);

  const checkTruncation = () => {
    if (textRef.current) {
      const element = textRef.current;
      return element.scrollWidth > element.clientWidth;
    }
    return false;
  };

  const handleMouseEnter = () => {
    if (checkTruncation()) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const textElement = (
    <div
      ref={textRef}
      className={`truncate w-full cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </div>
  );

  return (
    <div className="relative w-full" id={id}>
    <span>  {showTooltip ? (
        <Tooltip
          placement={direction}
          overlay={text}
          destroyTooltipOnHide
        >
          {textElement}
        </Tooltip>
      ) : (
        textElement
      )}</span>
        {showSubLabel && (
                <span className="text-gray-500 truncate text-xs">{subLabel}</span>
            )}
    </div>
  );
};

export default TruncatedTooltip;
