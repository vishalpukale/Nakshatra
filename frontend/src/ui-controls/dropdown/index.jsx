import React, { Fragment, useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import { map } from "lodash";

import { getTestId } from "../../services/utils";

const Dropdown = ({
  id,
  placeholder,
  options = [],
  optionLabel,
  optionValue,
  onChange,
  isDisabled,
  value,
  mainStyle,
  dropdownStyle,
  menuStyle,
  itemStyle,
  btnStyle,
  iconStyle,
  menuDirection,
  isFloatPlaceholder,
  clearOptionEnable,
  clearOptionLabel = "Clear",
  ...rest
}) => {
  const [dynamicMenuDirection, setDynamicMenuDirection] =
    useState("top-full mt-2");
  const dropdownRef = useRef(null);

  const handlePosition = () => {
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 200; // your max dropdown height

    if (spaceBelow < dropdownHeight + 40) {
      setDynamicMenuDirection("bottom-full mb-2"); // render above
    } else {
      setDynamicMenuDirection("top-full mt-2"); // render below
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handlePosition);
    return () => window.removeEventListener("resize", handlePosition);
  }, []);

  const menuItems = map(options, (option, index) => {
    let isSelected = (value && value[optionValue]) === option[optionValue];
    let dataTestId = getTestId(`${id}_${option[optionLabel]}`);
    return (
      <MenuItem key={index} datatestid={dataTestId}>
        {({ active }) => (
          <span
            onClick={() => onChange && onChange(option)}
            className={classNames(itemStyle, {
              "custom-text-size hover:text-color-text ellipsis block w-full overflow-hidden pt-1.5 pb-2 text-sm whitespace-nowrap": true,
              "text-color-text rounded-xs-2 cursor-pointer font-medium":
                active || isSelected,
              "text-gray-500": !active || !isSelected,
            })}
          >
            {option[optionLabel]}
          </span>
        )}
      </MenuItem>
    );
  });

  const menuItemLength = options?.length > 5;

  return (
    <Menu
      id={id}
      as="div"
      ref={dropdownRef}
      className={classNames(
        dropdownStyle,
        isDisabled
          ? "relative inline-block !cursor-not-allowed text-left"
          : "relative inline-block !cursor-pointer text-left",
      )}
      {...rest}
    >
      {({ open }) => {
        useEffect(() => {
          if (open) {
            handlePosition(); // Recalculate when menu opens
          }
        }, [open]);

        return (
          <>
            <>
              {value && value[optionLabel] && isFloatPlaceholder ? (
                <label className="text-primary-theme-1 rounded-sm-4 absolute -top-[7px] left-[5px] z-1 bg-white px-1.5 text-[0.75rem] font-medium backdrop-blur-md">
                  {placeholder}
                </label>
              ) : null}
              <MenuButton
                className={classNames(mainStyle, {
                  "border-primary-theme cursor-pointer": open,
                  "cursor-pointer border-gray-300": !open,
                  "rounded-sm-4 svg-algnmt w-full cursor-pointer border px-3 py-2 text-left text-sm shadow-sm focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none disabled:opacity-50": true,
                  "cursor-default": isDisabled,
                })}
                disabled={isDisabled}
              >
                <div className={btnStyle}>
                  {(value && value[optionLabel]) || placeholder}
                </div>
                <ChevronDownIcon
                  className={classNames(iconStyle, {
                    "-mr-1 ml-2 h-5 w-5": true,
                  })}
                  aria-hidden="true"
                />
              </MenuButton>
            </>

            <Transition
              show={open || false}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              {/* "scrollbar-none scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-300 rounded-sm-4 dd-shadow ring-opacity-0 absolute left-0 z-50 max-h-[150px] w-full origin-top-left overflow-x-hidden overflow-y-scroll bg-white shadow-lg ring-1 ring-black outline-none focus:outline-none", */}
              <Menu.Items
                static
                className={classNames(
                  "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-sm-4 dd-shadow ring-opacity-0 absolute left-0 z-50 max-h-[150px] w-full origin-top-left overflow-x-hidden overflow-y-scroll bg-white shadow-lg ring-1 ring-black outline-none focus:outline-none",
                  menuStyle,
                  menuDirection || dynamicMenuDirection, // Use prop or dynamic direction
                )}
              >
                <div className="px-1 py-1">
                  {clearOptionEnable && (
                    <MenuItem key="clear-option">
                      {({ active }) => (
                        <span
                          onClick={() => onChange(null)}
                          className={classNames(itemStyle, {
                            "custom-text-size ellipsis block w-full overflow-hidden pt-1.5 pb-2 text-sm whitespace-nowrap !text-[#a4b7c5] italic hover:!text-[#a4b7c5]": true,
                            "rounded-xs-2 cursor-pointer bg-gray-100 font-medium !text-[#a4b7c5] italic":
                              active,
                            "text-gray-500": !active,
                          })}
                        >
                          --{clearOptionLabel}--
                        </span>
                      )}
                    </MenuItem>
                  )}
                  {menuItems}
                </div>
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  dropdownStyle: PropTypes.string,
  mainStyle: PropTypes.string,
  menuStyle: PropTypes.string,
  itemStyle: PropTypes.string,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
  clearOptionEnable: PropTypes.bool,
  clearOptionLabel: PropTypes.string,
};

Dropdown.defaultProps = {
  id: "dropdown",
  placeholder: "Select",
  options: [],
  value: {},
  isDisabled: false,
  dropdownStyle: "w-full",
  menuStyle: "",
  itemStyle: "",
  iconStyle: "",
  isFloatPlaceholder: false,
  clearOptionEnable: false,
  clearOptionLabel: "Clear",
};
export default Dropdown;
