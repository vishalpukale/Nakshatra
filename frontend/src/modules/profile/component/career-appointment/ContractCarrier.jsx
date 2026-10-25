/**
 * File :ContractCarrier.jsx
 * Description :
 * This component displays and manages the list of contracted carriers for a user profile.
 * It provides a data table view of carrier appointments, allowing users to view carrier details,
 * contract dates, remarks, statuses, and carrier writing codes. Users can add or edit the carrier
 * writing code through a modal dialog. The component also handles error dialogs for failed updates.
 *
 * Props:
 * - setLoading (function): Sets the loading state during async operations.
 * - carrier (array): The list of carrier appointment data to display.
 * - totalRecords (number): Total number of carrier records for pagination.
 * - fetchAgentCarrier (function): Function to refresh the carrier data.
 * - handleSortChange (function): Handles sorting changes in the data table.
 * - pageNumber (number): Current page number for pagination.
 * - setPageNumber (function): Sets the current page number.
 * - pageSize (number): Number of records per page.
 * - setPageSize (function): Sets the number of records per page.
 * - remoteSort (object): Sorting configuration for remote sorting.
 * - isBackOfficeUser (boolean): Indicates if the current user is a back-office user.
 *
 * Features:
 * - Displays carrier information in a table with custom renderers for each column.
 * - Allows adding or editing carrier writing codes via a modal.
 * - Handles contract update logic and error handling.
 * - Shows error dialogs for failed contract updates.
 * - Integrates with Redux for state management and async actions.
 * 
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 */
import React, { useEffect, useRef, useState } from "react";
import DataTable from "../../../../components/table/index";
import { useDispatch, useSelector } from "react-redux";
import { dateFormat, getAbbreviation } from "../../../../services/utils";
import {
  CONTRACTING_STATUS,
  CONTRACTING_STATUS_BUTTON_STYLE,
  CONTRACTING_WRITABLE_CODE_MAP,
  CONTRACTING_STATUS_MAP,
} from "../../../../services/constants";
import AddWritingCode from "../../../contracting/component/AddWritingCode";
import { Avatar, Button, Dialog } from "../../../../ui-controls";
import { updatedContractedData } from "../../../contracting/slice/contractingSlice";
import { editIcon } from "../../../../assets";
import TooltipCommon from "../../../../ui-controls/tooltip";
import TruncatedTooltip from "../../../../ui-controls/truncated-tooltip";

const ContractCarrier = ({
  setLoading,
  carrier,
  totalRecords,
  fetchAgentCarrier,
  handleSortChange,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  remoteSort,
  isBackOfficeUser,
  isCarrierAccess,
  isAgentProfile

}) => {
  const dispatch = useDispatch();
  const { isCarrierRendering } = useSelector(({ profile }) => profile);
  const [openModalId, setOpenModalId] = useState(false);
  const [carrierDetails, setCarrierDetails] = useState(null);
  const [carrierCode, setCarrierCode] = useState("");
  const [error, setError] = useState("");
  const [errorDialogText, setErrorDialogText] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleUpdateContract = async () => {
    if (!carrierCode.trim()) {
      setError("Carrier writing code is required");
      return;
    }
    if (carrierCode.trim().length < 2) {
      setError("Carrier writing code must have minimum 2 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(
        updatedContractedData({
          id: carrierDetails.id,
          carrierWritingCode: carrierCode,
        }),
      );
      if (res?.payload?.status === 200) {
        setOpenModalId(false);
        setCarrierCode("");
        fetchAgentCarrier();
      } else if (res?.payload?.status === 400) {
        setErrorDialogText(res?.payload?.data?.message);
        setIsErrorDialogOpen(true);
      } else {
        console.error("Failed to update contract:", res?.payload?.message);
      }
    } catch (error) {
      console.error("Error updating contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModel = (carrier) => {
    setCarrierDetails(carrier);
    setCarrierCode(carrier.carrierWritingCode || "");
    setError("");
    setOpenModalId(true);
  };

  const columns = [
    {
      field: "carrierName",
      header: "Carrier",
      clickable: false,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.carrierIcon ? (
            <div className="w-[40px]">

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
            <TruncatedTooltip
              text={value}
              className=" cursor-pointer "
            />
          </div>
        </div>
      ),
    },
    {
      field: "paperworkDate",
      header: "Contract Date",
      clickable: false,
      render: (value, row) =>
        dateFormat(value || row?.createdDate, "DD MMM YYYY"),
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
          {CONTRACTING_STATUS.Completed === row.statusCode && !isBackOfficeUser
            ? CONTRACTING_STATUS_MAP[CONTRACTING_STATUS.Carrier]
            : value}
        </div>
      ),
    },
    ...(isCarrierAccess || isAgentProfile
      ? [{
        field: "carrierWritingCode",
        header: "Carrier Writing Code",
        clickable: false,
        render: (value, row) => (
          <div className="grid h-6 w-min items-center rounded-2xl px-3 text-center text-sm font-semibold">
            {value ? (
              <div className="grid grid-cols-[auto_auto] items-center gap-2">
                <span>{value}</span>
                <Avatar
                  size="xs"
                  title="Edit Writing Code"
                  src={editIcon}
                  btnStyle="relative w-13 h-6 -top-px head-initial avatar-disabled cursor-pointer"
                  onClick={() => openModel(row)}
                />
              </div>
            ) : CONTRACTING_WRITABLE_CODE_MAP[row?.statusCode] ? (
              <Button
                size="md"
                name="+ Add"
                onClick={() => openModel(row)}
                isDisabled={false}
                isActive={true}
                btnStyle="px-4 py-2 border-none !text-[#1ABADC]"
              />
            ) : (
              "--"
            )}
          </div>
        ),
      }] : [])
  ];

  return (
    <div className="h-[70dvh] lg:h-[60dvh] mb-1.5 rounded-br-lg rounded-bl-lg border-gray-200 bg-white p-5 pt-3">
      <div className="grid items-center gap-2 md:gap-0 lg:grid-cols-[auto_1fr] lg:gap-5">
        <div className="mb-3">
          <h2 className="text-txt-md-18 text-primary-theme-1 font-bold">
            Active Appointments
          </h2>
          <p className="text-txt-md-13 mt-3 text-justify font-medium text-[#707EAE]">
            We're excited to have you start your GFI journey as an
            independent contractor.
          </p>
        </div>
      </div>

      <DataTable
        tableHeading="Contracted Carriers"
        initialData={carrier}
        columns={columns}
        Icon={true}
        totalRecords={totalRecords}
        selectedPageSize={pageSize}
        setSelectedPageSize={setPageSize}
        currentPageNumber={pageNumber}
        setCurrentPageNumber={setPageNumber}
        isLocalSorting={false}
        handleSortChange={handleSortChange}
        remoteSort={remoteSort}
        tableStyle="h-[calc(65vh-150px)] md:h-[calc(70vh-220px)] xl:h-[calc(70vh-220px)] 2xl:h-[calc(55vh-250px)] scrollbar-thin overflow-x-auto"
        headerStyle="sticky top-0 z-10 bg-white"
        setRemoteSort={() => { }}
        isNoDataPlaceholderVisible={isCarrierRendering}
        paginationStyle="!p-2"
      />

      <AddWritingCode
        isOpen={openModalId}
        handleModalClose={() => setOpenModalId(false)}
        carrierCode={carrierCode}
        setCarrierCode={setCarrierCode}
        onSave={handleUpdateContract}
        error={error}
        setError={setError}
      />
      <Dialog
        closeModal={() => setIsErrorDialogOpen(false)}
        visible={isErrorDialogOpen}
        outerDivStyle="!min-w-[300px] !m-0"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-mtp-10 bg-error w-wp-48 h-hp-48 m-auto flex items-center justify-center rounded-full">
            <div className="icon-URL-not-found1 text-5xl !text-white"></div>
          </div>

          <p className="mb-6 px-2 text-base leading-relaxed font-medium text-gray-600 md:!text-lg">
            {errorDialogText}
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default ContractCarrier;
