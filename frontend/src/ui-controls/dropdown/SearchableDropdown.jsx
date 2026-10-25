import { useEffect, useRef, useState, useCallback } from "react";
import OutsideClickHandler from "react-outside-click-handler";

const SearchableDropdown = ({
  options = [],
  optionLabel = "label",
  optionValue = "value",
  id,
  name,
  value, // This is the selected value
  onChange,
  placeholder = "Search...",
  disabled = false,
  className = "",
  maxHeight = "150px",
  noResultsText = "No data found",
  clearable = true,
  onFocus,
  onBlur,
  mainStyle,
  inputStyle,
  buttonStyle,
  isFloatPlaceholder = false,
  itemStyle
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  const calculateDropdownPosition = useCallback(() => {
    if (!inputRef.current) return;

    // Find the scrollable parent container
    let container = inputRef.current.parentElement;

    while (container && container !== document.body) {
      const computedStyle = window.getComputedStyle(container);
      const hasScroll =
        computedStyle.overflow === "auto" ||
        computedStyle.overflow === "scroll" ||
        computedStyle.overflowY === "auto" ||
        computedStyle.overflowY === "scroll";

      if (hasScroll || container.classList.contains("fixed-height-container")) {
        break;
      }
      container = container.parentElement;
    }

    if (container && container !== document.body) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const dropdownHeight = parseInt(maxHeight.replace("px", "")) || 200;

      const spaceBelow = containerRect.bottom - inputRect.bottom;
      const spaceAbove = inputRect.top - containerRect.top;

      setDropdownPosition(
        spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
          ? "top"
          : "bottom",
      );
    }
  }, [maxHeight]);

  // Reset query when value changes externally
  useEffect(() => {
    if (value && !query) {
      setQuery("");
    }
  }, [value]);

  const selectOption = useCallback(
    (option) => {
      setQuery("");
      // Create event-like object to match your onChange pattern
      // Pass the full option object as the value
      onChange(option); // Pass event and full option
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onChange, name],
  );

  const clearSelection = useCallback(() => {
    setQuery("");
    const event = "";
    onChange(event);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [onChange, name]);

  const getDisplayValue = () => {
    if (query) return query;
    if (value && typeof value === "object") {
      // If value is an object, display the optionLabel property
      return value[optionLabel] || "";
    }
    if (value) {
      return value;
    }
    return "";
  };

  // Helper function to compare objects/values
  const isSelected = (option) => {
    if (!value) return false;

    if (typeof value === "object" && value !== null) {
      // Compare objects by a unique identifier (id, code, or optionValue)
      const valueIdentifier =
        value.id || value.code || value[optionValue] || value[optionLabel];
      const optionIdentifier =
        option.id || option.code || option[optionValue] || option[optionLabel];
      return valueIdentifier === optionIdentifier;
    }

    // For primitive values, compare directly
    return (optionValue ? option[optionValue] : option[optionLabel]) === value;
  };

  const filteredOptions = options.filter((option) =>
    option[optionLabel].toLowerCase().includes(query.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);

    // Clear selection when user types
    const event = "";
    onChange(event);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Replace the existing handleArrowClick function with:
  const handleArrowClick = () => {
    if (!disabled) {
      if (isOpen) {
        // If dropdown is open, close it
        setIsOpen(false);
        setHighlightedIndex(-1);
      } else {
        calculateDropdownPosition();

        // If dropdown is closed, open it and focus input
        setIsOpen(true);
        inputRef.current?.focus();
      }
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      calculateDropdownPosition(); // Calculate position on focus
      setIsOpen(true);
      onFocus?.();
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow option selection
    setTimeout(() => {
      onBlur?.();
    }, 150);
  };
  const handleOutsideClick = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };
  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div className={`relative mt-1 w-full ${className}`}>
        {(value && value[optionLabel]) && isFloatPlaceholder ? (
          <label className="absolute -top-[7px] left-[5px] bg-white backdrop-blur-md px-1.5 text-[10px] text-primary-theme-1 font-medium z-1 rounded-sm-4">
            {placeholder}
          </label>
        ) : null}
        <div
          className={`rounded-sm-4 rounded-sm-6 flex items-center gap-2 border border-[#c4c4c4] pr-2 shadow-sm ${mainStyle}`}
        >
          <div className="relative flex flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={getDisplayValue()}
              placeholder={placeholder}
              disabled={disabled}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-label={`Search ${optionLabel}`}
              className={`text-primary-theme-1 text-txt-md-13 order-0 block h-[34px] w-full border-0 bg-transparent text-base !font-[450] outline-none focus:border-transparent focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${inputStyle}`}
            />
          </div>
          {clearable && value && !disabled && (
            <button
              type="button"
              className={`cursor-pointer rounded border-0 bg-transparent p-1 pr-2 text-lg !text-[20px] leading-none text-gray-500 ${buttonStyle}`}
              onClick={clearSelection}
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          <div
            className={`cursor-pointer rounded text-xs text-gray-500 transition-transform ${isOpen ? "" : ""
              } ${disabled ? "!cursor-not-allowed opacity-60" : ""}`}
            onClick={handleArrowClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="-ml-2 h-5 w-5 text-primary-theme-1"
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>

        {isOpen && !disabled && (
          <div
            ref={optionsRef}
            className={`absolute right-0 left-0 z-50 overflow-hidden overflow-y-auto bg-white px-3 py-2 shadow-xl ${dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            style={{ maxHeight }}
            role="listbox"
          >
            {/* <div className="px-1 py-1 text-gray-500 !font-[450] !text-txt-md-13 italic" onClick={}>
              --Clear--
            </div> */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={`${id}-${index}`}
                  onClick={() => selectOption(option)}
                  className={`cursor-pointer border-gray-100 px-1 py-1 text-[13px] !font-[450] !text-[#6c6c6c] transition-colors hover:bg-gray-50 ${index === highlightedIndex ? "bg-gray-50" : ""
                    } ${isSelected(option)
                      ? "bg-[#f4f4f4] font-medium text-blue-600"
                      : ""
                    } ${itemStyle}`}
                  
                  role="option"
                  aria-selected={isSelected(option)}
                >
                  {option[optionLabel]}
                </div>
              ))
            ) : (
              <div className="!text-txt-md-13 px-1 py-1 !font-[450] text-gray-500 italic">
                {noResultsText}
              </div>
            )}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};
export default SearchableDropdown;
