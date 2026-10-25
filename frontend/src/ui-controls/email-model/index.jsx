import React from "react";
import PropTypes from "prop-types";
import { Button, TextInput } from "../index";
import { Modal } from "../../ui-controls/index";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const EmailModel = ({
  visible,
  closeModal,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  handleSendEmail,
  isNoteVisible,
  noteVariables = [],
  btnName = "Send Email",
  title = "Send Email",
}) => {
  const onSend = () => {
    if (handleSendEmail && typeof handleSendEmail === "function") {
      handleSendEmail(emailSubject, emailBody);
    }
  };

  return (
    <Modal
      visible={visible}
      closeModal={closeModal}
      title={title}
      bodyStyle={"!max-w-5xl !max-h"}
      isNeedHeader={false}
    >
      <div
        className={`grid grid-cols-1 ${
          isNoteVisible ? "gap-6 md:grid-cols-[auto_1fr]" : ""
        } mt-4`}
      >
        {/* Email Input Section */}
        <div className="w-full">
          <TextInput
            label="Subject"
            placeholder="Subject"
            value={emailSubject}
            autoFocus={true}
            onChange={(e) => setEmailSubject(e.target.value)}
            inputStyle="w-full text-sm font-medium h-10 px-3 border rounded-md mb-2"
          />

          <div className="mb-4">
            <label className="text-txt-md-13 text-color-text mb-1 block">
              Body
            </label>
            <div className="w-full rounded-md bg-white text-sm font-medium">
              <ReactQuill
                theme="snow"
                value={emailBody || ""}
                onChange={setEmailBody}
                placeholder="Body"
                className="custom-quill-editor h-40 sm:h-60"
              />
            </div>
          </div>
        </div>

        {/* Note Variables Section */}
        {isNoteVisible && noteVariables.length > 0 && (
          <div className="mt-2 min-w-67 bg-white text-sm text-gray-600">
            <div className="max-h-55 md:max-h-80 custom-scrollbar overflow-x-auto rounded-md border border-gray-300 p-4">
              <div className="text-txt-16 mb-1 font-semibold text-gray-700">
                Available Variables:
              </div>
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                {noteVariables.map(({ code, description }) => (
                  <li key={code}>
                    <code>{code}</code> – {description}
                  </li>
                ))}
              </ul>
              <div className="mt-1 text-xs text-gray-500">
                These will be automatically replaced with agent-specific data.
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-0 text-right md:mt-8">
          <Button
            size="md"
            name={btnName}
            isActive={true}
            onClick={onSend}
            btnStyle="!border !border-gray-100 !font-medium !bg-primary-theme text-white hover:bg-black-400 rounded-lg px-2"
          />
        </div>
      </div>
    </Modal>
  );
};

EmailModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  emailSubject: PropTypes.string.isRequired,
  setEmailSubject: PropTypes.func.isRequired,
  emailBody: PropTypes.string.isRequired,
  setEmailBody: PropTypes.func.isRequired,
  handleSendEmail: PropTypes.func.isRequired,
  selectedEmails: PropTypes.array,
  isNoteVisible: PropTypes.bool,
  noteVariables: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  btnName: PropTypes.string,
  title: PropTypes.string,
};

EmailModel.defaultProps = {
  isNoteVisible: false,
  title: "Send Email",
  noteVariables: [],
};

export default EmailModel;
