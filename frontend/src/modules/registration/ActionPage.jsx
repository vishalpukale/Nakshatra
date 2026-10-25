import RegistrationForm from "./RegistrationForm";
import InquiryForm from "./InquiryForm";

function ActionPage({ intent }) {
  const title = {
    register: "Register",
    partner: "Become a Partner",
    mission: "Join the Mission",
  }[intent];

  return (
    <section className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-4xl font-bold">{title}</h1>
        {intent === "register" ? (
          <RegistrationForm tone="dark" />
        ) : (
          <InquiryForm intent={intent} tone="dark" />
        )}
      </div>
    </section>
  );
}

export default ActionPage;
