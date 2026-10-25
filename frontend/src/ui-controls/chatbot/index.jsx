import React from "react";
import { Avatar, Button, LinkButton } from "../index";
import { MagicSparkles, PaymentLogo } from "../../assets/index";
import AIChatbotCards from "./AIChatbotCards";
import ChatbotInputBar from "./ChatbotInputBar";
import classNames from "classnames";

const AIChatbot = ({
  isOpen,
  messages,
  newMessage,
  setNewMessage,
  toggleModal,
  handleSend,
  cardData,
  onCardClick,
}) => {
  return (
    <>
      {!isOpen && (
        <div>
          <Button
            size={"md"}
            name={"Ask Me Anything"}
            isDisabled={false}
            image={MagicSparkles}
            isActive={true}
            onClick={toggleModal}
            imgClass={"h-5 w-5"}
            btnStyle="fixed !h-12 border-none !rounded-full px-10 bottom-[20px] right-[20px] z-1000 rounded-[50%] !border !font-semibold !bg-primary-accent rounded-lg focus:outline-none text-white bg-primary-theme hover:bg-black-400 cursor-pointer !text-txt-md-12"
          />
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed right-0 bottom-0 z-[1001] grid h-[calc(100dvh-150px)] w-[350px] grid-rows-[auto_1fr_auto] rounded-lg bg-white">
          {/* Chat Header */}
          <div className="!bg-primary-accent text-txt-md-14 relative rounded-t-lg p-2 font-semibold text-white">
            <span className="ml-2">Ask Me Anything</span>
            <LinkButton
              isActive={true}
              label="&times;"
              btnStyle={
                "btn-style !text-3xl font-light !text-white absolute top-1 right-1"
              }
              onClick={toggleModal}
            />
          </div>

          {/* Chat Messages */}
          <div className="overflow-y-auto custom-scrollbar bg-gray-50 p-2">
            {/* <Avatar src={PaymentLogo} imgStyle={"grid h-full items-end justify-center"} /> */}

            {messages.length !== 0 ? (
              <div className="flex flex-col gap-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={classNames(
                      "flex",
                      msg.from === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={classNames(
                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm break-words shadow-sm sm:max-w-[80%] md:max-w-[70%]",
                        msg.from === "user"
                          ? "rounded-br-none bg-blue-600 text-white"
                          : "rounded-bl-none bg-gray-200 text-black",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-auto grid h-full items-end justify-center text-gray-500">
                <AIChatbotCards cardData={cardData} onCardClick={onCardClick} />
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="border-gray-border grid items-center gap-2 border-t-2 p-2">
            <ChatbotInputBar
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSend={handleSend}
              handleFileUpload={(e) => {
                if (e.target.files?.[0]) {
                  alert(`File uploaded: ${e.target.files[0].name}`);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
