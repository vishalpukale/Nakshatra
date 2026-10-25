/**
 * File :ContractRequest.jsx
 * Description :
 * This component renders the Contracting Requests table for agents and back office users.
 * It displays a list of contract requests with details such as carrier, SureLC submission status,
 * acknowledgment status, date, remarks, and current status. The table supports actions like
 * acknowledging a contract (for agents) and approving/rejecting requests (for back office users).
 *
 * Features:
 * - Displays contract requests in a paginated, sortable table.
 * - Allows agents to acknowledge contract requests.
 * - Allows back office users to approve or reject contract requests with optional remarks.
 * - Shows modals for acknowledgment, confirmation, and rejection with reason input.
 * - Integrates with Redux for state management and dispatching actions.
 *
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * 
 * Props:
 * @param {Function} setLoading - Sets the loading state during async operations.
 * @param {Array} request - The list of contract requests to display.
 * @param {Boolean} isBackOfficeUser - Determines if the current user is a back office user.
 * @param {Function} fetchAgentContract - Function to refresh agent contract data.
 * @param {Function} fetchAgentCarrier - Function to refresh agent carrier data.
 * @param {Number} totalRecords - Total number of contract requests for pagination.
 * @param {Number} pageNumber - Current page number for pagination.
 * @param {Function} setPageNumber - Sets the current page number.
 * @param {Number} pageSize - Number of records per page.
 * @param {Function} setPageSize - Sets the number of records per page.
 * @param {Boolean} remoteSort - Indicates if sorting is handled remotely.
 * @param {Function} handleSortChange - Handles sort changes for the table.
 *
 * @module ContractRequest
 */
import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/table/index";
import { useDispatch, useSelector } from "react-redux";
import {
  dateFormat,
  getAbbreviation,
  getColorByAction,
} from "../../../../services/utils";
import AcknowledgeModal from "../../../contracting/component/AcknowledgeModal";
import { updatedContractedData } from "../../../contracting/slice/contractingSlice";
import {
  ACTION_BUTTON_OPTIONS,
  CONTRACTING_STATUS_BUTTON_STYLE,
  COUNTRY_CODE,
} from "../../../../services/constants";
// admin-dashboard APIs removed; carrier status update disabled.
import { Dropdown, ErrorDialogWithMessage } from "../../../../ui-controls";
import TooltipCommon from "../../../../ui-controls/tooltip";
import { toast } from "react-toastify";
import TruncatedTooltip from "../../../../ui-controls/truncated-tooltip";
const ContractRequest = ({
  setLoading,
  request,
  isBackOfficeUser,
  fetchAgentContract,
  fetchAgentCarrier,
  totalRecords,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  remoteSort,
  handleSortChange,
  isCarrierAccess,
  countryCode,
}) => {
  const dispatch = useDispatch();
  const { isContractRendering } = useSelector(({ profile }) => profile);
  const [acknowledgeModal, setAcknowledgeModal] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [pendingActionChange, setPendingActionChange] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { userData } = useSelector(({ signin }) => signin);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const updatePlaceholder = () => {
      const width = window.innerWidth;
      if (width === 1024) {
        setPlaceholder("Select");
      } else {
        setPlaceholder("Select Action");
      }
    };

    updatePlaceholder(); // initial set
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);
  const handleModalOpen = (carrier) => {
    setCarrier(carrier);
    setAcknowledgeModal(true);
  };
  // const handleAcknowledgeStatus = () => {
  //   try {
  //     setLoading(true);
  //     dispatch(
  //       updatedContractedData({ id: carrier.id, acknowledgedByAgent: true }),
  //     ).then((res) => {
  //       if (res?.payload?.status === 200) {
  //         setAcknowledgeModal();
  //         fetchAgentContract();
  //         setIsAcknowledged(false);
  //       } else {
  //         console.error("Failed to update contract:", res?.payload?.message);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error updating contract:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAcknowledgeStatus = async () => {
    try {
      setLoading(true);
      const res = await dispatch(
        updatedContractedData({ id: carrier.id, acknowledgedByAgent: true }),
      );

      if (res?.payload?.status === 200) {
        setAcknowledgeModal(false);
        setIsAcknowledged(false);

        // ✅ Refresh contract requests
        await fetchAgentContract();

        // ✅ Refresh carrier appointments
        await fetchAgentCarrier();
      } else {
        console.error("Failed to update contract:", res?.payload?.message);
      }
    } catch (error) {
      console.error("Error updating contract:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      if (pendingActionChange) {
        const { fullRow } = pendingActionChange;
        // Removed: updateAgentCarrierStatus API no longer available.
        // Surface a friendly message and close dialogs.
        toast.error("Carrier status update is not available in this trimmed starter.");
        setIsRejectionModalOpen(false);
        setConfirmationOpen(false);
        setRejectionReason("");
        setPendingActionChange(null);
      }
    } catch (error) {
      console.error("Error updating carrier status:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log("countryCode", countryCode)

  const columns = [
    {
      field: "carrierName",
      header: "Carrier",
      clickable: false,
      isHoverEnabled: true,
      enableTooltip: true,

      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.carrierIcon ? (
            <div className="w-[40px]">
              {" "}
              <img src={row.carrierIcon} alt="carrier-icon w-full h-full" />
            </div>
          ) : (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
              <span className="text-sm font-semibold text-black">
                {getAbbreviation(row.carrierName)}
              </span>
            </div>
          )}
          {/* <div className="w-28 overflow-hidden">
            <TooltipCommon label={value} id={`${row.id}-name-tooltip`}>
              <span className="block truncate text-sm text-gray-600">
                {value}
              </span>
            </TooltipCommon>
          </div> */}
          <div className="min-w-0 flex-1">
            <TruncatedTooltip text={value} className="cursor-pointer" />
          </div>
        </div>
      ),
    },
    ...(countryCode !== COUNTRY_CODE.CANADA
      ? [
        {
          field: "isSureLcSubmitted",
          header: (
            <TooltipCommon label="SureLC Submitted" id="slc-tooltip">
              <span>SLC</span>
            </TooltipCommon>
          ),
          clickable: false,
          render: (value) => (
            <span
              className={`rounded-full px-3 py-2 ${value
                ? "bg-green-100 text-[#0F6424]"
                : "bg-red-100 text-[#F12323]"
                }`}
            >
              {value ? "Yes" : "No"}
            </span>
          ),
        },
      ]
      : []),
    {
      field: "acknowledgedByAgent",
      header: (
        <TooltipCommon label="Acknowledged by Agent" id="ack-tooltip">
          <span>ACK</span>
        </TooltipCommon>
      ),
      clickable: false,
      render: (value, row) => (
        <>
          <span
            className={`rounded-full px-3 py-2 ${value
              ? "bg-green-100 text-[#0F6424]"
              : "bg-red-100 text-[#F12323]"
              }`}
          >
            {value ? "Yes" : "No"}
          </span>
          {!value && !isBackOfficeUser ? (
            <span
              className={`cursor-pointer px-3 py-2 !text-[#1ABADC] underline`}
              onClick={() => handleModalOpen(row)}
            >
              Acknowledge
            </span>
          ) : null}
        </>
      ),
    },
    {
      field: "updatedDate",
      header: "Date",
      clickable: false,
      render: (value) => dateFormat(value, "DD MMM YYYY"),
    },
    {
      field: "note",
      header: "Remark",
      clickable: false,
      render: (value) => value || "--",
    },
    {
      field: "status",
      header: "Status",
      clickable: false,
      render: (value, row) => (
        <div
          className={`grid h-6 w-min items-center rounded-2xl px-3 text-center text-sm font-semibold ${CONTRACTING_STATUS_BUTTON_STYLE[row.statusCode]}`}
        >
          {value}
        </div>
      ),
    },
    ...(isBackOfficeUser && isCarrierAccess
      ? [
        {
          field: "",
          header: "Action",
          clickable: false,
          render: (cellValue, row) => {
            // now the data is not coming from carte we have to manually set the ack status so the condition would not be there
            // const isUnderReview = row.statusCode === "ACS";
            const color = getColorByAction(cellValue);
            return (
              <div className="relative w-full">
                <Dropdown
                  id={`action-dropdown-${row.id}`}
                  name="action"
                  value={ACTION_BUTTON_OPTIONS.find(
                    (opt) => opt.name === row.status,
                  )}
                  options={ACTION_BUTTON_OPTIONS}
                  placeholder={placeholder} // shows "Select" only at 1024px width
                  optionLabel="label"
                  optionValue="name"
                  // isDisabled={!isUnderReview}
                  dropdownStyle="dropdown w-30 action-dropdown"
                  btnStyle={`text-${color}-600 font-semibold action-dropdown`}
                  onChange={(selected) => {
                    setPendingActionChange({
                      rowId: row.id,
                      newValue: selected.name,
                      oldValue: row.status,
                      fullRow: row,
                      carrierName: row.carrierName,
                    });
                    if (selected.name === "RJC") {
                      setIsRejectionModalOpen(true);
                    } else {
                      setConfirmationOpen(true);
                    }
                  }}
                />
              </div>
            );
          },
        },
      ]
      : []),
  ];

  return (
    <div className="rounded-br-lg rounded-bl-lg border-gray-200 bg-white p-5 pt-3 pb-3">
      <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
        <div className="mb-3">
          <h2 className="text-txt-md-18 text-primary-theme-1 font-bold">
            Contracting Requests
          </h2>
          <p className="text-txt-md-13 mt-3 text-justify font-medium text-[#707EAE]">
            We're excited to have you start your GFI journey as an independent
            contractor.
          </p>
        </div>
      </div>

      <DataTable
        tableHeading="Request Contract"
        initialData={request}
        columns={columns}
        defaultPageSize={10}
        totalRecords={totalRecords}
        selectedPageSize={pageSize}
        setSelectedPageSize={setPageSize}
        currentPageNumber={pageNumber}
        setCurrentPageNumber={setPageNumber}
        isLocalSorting={false}
        Icon={true}
        handleSortChange={handleSortChange}
        remoteSort={remoteSort}
        setRemoteSort={() => { }}
        isNoDataPlaceholderVisible={isContractRendering}
        tableStyle="min-h-[200px] !h-[33%] scrollbar-thin overflow-auto"
        headerStyle="sticky top-0 z-10 bg-white"
        paginationStyle="!p-2"
      />

      <AcknowledgeModal
        isOpen={acknowledgeModal}
        isAcknowledgePend={true}
        handleModalClose={() => setAcknowledgeModal(false)}
        buttonName="Submit"
        isAcknowledged={isAcknowledged}
        setIsAcknowledged={setIsAcknowledged}
        onSave={handleAcknowledgeStatus}
      />

      <ErrorDialogWithMessage
        visible={isConfirmationOpen || isRejectionModalOpen}
        onClose={() => {
          setConfirmationOpen(false);
          setIsRejectionModalOpen(false);
          setRejectionReason("");
        }}
        onConfirm={handleChangeStatus}
        dialogHeader="Confirmation"
        dialogDetail={`Are you sure you want to ${isRejectionModalOpen ? "reject" : "approve"} this contracting request  of carrier ${pendingActionChange?.carrierName || ""}?`}
        confirmText="Yes"
        cancelText="No"
        successBtn="!bg-green-900"
        showReasonInput={isRejectionModalOpen}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
    </div>
  );
};

export default ContractRequest;
