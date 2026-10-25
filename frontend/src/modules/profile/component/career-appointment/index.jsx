/**
 * File : CarrierAppointments.jsx
 * Description :
 * This file defines the CarrierAppointments React component, which serves as a container for managing and displaying
 * carrier appointment data and contract requests for an agent within a profile module. It integrates with Redux for state management,
 * utilizes custom table controls for pagination and sorting, and fetches data from carrier appointment services.
 * 
 * The component renders two main child components:
 *   - ContractRequest: Displays and manages contract requests for the agent.
 *   - ContractCarrier: Displays and manages carrier appointments for the agent.
 * 
 * Features:
 * - Fetches and displays contract requests and carrier appointments for a given agent.
 * - Supports pagination, sorting, and remote data fetching for both contract requests and carrier appointments.
 * - Handles loading state and user type (e.g., back office users).
 * 
 * Dependencies:
 * - React, Redux, React Router
 * - Custom hooks and services for data fetching and table controls
 * 
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { USER_TYPE } from "../../../../services/constants";
import ContractRequest from "./ContractRequest";
import ContractCarrier from "./ContractCarrier";
import useTableControls from "../../hooks/useTableControls";
import {
  fetchAgentCarrier,
  fetchAgentContract,
} from "../../services/carrierAppointments.service";
import {
  getCountryByCompanyId,
  getCountryById,
} from "../../../configuration/slice/configurationSlice";

const CarrierAppointments = ({
  setLoading,
  notificationData,
  isCarrierAccess,
}) => {
  const dispatch = useDispatch();

  const [countryCode, setCountryCode] = useState('')
  const { search } = useLocation();
  const { userData } = useSelector(({ signin }) => signin);
  const agentId = new URLSearchParams(search).get("aid");
  const userId = new URLSearchParams(search).get("id");
  const isBackOfficeUser = userData?.userTypeCode === USER_TYPE.BACK_OFFICE;
  const isAgentProfile = userData.id === Number(userId);
  // State for contract requests
  const [request, setRequest] = useState([]);
  const {
    totalRecords: requestTotalRecords,
    setTotalRecords: setRequestTotalRecords,
    pageSize: requestPageSize,
    setPageSize: setRequestPageSize,
    pageNumber: requestPageNumber,
    setPageNumber: setRequestPageNumber,
    remoteSort: requestRemoteSort,
    handleSortChange: handleRequestSortChange,
  } = useTableControls();

  // State for carriers
  const [carrier, setCarrier] = useState([]);
  const {
    totalRecords,
    setTotalRecords,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
    remoteSort,
    handleSortChange,
  } = useTableControls();

  useEffect(() => {
    if (userData?.countryId) {
      dispatch(getCountryById({ Id: userData.countryId }))
        .unwrap()
        .then((res) => setCountryCode(res.data.data.code))
        .catch((err) => console.error(err));
    }
  }, [userData?.countryId]);

  // Fetch contract requests
  useEffect(() => {
    fetchAgentContract({
      dispatch,
      agentId,
      page: requestPageNumber,
      pageSize: requestPageSize,
      sort: requestRemoteSort,
      userCountryCompanyId: userData?.countryCompanyId,
      setLoading,
      onSuccess: ({ data, count }) => {
        setRequest(data);
        setRequestTotalRecords(count);
      },
    });
  }, [agentId, requestPageNumber, requestPageSize, requestRemoteSort]);

  // Fetch carriers
  useEffect(() => {
    _fetchAgentCarrier();
  }, [agentId, pageNumber, pageSize, remoteSort]);

  const _fetchAgentCarrier = () => {
    fetchAgentCarrier({
      dispatch,
      agentId,
      page: pageNumber,
      pageSize,
      sort: remoteSort,
      setLoading,
      userCountryCompanyId: userData?.countryCompanyId,
      onSuccess: ({ data, count }) => {
        setCarrier(data);
        setTotalRecords(count);
      },
    });
  };
  const HEIGHTS = {
    withNotifications: "h-[calc(100dvh-220px)]",
    withoutNotifications: "h-[calc(100dvh-160px)]",
  };

  const containerHeight =
    notificationData.length !== 0
      ? HEIGHTS.withNotifications
      : HEIGHTS.withoutNotifications;

  return (
    // <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[74vh] min-h-[83vh] w-full max-w-full overflow-y-auto bg-white">
    <div
      className={`${containerHeight} scrollbar-thin scrollbar-thumb-gray-400 overflow-auto rounded-br-lg rounded-bl-lg border border-gray-200 bg-white pb-3`}
    >
      <div
        className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-full`}
      >
        <ContractRequest
          setLoading={setLoading}
          countryCode={countryCode}
          request={request}
          setRequest={setRequest}
          isCarrierAccess={isCarrierAccess}
          fetchAgentContract={() =>
            fetchAgentContract({
              dispatch,
              agentId,
              page: requestPageNumber,
              pageSize: requestPageSize,
              sort: requestRemoteSort,
              setLoading,
              onSuccess: ({ data, count }) => {
                setRequest(data);
                setRequestTotalRecords(count);
              },
            })
          }
          fetchAgentCarrier={_fetchAgentCarrier}
          isBackOfficeUser={isBackOfficeUser}
          totalRecords={requestTotalRecords}
          pageNumber={requestPageNumber}
          setPageNumber={setRequestPageNumber}
          pageSize={requestPageSize}
          setPageSize={setRequestPageSize}
          remoteSort={requestRemoteSort}
          handleSortChange={handleRequestSortChange}
        />
        <ContractCarrier
          setLoading={setLoading}
          carrier={carrier}
          setCarrier={setCarrier}
          handleSortChange={handleSortChange}
          isCarrierAccess={isCarrierAccess}
          isAgentProfile={isAgentProfile}
          agentId={agentId}
          totalRecords={totalRecords}
          fetchAgentCarrier={() =>
            fetchAgentCarrier({
              dispatch,
              agentId,
              page: pageNumber,
              pageSize,
              sort: remoteSort,
              setLoading,
              userCountryCompanyId: userData?.countryCompanyId,
              onSuccess: ({ data, count }) => {
                setCarrier(data);
                setTotalRecords(count);
              },
            })
          }
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          remoteSort={remoteSort}
          isBackOfficeUser={isBackOfficeUser}
        />
      </div>
    </div>
  );
};

export default CarrierAppointments;
