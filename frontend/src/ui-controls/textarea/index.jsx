import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const TextArea = ({
  id,
  label: name,
  value,
  onChange,
  isDisabled,
  placeholder,
  isRequired,
  textAreaStyle,
  labelStyle,
  ...rest
}) => {
  var labelClass = classNames(labelStyle, {
    "block text-secondary-theme": true,
  });
  var textAreaClass = classNames(textAreaStyle, {
    "px-3.5 py-2.5 block w-full resize-none border-gray-200 rounded-sm-4": true,
  });
  return (
    <>
      {name ? (
        // <label htmlFor={name} className={labelClass}>
        //   {name}
        // </label>
        <label
          htmlFor={name}
          className={`${labelClass} text-txt-md-13 block !text-gray-800`}
        >
          {name} {isRequired && <span className="text-red-500">*</span>}
        </label>
      ) : null}
      <textarea
        id={id}
        name={name}
        value={value}
        disabled={isDisabled}
        onChange={(e) => onChange && onChange(e)}
        className={textAreaClass}
        placeholder={placeholder}
        {...rest}
      ></textarea>
    </>
  );
};

TextArea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  textAreaStyle: PropTypes.string,
  labelStyle: PropTypes.string,
  isRequired: PropTypes.bool,
};

TextArea.defaultProps = {
  id: "text-area",
  placeholder: "Enter",
  value: "",
  isDisabled: false,
  textAreaStyle: "",
  labelStyle: "",
  isRequired: false,
};
export default TextArea;
