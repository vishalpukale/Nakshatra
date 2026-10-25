import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { LinkButton } from "../index"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const AlertBanner = ({
  icon,
  highlightText,
  mainText,
  additionalText,
  onClose,
  containerStyle,
  highlightClass,
  textClass,
  hasRequests,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={classNames(
        "bg-orange-alert text-txt-md-12 relative h-8 w-full px-4",
        containerStyle,
      )}
    >
      <div className="grid h-full w-full grid-cols-[1fr_auto_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          {icon && <img src={icon} alt="icon" className="h-5 w-5 shrink-0" />}

          <div className="text-txt-md-12 line-clamp-1 overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
            {mainText}{" "}
            {highlightText && (
              <span className={classNames("text-red-500", highlightClass)}>
                {highlightText}
              </span>
            )}{" "}
            {additionalText && (
              <span className={classNames("text-txt-md-12", textClass)}>
                {additionalText}
              </span>
            )}
          </div>
        </div>

        {Number(hasRequests) > 0 && (
          <p className="text-sm whitespace-nowrap text-gray-700">
            You have{" "}
            <LinkButton
              isActive={true}
              label={`${hasRequests} requests`}
              btnStyle="btn-style !text-cyan-500 !mr-1"
              onClick={() => navigate("/agent/agent-requests")}
            />
            pending.
          </p>
        )}

        <LinkButton
          isActive={true}
          label="×"
          btnStyle="btn-style !text-2xl !text-gray-600"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

AlertBanner.propTypes = {
  icon: PropTypes.string,
  highlightText: PropTypes.string,
  mainText: PropTypes.string,
  additionalText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  containerStyle: PropTypes.string,
  highlightClass: PropTypes.string,
  textClass: PropTypes.string,
};

AlertBanner.defaultProps = {
  icon: "",
  highlightText: "",
  mainText: "",
  additionalText: "",
  containerStyle: "",
  highlightClass: "",
  textClass: "",
};

export default AlertBanner;
