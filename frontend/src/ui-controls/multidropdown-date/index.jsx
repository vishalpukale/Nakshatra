import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import Options from "./dateOptions"; // Your existing component
import { isDate, map, rest } from "lodash";
import ScrollBar from "../scrollbar"; // Your custom scrollbar
import { createPortal } from "react-dom";

const DateOptionsDropdown = ({
  id = "date-dropdown",
  placeholder = "Select Date",
  options = [],
  optionLabel = "label",
  optionValue = "id",
  optionItems = "children", // nested children
  value = {},
  onChange,
  isDisabled = false,
  menuStyle,
  buttonStyle,
  itemsScrollHeight = "max-h-64", // Tailwind class
  isFloatPlaceholder = true,
  buttonDivStyle, // To control floating label
  ...rest
}) => {
  const [openLevels, setOpenLevels] = useState([]);
  const [activeParent, setActiveParent] = useState(null);
  const [parentPosition, setParentPosition] = useState({ top: 0, left: 0 });
  const [showDateInputs, setShowDateInputs] = useState(false); // To control showing date inputs
  const [menuOpen, setMenuOpen] = useState(false);
  const [containerPosition, setContainerPosition] =
    useState("top-0 left-[-100%]");

  const parentRef = useRef(null);
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleParentClick = (e, option) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setParentPosition({ top: rect.top, left: rect.right }); // right of parent
    setActiveParent(option);
    onToggleLevel(option[optionValue]);
  };

  const onToggleLevel = (level) => {
    if (openLevels.includes(level)) {
      setOpenLevels(openLevels.filter((item) => item !== level));
    } else {
      setOpenLevels([...openLevels, level]);
      setTimeout(calculateDropdownPosition, 0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShowDateInputs(false);
        setOpenLevels([]);
        setActiveParent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSelect = (option) => {
    if (option.id === "custom") {
      // If selecting "Select Range", show date inputs without closing the dropdown
      setShowDateInputs(true);
    } else {
      // Otherwise, select the option and close the dropdown
      setOpenLevels([]);
      onChange(option);
      setMenuOpen(false);
    }
  };

  const calculateDropdownPosition = useCallback(() => {
    if (!menuButtonRef.current || !dropdownRef.current) return;

    const menuButton = menuButtonRef.current;
    const dropdown = dropdownRef.current.querySelector('[role="menu"]');

    if (!dropdown) return;

    // Get input element dimensions and position
    const buttonRect = menuButton.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available space in each direction relative to viewport
    const spaceLeft = buttonRect.left;
    const spaceRight = viewportWidth - buttonRect.right;
    const spaceTop = buttonRect.top;
    const spaceBottom = viewportHeight - buttonRect.bottom;

    // Dropdown dimensions (estimated or measured)
    const dropdownWidth = dropdownRect.width || buttonRect.width; // Use button width as fallback
    const dropdownHeight = dropdownRect.height || 300; // fallback height

    let horizontalClass = "left-0"; // default to left alignment
    let verticalClass = "top-full"; // default to below input
    let shouldRenderBottom = false;

    // Determine position based on your specific requirements:
    // 1. If left side doesn't have space → render right
    // 2. If right side doesn't have space → render left
    // 3. If both left and right don't have space → render bottom

    if (spaceLeft < dropdownWidth && spaceRight >= dropdownWidth) {
      // Left doesn't have space, but right does → render right
      horizontalClass = "left-[180px]";
      verticalClass = "top-[0px] mt-2";
    } else if (spaceRight < dropdownWidth && spaceLeft >= dropdownWidth) {
      // Right doesn't have space, but left does → render left
      horizontalClass = "right-[320px]";
      verticalClass = "top-[0px] mt-2";
    } else if (spaceLeft < dropdownWidth && spaceRight < dropdownWidth) {
      // Both left and right don't have space → render bottom
      shouldRenderBottom = true;
      horizontalClass = "left-0";
      verticalClass = "top-full mt-2";
    } else {
      // Both sides have space → default to left (right side of button)
      horizontalClass = "left-[128px]";
      verticalClass = "top-[0px] mt-2";
    }

    // If should render bottom, override vertical positioning
    if (shouldRenderBottom) {
      if (spaceBottom >= dropdownHeight) {
        verticalClass = "top-full mt-2";
      } else if (spaceTop >= dropdownHeight) {
        verticalClass = "bottom-full mb-2";
      } else {
        // Not enough space above or below, choose the side with more space
        verticalClass =
          spaceBottom > spaceTop ? "top-full mt-2" : "bottom-full mb-2";
      }
    }

    const newPosition = `${verticalClass} ${horizontalClass}`;
    setContainerPosition(newPosition);
  }, []);

  const renderMenuItems = () => {
    return map(options, (option, index) => {
      const isSelected = value?.[optionValue] === option[optionValue];
      const hasChildren = option[optionItems]?.length > 0;
      const isToggle = openLevels.includes(option[optionValue]);
      const Icon = isToggle ? ChevronDownIcon : ChevronRightIcon;

      if (hasChildren) {
        return (
          <div key={index}>
            <div
              onClick={(e) => handleParentClick(e, option)}
              className={classNames(
                "text-txt-md-12 flex cursor-pointer items-center justify-between px-3 py-2 font-semibold",
                {
                  "bg-gray-100 font-medium": isToggle,
                  "text-primary-theme": hasChildren,
                  "text-gray-700": !isToggle,
                },
              )}
              ref={parentRef}
            >
              <span>{option[optionLabel]}</span>
              <Icon className="h-4 w-4" />
            </div>

            {/* Recursive rendering of children */}
            {activeParent?.[optionValue] === option[optionValue] &&
              openLevels.includes(option[optionValue]) && (
                <div
                  className={`absolute z-60 rounded-md border bg-white shadow-lg ${containerPosition}`}
                >
                  <Options
                    id={id}
                    openLevels={openLevels}
                    onToggleLevel={onToggleLevel}
                    onSelect={(opt) => {
                      onSelect(opt);
                      setActiveParent(null); // hide after selection
                    }}
                    value={value}
                    data={activeParent}
                    optionLabel={optionLabel}
                    optionValue={optionValue}
                    optionItems={optionItems}
                    itemStyle="py-1 text-sm"
                    innerItemStyle=""
                  />
                </div>
              )}
          </div>
        );
      }

      // Only leaf options go inside MenuItem (clicking them closes the dropdown)
      return (
        <div key={index}>
          <MenuItem>
            {({ active }) => (
              <div
                onClick={() => onSelect(option)}
                className={classNames("cursor-pointer px-3 py-1 text-sm", {
                  "text-primary-theme bg-gray-100 font-semibold":
                    active || isSelected,
                  "text-gray-700": !active,
                })}
              >
                {option[optionLabel]}
              </div>
            )}
          </MenuItem>
        </div>
      );
    });
  };

  return (
    <Menu
      as="div"
      ref={dropdownRef}
      className={`relative inline-block h-full w-full rounded-lg border border-gray-300 text-left hover:cursor-pointer ${menuStyle}`}
    >
      <div className={`h-full ${buttonDivStyle}`}>
        {value && value[optionLabel] && isFloatPlaceholder ? (
          <label className="text-primary-theme-1 rounded-sm-4 absolute -top-[7px] left-[5px] z-1 bg-white px-1.5 text-[10px] font-medium backdrop-blur-md">
            {placeholder}
          </label>
        ) : null}
        <MenuButton
          ref={menuButtonRef}
          className={classNames(
            `border-1.5 flex !h-full w-full items-center rounded-lg border-gray-200 bg-white px-2 text-sm ${buttonStyle}`,
            {
              "cursor-not-allowed opacity-50": isDisabled,
            },
          )}
          disabled={isDisabled}
          onClick={() => setMenuOpen(true)}
        >
          <span className="mr-2 text-[#A3AED0]">
            <i className="fa-regular fa-calendar" />
          </span>
          <span className="truncate">
            {value?.[optionLabel] || placeholder}
          </span>
        </MenuButton>
      </div>

      {menuOpen && (
        <Transition
          as={Fragment}
          show={menuOpen}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems
            static
            className="absolute z-50 mt-2 w-full origin-top-right bg-white shadow-lg focus:outline-none"
          >
            <div>{renderMenuItems()}</div>
          </MenuItems>
        </Transition>
      )}
      {/* Render date input fields if showDateInputs is true */}
      {/* {showDateInputs && (
        <div className="flex flex-col gap-3 bg-white p-3 text-black">
          <div className="flex items-center gap-2">
            <label className="w-12 text-sm font-medium">From:</label>
            <div className="relative w-full">
              <input
                type="date"
                className="w-full rounded border px-3 py-1 text-sm"
                value={customFromDate || ''}
                onChange={(e) => setCustomFromDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-12 text-sm font-medium">To:</label>
            <div className="relative w-full">
              <input
                type="date"
                className="w-full rounded border px-3 py-1 text-sm"
                value={customToDate || ''}
                onChange={(e) => setCustomToDate(e.target.value)}
              />
            </div>
          </div>

          <button
            className="mt-2 self-end rounded bg-indigo-600 px-4 py-1 text-sm text-white hover:bg-indigo-700"
            onClick={() => {
              onSelect({
                id: "custom_range",
                label: `Custom: ${customFromDate} - ${customToDate}`,
                from: customFromDate,
                to: customToDate,
              });
              setShowDateInputs(false);
              setMenuOpen(false)
            }}
          >
            Apply
          </button>
        </div>
      )} */}
    </Menu>
  );
};

export default DateOptionsDropdown;
