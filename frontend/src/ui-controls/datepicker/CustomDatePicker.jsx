/**
 * --------------------------------------------------------
 * File        : CustomDatePicker.js
 * Description : A reusable date picker component using react-datepicker
 *               with customized styling, icon, and date formatting.
 * Authors     : Developer team
 * Created On  : 2025-06-16
 * Updated On  : 2025-06-16
 * --------------------------------------------------------
 * Notes:
 * - Accepts controlled props like `value`, `onChange`, `minDate`, and `maxDate`.
 * - Formats incoming string values (YYYY-MM-DD) and parses them into valid Date objects.
 * - Formats selected Date objects back into string (YYYY-MM-DD) before sending to parent.
 * - Uses a custom icon (`CalendarIcon`) wrapped with `Avatar` and opens calendar on click.
 * - Supports dropdowns for month and year with scrollable years.
 * - Allows additional props to be passed directly to the DatePicker component.
 */
import React, { useRef } from "react";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CalendarIcon } from "../../assets";
import Avatar from "../../ui-controls/avatar";

const CustomDatePicker = ({
  id,
  placeholder,
  label,
  value,
  onChange,
  inputClassName = "",
  labelClassName = "",
  dateFormat = "yyyy/MM/dd",
  minDate,
  maxDate,isRequired,
  ...props
}) => {
  const datePickerRef = useRef(null);
  // Convert incoming string to Date object for DatePicker
  // const selectedDate = value ? moment(value, "YYYY/MM/DD").toDate() : null;
  const selectedDate =
    value && moment(value, "YYYY-MM-DD", true).isValid()
      ? moment(value, "YYYY-MM-DD").toDate()
      : null;

  // Convert selected Date object back to string for parent
  const handleDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    onChange?.(formattedDate);
  };
  const handleRawChange = (e) => {
    const cleaned = e.target.value?.replace(/[^0-9/]/g, "");
    e.target.value = cleaned;

    const parsedDate = moment(cleaned, "MM/DD/YYYY", true);
    if (parsedDate.isValid()) {
      handleDateChange(parsedDate.toDate()); // call main date change
    }
  };
  const onIconClick = () => {
    datePickerRef.current?.setFocus(); // This opens the calendar
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={classNames(
            "mb-1 block text-sm text-gray-700",
            labelClassName,
          )}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <DatePicker
        id={id}
        ref={datePickerRef}
        showIcon
        selected={selectedDate}
        onChange={handleDateChange}
        onChangeRaw={handleRawChange}
        placeholderText={placeholder}
        dateFormat="MM/dd/yyyy"
        openToDate={selectedDate || new Date()}
        showYearDropdown
        showMonthDropdown
        dropdownMode="scroll"
        yearDropdownItemNumber={300}
        scrollableYearDropdown
        minDate={minDate}
        maxDate={maxDate}
        todayButton="today"
        icon={<Avatar src={CalendarIcon} onClick={onIconClick} />}
        className={classNames(
          "w-full rounded-sm border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50",
          inputClassName,
        )}
        {...props}
      />
    </div>
  );
};

export default CustomDatePicker;
