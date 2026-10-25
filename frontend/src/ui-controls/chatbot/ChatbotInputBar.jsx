import React, { useState } from "react";
import PropTypes from "prop-types";
import { ArrowUp, AttachmentIcon, CloseEye } from "../../assets";
import { inputTypeEnum } from "../../services/constants";
import {Avatar} from "../index";

const ChatbotInputBar = ({
  newMessage,
  setNewMessage,
  handleSend,
  handleFileUpload,
  placeholder = "Type your message...",
  maxLength = 500,
  imageIcon,
  showPasswordToggle = false,
}) => {
  const [inputType, setInputType] = useState("text");

  const toggleInputType = () => {
    setInputType((prev) =>
      prev === inputTypeEnum.text ? inputTypeEnum.password : inputTypeEnum.text
    );
  };

  return (
    <div className="px-3 py-2 bg-white rounded-lg border border-gray-border">
      {/* Input Field at the top */}
      <div className="relative">
        <input
          name="inputForChatbot"
          type={inputType}
          value={newMessage}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setNewMessage(e.target.value);
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          className="w-full mb-1 !p-0 border-none font-medium text-txt-md-13 outline-none bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent"
          autoComplete="off"
        />

        {/* Icon Toggle */}
        {showPasswordToggle && (
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={toggleInputType}
          >
            <img
              src={inputType === "text" ? imageIcon : CloseEye}
              alt="Toggle"
              className="w-4 h-4 text-gray-500"
            />
          </div>
        )}
      </div>

      {/* Bottom Buttons (justify-between) */}
      <div className="flex items-center justify-between">
        {/* File Upload */}
        <div>
          <input
            type="file"
            id="chatbot-file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="chatbot--fileupload"
            className="cursor-pointer text-xl text-gray-600"
          >
            <Avatar src={AttachmentIcon} imgStyle={"h-5 w-5"} />
          </label>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="rounded-full bg-primary-theme p-2 text-sm text-white"
        >
          <Avatar src={ArrowUp} imgStyle={"h-4 w-4"}  />
        </button>
      </div>
    </div>
  );
};

ChatbotInputBar.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  imageIcon: PropTypes.string,
  showPasswordToggle: PropTypes.bool,
};

export default ChatbotInputBar;
