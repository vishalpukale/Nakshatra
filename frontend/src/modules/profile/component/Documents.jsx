/**
 *  File : Documents.jsx
 * Description :
 * This React component displays a list of agent documents fetched from the backend.
 * It uses Redux for state management and fetches documents based on the agent ID from the URL query parameters.
 * The component adjusts its height dynamically based on the presence of notifications and provides a "View" button for each document,
 * allowing users to open the document in a new browser tab. It also handles loading state and error logging.
 *
 * Authors : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * @component
 * @param {Object} props
 * @param {Function} props.setLoading - Function to set the loading state in the parent component.
 * @param {Array} props.notificationData - Array containing notification data to adjust the container height.
 *
 * @returns {JSX.Element} The rendered list of agent documents with view functionality.
 */
import React, { useEffect, useState } from "react";
import { Button } from "../../../ui-controls";
import { useDispatch } from "react-redux";
import { fetchAgentDocuments } from "../slice/profileSlice";
import { useLocation } from "react-router-dom";
import { map } from "lodash";

const Documents = ({ setLoading, notificationData }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const agentId = new URLSearchParams(search).get("aid");
  const [agentDocData, setAgentDocData] = useState([]);

  useEffect(() => {
    getAgentDocuments();
  }, []);

  const getAgentDocuments = () => {
    setLoading(true);
    dispatch(fetchAgentDocuments({ agentId }))
      .then((response) => {
        const resData = response?.payload?.data?.data;
        if (response?.payload?.status === 200 && resData) {
          setAgentDocData(resData);
        }
      })
      .catch((error) =>
        console.error("Error fetching agent Doc data:", error?.message),
      )
      .finally(() => setLoading(false));
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
    <div
      className={`${containerHeight} rounded-br-lg rounded-bl-lg border border-gray-200 bg-white pb-3`}
    >
      <div
        className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-hide h-full overflow-x-hidden overflow-y-auto`}
      >
        {map(agentDocData, (doc) => (
          <div key={doc.key}>
            <div className="grid grid-cols-[1fr_auto] items-center p-4">
              <div>
                <h2 className="text-primary-theme-1 text-txt-md-18 font-bold">
                  {doc.title}
                </h2>
                <p className="text-links text-sm">{doc.subtitle}</p>
              </div>
              <div>
                <Button
                  size="md"
                  name="View"
                  onClick={() => window.open(doc.url, "_blank")}
                  btnStyle="text-primary-theme-1 rounded-lg text-lg font-semibold border-primary-theme-1 px-3 mx-2"
                  disabled={!doc.url}
                />
              </div>
            </div>
            <hr className="text-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
