// /**
//  *  File : TaxInfo.js
//  *  Description :This component handles the display and update functionality for tax-related information.
//  *  It includes a view mode showing tax details and a modal for updating the information.
//  *  Displays tax information including name, business name, TAN, and tax classification
//  *  Provides update functionality through a modal form
//  *  Performs form validation
//  *  Handles API integration for fetching and updating tax information
//  *  Supports real-time form updates
//  *  Includes error handling and validation
//  *
//  *  Authors     : Developer Team
//  * Created On  : 2025-06-14
//  * Updated On  : 2025-06-29
//  *
//  * @param {Object} props
//  * @param {Function} props.setLoading - Function to control loading state
//  * @param {boolean} props.isTaxInfoModalOpen - Controls visibility of tax info update modal
//  * @param {Function} props.setIsTaxInfoModalOpen - Function to toggle tax info modal
//  * @param {Function} props.fetchNotificationData - Function to refresh notification data
//  *
//  *
//  * @dependencies
//  * - React
//  * - Redux
//  * - react-router-dom
//  * - lodash
//  */
// import React, { useEffect, useState } from "react";
// import { TicketStar } from "../../../assets";
// import { Avatar, Button } from "../../../ui-controls/index";
// import { Modal } from "../../../ui-controls";
// import { TextInput } from "../../../ui-controls";
// import {
//   fetchTaxInformationData,
//   updateTaxInformationData,
// } from "../slice/profileSlice";
// import { useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import _ from "lodash";

// const TaxInfo = ({
//   setLoading,
//   isTaxInfoModalOpen,
//   setIsTaxInfoModalOpen,
//   fetchNotificationData,
// }) => {
//   const { search } = useLocation();
//   const dispatch = useDispatch();

//   const agentId = new URLSearchParams(search).get("aid");
//   const userId = new URLSearchParams(search).get("id");

//   const [formErrors, setFormErrors] = useState({});
//   const [taxDetails, setTaxDetails] = useState({
//     userName: "",
//     businessName: "",
//     tanNum: "",
//     taxClassification: "",
//   });
//   const [savedTaxDetails, setSavedTaxDetails] = useState({});

//   useEffect(() => {
//     fetchTaxDetails();
//   }, []);

//   const fetchTaxDetails = () => {
//     setLoading(true);
//     dispatch(fetchTaxInformationData({ agentId: agentId }))
//       .then((response) => {
//         setLoading(false);
//         if (response?.payload?.status === 200) {
//           const bankData = response?.payload?.data?.data || {};
//           const { name, businessName, tin, taxClassification } = bankData;

//           setSavedTaxDetails(bankData);
//           setTaxDetails((prev) => ({
//             ...prev,
//             userName: name,
//             businessName: businessName,
//             tanNum: tin,
//             taxClassification: taxClassification?.name || "",
//           }));
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching Tax details:", error);
//         setLoading(false);
//       });
//   };
//   const handleModalOpen = () => {
//     setIsTaxInfoModalOpen(true);
//   };
//   const handleModalClose = () => {
//     setIsTaxInfoModalOpen(false);
//     setFormErrors({});

//     const { userName, businessName, tanNum, taxClassification } =
//       savedTaxDetails || {};
//     setTaxDetails((prev) => ({
//       ...prev,
//       userName,
//       businessName,
//       tanNum,
//       taxClassification: taxClassification?.name || "",
//     }));
//   };
//   // const containsEmoji = (str) => {
//   //   const emojiRegex = /[\p{Emoji}]/u;
//   //   const specialCharRegex = /[^\w\s.,_-]/;
//   //   return emojiRegex.test(str) || specialCharRegex.test(str);
//   // };

//   const handleInputChange = (e) => {
//     const { name, value } = e?.target || {};

//     // Real-time validation
//     // if (name !== "tan" && value) {
//     //   if (containsEmoji(value)) {
//     //     setFormErrors((prev) => ({
//     //       ...prev,
//     //       [name]: `Cannot contain emojis or special characters`,
//     //     }));
//     //     return; // Prevent setting invalid value
//     //   }
//     // }

//     const sanitizedValue =
//       name === "tanNum" ? value?.replace(/[^0-9]/g, "") : value;
//     setTaxDetails((prev) => ({
//       ...prev,
//       [name]: sanitizedValue,
//     }));

//     // Clear error when field is valid
//     setFormErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const validateTaxDetails = () => {
//     const newErrors = {};

//     if (!taxDetails?.userName?.trim()) {
//       newErrors.userName = "Name is required";
//     }
//     if (!taxDetails?.businessName?.trim()) {
//       newErrors.businessName = "Business name is required";
//     }

//     if (!taxDetails?.tanNum?.trim()) {
//       newErrors.tanNum = "Tan number is required";
//     }

//     if (!taxDetails?.taxClassification?.trim()) {
//       newErrors.taxClassification = "Tax classification is required";
//     }

//     setFormErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const checkFormChanges = () => {
//     const previousData = {
//       userName: savedTaxDetails?.userName,
//       businessName: savedTaxDetails?.businessName,
//       tanNum: savedTaxDetails?.tanNum,
//       taxClassification: savedTaxDetails?.taxClassification.name,
//     };

//     const currentData = {
//       userName: taxDetails?.userName,
//       businessName: taxDetails?.businessName,
//       tanNum: taxDetails?.tanNum,
//       taxClassification: taxDetails?.taxClassification,
//     };

//     return _.isEqual(previousData, currentData);
//   };

//   const handleFormSubmit = () => {
//     if (checkFormChanges()) {
//       setIsTaxInfoModalOpen(false);
//       return;
//     }

//     if (validateTaxDetails()) {
//       setLoading(true);
//       const updateParams = {
//         id: savedTaxDetails?.id,
//         // userName: taxDetails?.userName,
//         businessName: taxDetails?.businessName,
//         tanNum: taxDetails?.tanNum,
//         taxClassification: {
//           name: taxDetails?.taxClassification,
//           updatedBy: userId,
//         },
//         agentId: agentId,
//         updatedBy: userId,
//       };

//       dispatch(updateTaxInformationData(updateParams))
//         .then(({ payload }) => {
//           if (payload?.status === 200) {
//             // fetchTaxDetails();
//             setIsTaxInfoModalOpen(false);
//             fetchNotificationData();
//           }
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   };
//   return (
//     <>
//       <div className="mt-1 h-fit rounded-lg border border-gray-200 bg-white p-4">
//         <div>
//           <div className="mb-2 grid grid-cols-[1fr_auto] items-center">
//             <div className="grid grid-cols-[auto_1fr] items-center gap-2">
//               <span>
//                 <Avatar
//                   size={"xs"}
//                   onClick={() => {
//                     /* setShowConfirmDialog(true) */
//                   }}
//                   src={TicketStar}
//                 />
//               </span>
//               <span className="text-txt-md-14 text-black-500 font-semibold">
//                 <h3>Tax Info</h3>
//               </span>
//             </div>
//             <button
//               onClick={() => handleModalOpen()}
//               className="text-txt-md-14 text-primary-accent cursor-pointer font-semibold hover:underline"
//             >
//               Update
//             </button>
//           </div>

//           <div className="space-y-3 text-sm">
//             <div className="grid grid-cols-2">
//               <span className="text-txt-md-14 text-primary-theme-1 font-medium">
//                 Name
//               </span>
//               <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
//                 {savedTaxDetails?.name || "--"}
//               </span>
//             </div>
//             <div className="grid grid-cols-2">
//               <span className="text-txt-md-14 text-primary-theme-1 font-medium">
//                 Business Name
//               </span>
//               <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
//                 {savedTaxDetails?.businessName || "--"}
//               </span>
//             </div>
//             <div className="grid grid-cols-2">
//               <span className="text-txt-md-14 text-primary-theme-1 font-medium">
//                 TAN
//               </span>
//               <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
//                 {savedTaxDetails?.tin || "--"}
//               </span>
//             </div>
//             <div className="grid grid-cols-2">
//               <span className="text-txt-md-14 text-primary-theme-1 font-medium">
//                 Tax Classification
//               </span>
//               <span className="text-txt-md-14 text-right font-medium text-[#707EAE]">
//                 {savedTaxDetails?.taxClassification?.name || "--"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal
//         dialogStyle="h-hp-400 !rounded-xl pt-3 update-profile-detail-modal"
//         outerDivStyle=" !rounded-xl"
//         closeModal={handleModalClose}
//         visible={isTaxInfoModalOpen}
//         title={"Update Tax Info"}
//         // bodyStyle={" !max-w-3xl"}
//       >
//         <div className="">
//           <div className="md:gap-4">
//             <div className="">
//               <TextInput
//                 id={"userName"}
//                 type="text"
//                 placeholder={"Enter Name"}
//                 label={"Name"}
//                 name={"userName"}
//                 onChange={handleInputChange}
//                 value={taxDetails?.userName || ""}
//                 inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
//                 labelClass={"!text-txt-md-12 font-semibold"}
//               />
//               <div className="mt-1 h-4">
//                 {formErrors.userName && (
//                   <div className="text-xs text-red-500">
//                     {formErrors.userName}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="">
//               <TextInput
//                 id={"businessName"}
//                 type="text"
//                 placeholder={"Enter Business Name"}
//                 label={"Business Name"}
//                 name={"businessName"}
//                 value={taxDetails?.businessName || ""}
//                 onChange={handleInputChange}
//                 inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
//                 labelClass={"!text-txt-md-12 font-semibold"}
//               />
//               <div className="mt-1 h-4">
//                 {formErrors.businessName && (
//                   <div className="text-xs text-red-500">
//                     {formErrors.businessName}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="">
//               <TextInput
//                 id={"tanNum"}
//                 placeholder={"Enter TAN"}
//                 label={"Tan"}
//                 name="tanNum"
//                 value={taxDetails?.tanNum || ""}
//                 onChange={handleInputChange}
//                 inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
//                 labelClass={"!text-txt-md-12 font-semibold"}
//               />
//               <div className="mt-1 h-4">
//                 {formErrors.tanNum && (
//                   <div className="text-xs text-red-500">
//                     {formErrors.tanNum}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="">
//               <TextInput
//                 id={"taxClassification"}
//                 type="text"
//                 placeholder={"Enter Tax Classification"}
//                 label={"Tax Classification"}
//                 name="taxClassification"
//                 value={taxDetails?.taxClassification || ""}
//                 onChange={handleInputChange}
//                 inputStyle="!text-primary-theme-1 !font-[450] !text-txt-md-13"
//                 labelClass={"!text-txt-md-12 font-semibold"}
//               />
//               <div className="mt-1 h-4">
//                 {formErrors.taxClassification && (
//                   <div className="text-xs text-red-500">
//                     {formErrors.taxClassification}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="-mx-4 mt-2 mb-2 border-b border-gray-200"></div>
//         <div className="mt-3 grid">
//           <div className="flex gap-4 md:justify-self-end">
//             <Button
//               size="md"
//               name="Cancel"
//               isDisabled={false}
//               isActive={true}
//               onClick={handleModalClose}
//               btnStyle="sm:w-full md:w-[120px] border border-[#1F3E63] !text-[#1F3E63] bg-white hover:bg-gray-50 rounded-md font-medium text-txt-md-14 !h-9"
//             />
//             <Button
//               size="md"
//               name="Save"
//               isDisabled={false}
//               isActive={true}
//               onClick={handleFormSubmit}
//               btnStyle="sm:w-full md:w-[120px] bg-[#1F3E63] text-white hover:bg-[#173250] rounded-md font-medium text-txt-md-14 !h-9"
//             />
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default TaxInfo;
