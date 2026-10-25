import { getAllAgentContract, getAllAgentCarrier } from "../slice/profileSlice";
import { CONTRACTING_STATUS } from "../../../services/constants";
import {
    setContractRendering,
    setCarrierRendering
} from "../slice/profileSlice"

const activeStatuses = [
    CONTRACTING_STATUS.Completed,
    // CONTRACTING_STATUS.Discarded,
    // CONTRACTING_STATUS.Deactivated,
    CONTRACTING_STATUS.Appointed,
    CONTRACTING_STATUS.Carrier
];
const nonActiveStatuses = [
    ...activeStatuses,
    CONTRACTING_STATUS.Discarded,
    CONTRACTING_STATUS.Deactivated,
];

const handleContractRender = (dispatch) => {
    const timer = setTimeout(() => {
        dispatch(setContractRendering());
        clearTimeout(timer);
    }, 500);
};
const handleCarrierRender = (dispatch) => {
    const timer = setTimeout(() => {
        dispatch(setCarrierRendering());
        clearTimeout(timer);
    }, 500);
};
export const fetchAgentCarrier = async ({
    dispatch,
    agentId,
    page,
    pageSize,
    sort,
    setLoading,
    onSuccess,
    onError,
    userCountryCompanyId,
}) => {

    if (!agentId) return;

    setLoading(true);
    try {
        const res = await dispatch(
            getAllAgentCarrier({
                agentId,
                statuses: activeStatuses,
                isCompleted: true,
                page,
                pageSize,
                field: sort.field,
                sortDirection: sort.direction,
                userCountryCompanyId,
                // userCountryCompanyId: userData?.countryCompanyId,
            })
        );
        if (res?.payload?.data?.status === 200) {
            onSuccess({
                data: res?.payload?.data?.data || [],
                count: res?.payload?.data?.count || 0,
            });
            handleCarrierRender(dispatch)
        }
    } catch (error) {
        console.error("Error fetching carriers:", error);
        onError?.(error);
    } finally {
        setLoading(false);
    }
};

export const fetchAgentContract = async ({
    dispatch,
    agentId,
    page,
    pageSize,
    sort,
    setLoading,
    onSuccess,
    onError,
    userCountryCompanyId,
}) => {
    if (!agentId) return;

    setLoading(true);
    try {
        const res = await dispatch(
            getAllAgentContract({
                agentId,
                statuses: nonActiveStatuses,
                isCompleted: false,
                page,
                pageSize,
                field: sort.field,
                sortDirection: sort.direction,
                userCountryCompanyId,
            })
        );
        if (res?.payload?.status === 200) {
            onSuccess({
                data: res?.payload?.data?.data || [],
                count: res?.payload?.data?.count || 0,
            });
            handleContractRender(dispatch)
        }
    } catch (error) {
        console.error("Error fetching contracts:", error);
        onError?.(error);
    } finally {
        setLoading(false);
    }
}; 