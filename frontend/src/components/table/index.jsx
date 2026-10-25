/**
 * --------------------------------------------------------
 * File        : DataTable.jsx
 * Description : Renders a customizable data table with features such as sorting,
 *               filtering, pagination, row editing, and data export functionality.
 * Author      : Developer Team
 * Created On  : 2025-05-07
 * Updated On  : 2025-05-07
 * --------------------------------------------------------
 * Notes:
 * - Displays dynamic data in a table with pagination, search, and filter options.
 * - Includes sorting functionality with ascending/descending order.
 * - Editable rows with the ability to update cell values.
 * - Pagination with custom page size and page navigation.
 * - Export functionality to CSV.
 * - Integrates with the `AgentDetails` modal for displaying agent information.
 * - Uses Tailwind CSS for layout and styling.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

import { Dropdown, Image } from "../../../src/ui-controls/index";
import noDataImage from "../../../src/assets/images/no_data_found.png";
import TooltipCommon from "../../ui-controls/tooltip/index";
import { dummy } from "../../assets";
const DataTable = ({
  tableHeading,
  initialData = [],
  columns = [],
  defaultPageSize = 10,
  editable = true,
  onRowAdd = () => { },
  onRowDelete = (id) => { },
  onCellUpdate = (rowId, field, value) => { },

  // setPageSizePagination,
  totalRecords = 0,
  totalSum = 0,
  setSelectedPageSize,
  setCurrentPageNumber,
  selectedPageSize,
  Icon,
  currentPageNumber,
  searchTerms,
  searchTerm,
  agentStatusList,
  // tableHeight,

  handleItemAction = () => { },
  // styling props
  tableStyle = "",
  headerStyle = "",
  rowStyle = "",
  cellStyle = "",
  paginationStyle = "",
  containerStyle = "",
  isLocalSorting = false,
  isPaginationActive = true,
  isHeaderActive = true,
  setRemoteSort,
  remoteSort = {},
  handleSortChange = () => { },
  isNoDataPlaceholderVisible = true,
  placeholderImageStyle,
  selectedID,
  isSmallScreen = false,
  isShowCount = false,
  isShow = true,
  scrollToTopRef,
  paginationChildStyle
}) => {
  // State management
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const onboardingStatusOptions = agentStatusList?.data
    ?.filter((status) => status.category === "ONBOARDING")
    .map((status) => ({
      label: status.name, // Shown in dropdown
      name: status.code, // Used as value
    }));


  const tableRef = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPageNumber]);

  const getPaginationRange = (current, total) => {
    const range = [];
    const siblingCount = 1; // Number of adjacent pages to show near current
    const totalVisiblePages = siblingCount * 2 + 5;

    if (total <= totalVisiblePages) {
      // Show all pages if total is small
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (isSmallScreen) {
      const showLeftDots = current >= 3;
      const showRightDots = current <= total - 2;

      const range = [];

      if (!showLeftDots && showRightDots) {
        // Start of pagination
        range.push(1, 2, "...", total);
      } else if (showLeftDots && !showRightDots) {
        // End of pagination
        range.push(1, "...", total - 1, total);
      } else if (showLeftDots && showRightDots) {
        // Middle of pagination
        range.push(1, "...", current, "...", total);
      } else {
        // Fallback
        range.push(1, current, total);
      }

      return range;
    }

    const showLeftDots = current > siblingCount + 3;
    const showRightDots = current < total - (siblingCount + 2);

    const left = Math.max(2, current - siblingCount);
    const right = Math.min(total - 1, current + siblingCount);

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 5 }, (_, i) => i + 1);
      return [...leftRange, "...", total];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = Array.from({ length: 5 }, (_, i) => total - 5 + i + 1);
      return [1, "...", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: right - left + 1 },
        (_, i) => left + i,
      );
      return [1, "...", ...middleRange, "...", total];
    }

    return [];
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Apply filtering, sorting, and pagination
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((field) => {
      if (filters[field]) {
        result = result.filter((row) => {
          const value = String(row[field]).toLowerCase();
          return value.includes(String(filters[field]).toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sorting.field) {
      result.sort((a, b) => {
        let valA = a[sorting.field];
        let valB = b[sorting.field];

        // Handle string comparison
        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
        if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
  }, [data, filters, sorting]);
  // Calculate pagination info
  const totalPages = Math.ceil(totalRecords / selectedPageSize);

  const startIndex = (currentPage - 1) * selectedPageSize;
  // const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  const paginatedData = filteredData;

  // Calculate column summaries
  const columnSummaries = useMemo(() => {
    const summary = {};

    columns.forEach((column) => {
      if (column.calculateTotal) {
        summary[column.field] = filteredData.reduce((sum, row) => {
          const value = Number(row[column.field]) || 0;
          return sum + value;
        }, 0);
      }

      if (column.calculateAverage) {
        summary[`${column.field}_avg`] =
          filteredData.length > 0
            ? filteredData.reduce(
              (sum, row) => sum + (Number(row[column.field]) || 0),
              0,
            ) / filteredData.length
            : 0;
      }
    });

    return summary;
  }, [filteredData, columns]);

  // Handle sorting
  const handleSort = (field) => {
    if (isLocalSorting) {
      sortLocallyByField(field);
    } else {
      setRemoteSort((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === "asc" ? "desc" : "asc",
      }));
      let direction =
        remoteSort.field === field && remoteSort.direction === "asc"
          ? "desc"
          : "asc";
      handleSortChange(field, direction);
    }
  };

  const sortLocallyByField = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filtering
  // const handleFilter = (field, value) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  //   setCurrentPage(1);
  //   setCurrentPageNumber(1);
  // };

  // Handle editing
  const startEditing = (rowId, field, value) => {
    if (!editable) return;
    setEditingCell({ rowId, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const { rowId, field } = editingCell;
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [field]: editValue } : row,
    );

    setData(newData);
    onCellUpdate(rowId, field, editValue);
    setEditingCell(null);
  };

  // Handle row operations
  const addRow = () => {
    const newRow = columns.reduce(
      (acc, col) => {
        acc[col.field] = "";
        return acc;
      },
      { id: Date.now() },
    );

    setData([...data, newRow]);
    onRowAdd(newRow);
  };

  const deleteRow = (id) => {
    setData(data.filter((row) => row.id !== id));
    onRowDelete(id);
  };

  // Render functions
  const renderTableHeader = () => (
    <thead className={`${headerStyle}`}>
      <tr className="bg-white py-2 text-sm">
        {columns.map((column) => (
          <th
            key={column.field}
            className={`border-b border-gray-200 px-3 py-2 text-left font-medium whitespace-nowrap text-gray-400 ${column.field === column.key ? column.colWidth : "w-auto"}`}
          >
            <div
              className="grid cursor-pointer auto-cols-max grid-flow-col items-center"
              onClick={() => handleSort(column.field)}
            >
              {column.header}
              {/* {(( sorting.field === column.field ) &&
                ( sorting.direction === "asc" ) ? (
                  <ChevronUpIcon className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                ))} */}

              {column.sortable !== false &&
                ((isLocalSorting && sorting.field === column.field) ||
                  (!isLocalSorting && remoteSort.field === column.field)) &&
                ((isLocalSorting ? sorting.direction : remoteSort.direction) ===
                  "asc" ? (
                  <ChevronUpIcon className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                ))}
            </div>
          </th>
        ))}
        {/* {editable && <th className="px-4 py-2 border-b border-gray-200 text-gray-600">Actions</th>} */}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {paginatedData?.length > 0 ? (
        paginatedData.map((row, index) => (
          <tr
            key={index}
            className={`hover:bg-gray-100 ${rowStyle} ${row.id === selectedID ? "bg-gray-100" : ""}`}
          >
            {columns.map((column, colIndex) => {
              const cellValue = row[column.field];
              const isEditing =
                editingCell &&
                editingCell.rowId === row.id &&
                editingCell.field === column.field;
              // Apply conditional formatting
              let cellClass = `px-2 py-3 custom-font text-indigo-900 border-b border-[#E9EDF7] text-txt-md-12 ${column.fieldStyle} ${row.id === selectedID ? "font-semibold" : ""}`;
              if (column.conditionalFormat) {
                const formatting = column.conditionalFormat(cellValue, row);
                if (formatting) {
                  cellClass += ` ${formatting}`;
                }
              }

              return (
                <td
                  key={`${row.id}-${column.field}`}
                  className={cellClass + "" + cellStyle}
                  onClick={() =>
                    column.clickable && column.onClick?.(row, column.field)
                  }
                >
                  {isEditing ? (
                    <input
                      type="text"
                      className="line-clamp-1 w-full rounded border px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus={true}
                    />
                  ) : (
                    <div
                      className={`${column.clickable ? "cursor-pointer" : ""
                        } flex items-center gap-2 whitespace-nowrap ${column.rowFieldStyle} `}
                      onClick={() => handleItemAction?.(column, row)}
                    >
                      {/* 👇 Only render icon if Icon prop is true and this is the first column */}
                      {/* {Icon && colIndex === 0 && row.carrierIcon && (
                        <img src={row.carrierIcon} alt="Carrier Icon" className="w-5 h-5" />
                      )} */}
                      {column.render
                        ? column.render(cellValue, row)
                        : cellValue}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))
      ) : isNoDataPlaceholderVisible ? (
        <tr>
          <td colSpan={columns.length} className="text-center">
            <div>
              {" "}
              <div
                className={`m-auto flex justify-center ${placeholderImageStyle ? placeholderImageStyle : "w-[20%]"}`}
              >
                <Image
                  src={noDataImage}
                  alt="No Data Available"
                  className="h-full w-full rounded-lg bg-cover bg-center"
                  isHoverEnable={false}
                />
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </tbody>
  );

  const initialState = {
    status: "idle",
    isLoggedIn: false,
  };
  // Add this helper function at the top of your component
  const shouldShowTooltip = (value, maxLength = 15) => {
    return value && value.toString().length > maxLength;
  };

  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    const str = text.toString();
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };
  return (
    <>
      {/* Search and filters */}

      <div
        className={`w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm ${containerStyle}`}
      >
        {/* Main table */}

        <div className={`${tableStyle}`} ref={tableRef}>
          <table className={`min-w-full !bg-white`}>
            {isHeaderActive && renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
        {/* Pagination controls */}
        {isPaginationActive && (
          <div
            className={`grid grid-cols-2 items-center border-t border-gray-200 bg-white p-2 ${paginationStyle}`}
          >
            <div className={`grid auto-cols-min grid-flow-col items-center gap-1 ${paginationChildStyle}`}>
              <button
                className="grid h-6 w-6 cursor-pointer place-items-center rounded border text-xs"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  setCurrentPageNumber((prev) => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-3 w-3" />
              </button>

              {getPaginationRange(currentPageNumber, totalPages).map(
                (page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      className={`grid h-6 min-w-6 cursor-pointer place-items-center rounded-sm px-2 text-xs ${currentPageNumber === page
                        ? "bg-primary-theme-1 text-white"
                        : "border text-gray-700"
                        }`}
                      onClick={() => {
                        setCurrentPage(page);
                        setCurrentPageNumber(page);
                      }}
                    >
                      {page}
                    </button>
                  );
                },
              )}

              <button
                className="grid h-6 w-6 cursor-pointer place-items-center rounded border text-xs"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  setCurrentPageNumber((prev) =>
                    Math.min(prev + 1, totalPages),
                  );
                }}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-3 w-3" />
              </button>
            </div>

            <div className="grid auto-cols-max grid-flow-col items-center gap-2 justify-self-end text-sm">
              <span className="hidden sm:flex">Total: {isShowCount ? totalSum : totalRecords}</span>
              {isShow ? <span className="hidden sm:flex">Show</span> : null}
              <div className="relative">
                {/* <select
                  className="appearance-none rounded border border-gray-300 bg-white py-1 pr-6 pl-2 text-sm focus:outline-none"
                  value={selectedPageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setSelectedPageSize(Number(e.target.value));
                    // setPageSizePagination(Number(e.target.value))
                    setCurrentPage(1);
                    setCurrentPageNumber(1);
                  }}
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select> */}

                <Dropdown
                  id="pageSizeDropdown"
                  placeholder="Page Size"
                  options={[10, 20, 50, 100].map((val) => ({
                    label: `${val}`,
                    value: val,
                  }))}
                  optionLabel="label"
                  optionValue="value"
                  value={{
                    label: `${selectedPageSize}`,
                    value: selectedPageSize,
                  }}
                  onChange={(selected) => {
                    const size = selected?.value || 10;
                    setPageSize(size);
                    setSelectedPageSize(size);
                    setCurrentPage(1);
                    setCurrentPageNumber(1);
                  }}
                  dropdownStyle="w-[60px]" // or adjust width as needed
                  isFloatPlaceholder={false}
                  // mainStyle={"h-8"}
                  clearOptionEnable={false}
                />
              </div>
              <span className="hidden sm:flex">per page</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DataTable;
