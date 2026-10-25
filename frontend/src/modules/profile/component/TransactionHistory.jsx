/**
 * --------------------------------------------------------
 * File        : TransactionHistory.js
 * Description : Displays the activity log (transaction history) for a specific
 *               user or agent, fetched via Redux from the backend. Dynamically
 *               adjusts its height based on presence of notifications and flow context.
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-14
 * --------------------------------------------------------
 * Notes:
 * - Uses URL parameters (`aid`, `id`, `bckOff`) to determine context.
 * - Calls `fetchActivityLog` via Redux to retrieve activity log entries.
 * - Displays formatted log entries with action type, actor, target, and timestamp.
 * - Integrates with loading state via parent `setLoading` function.
 * - Adjusts container height based on presence of notifications and navigation flow.
 * - Utilizes utility function `dateFormat` for formatting action dates.
 * --------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchActivityLog } from "../slice/profileSlice";
import { dateFormat } from "../../../services/utils";
import { map } from "lodash";
import { Image } from "../../../ui-controls/index";
import noDataImage from "../../../assets/images/no_data_found.png";

const TransactionHistory = ({ setLoading, notificationData }) => {
  const { search } = useLocation();
  // const [activityLog, setactivityLog] = useState();
  const dispatch = useDispatch();
  const agentId = new URLSearchParams(search).get("aid");
  const userId = new URLSearchParams(search).get("id");
  const { activityLog, isLoading } = useSelector(
    (state) => state?.profile || {},
  );

  activityLog;
  const HEIGHTS = {
    withNotifications: "h-[calc(100dvh-220px)]",
    withoutNotifications: "h-[calc(100dvh-160px)]",
  };

  const containerHeight =
    notificationData.length !== 0
      ? HEIGHTS.withNotifications
      : HEIGHTS.withoutNotifications;

  useEffect(() => {
    getActivityLog();
  }, []);

  const getActivityLog = () => {
    setLoading(true);
    dispatch(fetchActivityLog({ userId }))
      .then((response) => {
        const resData = response?.payload?.data?.data;
        // if (response?.payload?.status === 200 && resData) {
        //   setactivityLog(resData);
        // }
      })
      .catch((error) =>
        console.error("Error fetching agent activity log:", error?.message),
      )
      .finally(() => setLoading(false));
  };
  return (
    <div
      className={`${containerHeight} rounded-br-lg rounded-bl-lg border border-gray-200 bg-white pb-3`}
    >
      <div
        className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-hide h-full overflow-x-hidden overflow-y-auto p-5 ${!activityLog?.length ? "grid place-content-center" : ""}`}
      >
        <div className="text-sm text-gray-800">
          {activityLog?.length > 0 ? (
            <>
              <h3 className="mb-3 text-base font-semibold">Activity Logs</h3>
              {map(activityLog, (item, index) => (
                <div key={index} className="mb-4">
                  <ul className="ml-4 list-disc text-gray-700">
                    <li>
                      {item.action === "Agent Terminated" ? (
                        <div className="mb-1 text-sm">
                          {item?.actionOnFirstName +
                            " " +
                            item?.actionOnLastName}
                          {" Terminated By "}
                          <span className="font-medium text-blue-700">
                            {`${item.actionBy}`}
                          </span>{" "}
                          on {dateFormat(item.actionDate, "DD MMM YYYY")}
                        </div>
                      ) : (
                        <div className="mb-1 text-sm">
                          {(() => {
                            const action = item?.action || "Action done";

                            return `${action} by`;
                          })()}{" "}
                          <span className="font-medium text-blue-700">
                            {`${item.actionBy}`}
                          </span>{" "}
                          on {dateFormat(item.actionDate, "DD MMM YYYY")}
                        </div>
                      )}

                      {/* <div>
                        {" "}
                        <span className="font-medium text-gray-700">
                          Action:{" "}
                        </span>
                        <span className="text-gray-600 italic">
                          {item.action}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          ActionOn:{" "}
                        </span>
                        <span className="text-gray-600 italic">
                          {item.actionOn}
                        </span>
                      </div>
                      <div>
                        {" "}
                        <span className="font-medium text-gray-700">
                          ActionBy:{" "}
                        </span>
                        <span className="text-gray-600 italic">
                          {item.actionBy}
                        </span>
                      </div> */}

                      <div>
                        <span className="font-medium text-gray-700">
                          Description:{" "}
                        </span>
                        <span className="word-break text-gray-600 italic">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <>
              {!isLoading && (
                <div className="m-auto flex w-[50%] justify-center lg:w-[20%]">
                  <Image
                    src={noDataImage}
                    alt="No Data Available"
                    className="h-full w-full rounded-lg bg-cover bg-center"
                    isHoverEnable={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
