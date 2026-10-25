import React, { useState } from "react";
import PropTypes from "prop-types";

const Accordion = ({
  title,
  children,
  isOpenByDefault = false,
  isSidebarCollapsed = false,
  titleIcon
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="text-white text-left">
      <button
        onClick={toggleAccordion}
        className={`text-txt-md-13 mx-3 flex items-center gap-3 justify-between rounded-3xl px-4 py-3 cursor-pointer hover:bg-white/10
          ${!isSidebarCollapsed ? "hover:bg-white/10 py-3 w-53" : "hover:bg-white/10 p-4"}
        `}
      >
        {/* Icon (optional if you want a dropdown arrow always visible) */}
        <span className="flex items-center gap-3">
          {/* Placeholder icon or insert yours */}
          {titleIcon}
          {!isSidebarCollapsed && <span>{title}</span>}
        </span>

        {/* Toggle icon */}
        {!isSidebarCollapsed && (
    <span className="grid items-center transition-transform duration-200">
      {isOpen 
      ? <i className="icon-arrow-up text-[16px]"></i> 
      : <i className="icon-arrow-down text-[16px]"></i>
      }
    </span>
  )}
      </button>

      {/* Collapsible content */}
      <div
        className={`transition-all mt-1 duration-300 ease-in-out overflow-hidden
          ${isOpen ? "max-h-[500px]" : "max-h-0 w-auto"}
          ${!isSidebarCollapsed ? "ml-3 w-52" : ""}
        `}
      >
        {isOpen && children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpenByDefault: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool,
};

export default Accordion;
