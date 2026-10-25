/**
 * File : AgentLevel.jsx
 * Description :
 * This component renders a modal dialog for selecting and updating an agent's level
 * within a user profile management module. It utilizes a searchable dropdown to display
 * available agent levels and provides validation feedback for user input. The dialog
 * includes "Cancel" and "Save" actions to either dismiss the modal or submit the selected
 * agent level. This component is intended to be used as part of the profile management
 * workflow in the frontend application.
 *
 * 
 * Authors     : Developer Team
 * Created On  : 2025-06-14
 * Updated On  : 2025-06-29

 * 
 * Props:
 * @param {Function} handleUpdateAgentLevel - Callback to handle saving the updated agent level.
 * @param {boolean} isAgentLevelDialogOpen - Controls the visibility of the dialog.
 * @param {Object} formData - Contains data required for the form, including agentLevels.
 * @param {Function} handleAgentLevelChange - Callback for handling changes in the agent level selection.
 * @param {Object} profileDetails - Contains current profile details, including the selected level.
 * @param {Object} levelErrors - Contains validation errors related to agent level selection.
 * @param {Function} handleAgentLevelModalClose - Callback to close the agent level dialog.
 */
import React from "react";
import { Button, Dialog, SearchableDropdown } from "../../../ui-controls/index";

const AgentLevel = ({
  handleUpdateAgentLevel,
  isAgentLevelDialogOpen,
  formData,
  handleAgentLevelChange,
  profileDetails,
  levelErrors,
  handleAgentLevelModalClose,
}) => {
  return (
    <Dialog
      // dialogStyle="error-dialog"
      closeModal={() => handleAgentLevelModalClose()}
      visible={isAgentLevelDialogOpen}
      outerDivStyle="!min-w-[350px] !m-0"
    >
      <div className="min-h-[150px]">
        <label className="label-sm text-color-text !text-txt-md-13 mb-2 block font-semibold">
          Select Agent Level
        </label>
        <SearchableDropdown
          id="dropdown"
          placeholder="Select agent level"
          options={formData?.agentLevels}
          optionLabel="name"
          optionValue="name"
          onChange={(e) => {
            handleAgentLevelChange(e, "level");
          }}
          name="agentLevel"
          value={profileDetails?.level || ""}
          dropdownStyle="dropdown w-full mt-1"
          menuStyle="menu"
        />
        <div className="mt-1 h-4">
          {levelErrors.level && (
            <div className="text-xs text-red-500">{levelErrors.level}</div>
          )}
        </div>
      </div>
      <div className="-mx-4 mt-2 mb-4 border-b border-gray-200"></div>
      <div className="mt-3 grid">
        <div className="grid grid-cols-2 gap-4 md:justify-self-end">
          <Button
            size="md"
            name="Cancel"
            isDisabled={false}
            isActive={true}
            onClick={handleAgentLevelModalClose}
            btnStyle="sm:w-full md:w-[120px] border border-[#1F3E63] !text-[#1F3E63] bg-white hover:bg-gray-50 rounded-md font-medium text-txt-md-14 !h-9"
          />
          <Button
            size="md"
            name="Save"
            isDisabled={false}
            isActive={true}
            onClick={handleUpdateAgentLevel}
            btnStyle="sm:w-full md:w-[120px] bg-[#1F3E63] text-white hover:bg-[#173250] rounded-md font-medium text-txt-md-14 !h-9"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AgentLevel;
