import { createContext, useContext, useEffect, useState } from "react";
import Modal from "../../ui-controls/model";
import RegistrationForm from "./RegistrationForm";
import InquiryForm from "./InquiryForm";

const RegistrationContext = createContext(null);

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("Registration actions are only available inside the site layout.");
  }
  return context;
}

const TITLES = {
  register: "Register for Nakshatra",
  partner: "Become a Partner",
  mission: "Join the Mission",
  query: "Send a Query",
};

export function RegistrationProvider({ children }) {
  const [flow, setFlow] = useState(null);
  const [eventSlug, setEventSlug] = useState("");

  const openFlow = (nextFlow, options = {}) => {
    setEventSlug(options.eventSlug || "");
    setFlow(nextFlow);
  };

  const closeFlow = () => setFlow(null);

  useEffect(() => {
    if (!flow) return undefined;
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") closeFlow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flow]);

  return (
    <RegistrationContext.Provider value={{ openFlow, closeFlow }}>
      {children}
      <Modal
        visible={Boolean(flow)}
        closeModal={closeFlow}
        title={TITLES[flow] || ""}
        bodyStyle="!max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {flow === "register" ? <RegistrationForm eventSlug={eventSlug} /> : null}
        {flow && flow !== "register" ? <InquiryForm intent={flow} /> : null}
      </Modal>
    </RegistrationContext.Provider>
  );
}
