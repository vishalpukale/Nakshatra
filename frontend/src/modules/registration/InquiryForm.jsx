import { useState } from "react";
import { Link } from "react-router-dom";
import { submitInquiry } from "../../services/registrationApi";

const buttonClass =
  "rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white disabled:opacity-50";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[#5B1D4D]";

function InquiryForm({ intent, tone = "light" }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    city: "",
    message: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const labelClass = tone === "dark" ? "text-white" : "text-gray-800";

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = await submitInquiry({ ...form, intent, acceptedTerms: form.acceptedTerms ? "yes" : "" });
      setSuccess(body.message);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">{success}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-4 block">
        <span className={`text-sm font-medium ${labelClass}`}>Full name *</span>
        <input className={inputClass} value={form.fullName} onChange={(input) => update("fullName", input.target.value)} />
      </label>
      <label className="mb-4 block">
        <span className={`text-sm font-medium ${labelClass}`}>Email *</span>
        <input className={inputClass} type="email" value={form.email} onChange={(input) => update("email", input.target.value)} />
      </label>
      {intent !== "query" ? (
        <label className="mb-4 block">
          <span className={`text-sm font-medium ${labelClass}`}>Mobile number *</span>
          <input className={inputClass} inputMode="numeric" maxLength={10} value={form.phone} onChange={(input) => update("phone", input.target.value)} />
        </label>
      ) : null}
      {intent === "partner" ? (
        <label className="mb-4 block">
          <span className={`text-sm font-medium ${labelClass}`}>Organisation *</span>
          <input className={inputClass} value={form.organization} onChange={(input) => update("organization", input.target.value)} />
        </label>
      ) : null}
      {intent !== "query" ? (
        <label className="mb-4 block">
          <span className={`text-sm font-medium ${labelClass}`}>City</span>
          <input className={inputClass} value={form.city} onChange={(input) => update("city", input.target.value)} />
        </label>
      ) : null}
      <label className="mb-4 block">
        <span className={`text-sm font-medium ${labelClass}`}>Message *</span>
        <textarea className={inputClass} rows={4} value={form.message} onChange={(input) => update("message", input.target.value)} />
      </label>
      <label className={`mb-4 flex items-start gap-2 text-sm ${labelClass}`}>
        <input
          type="checkbox"
          className="mt-1"
          checked={form.acceptedTerms}
          onChange={(input) => update("acceptedTerms", input.target.checked)}
        />
        <span>
          I accept the <Link to="/terms" target="_blank" className="underline">Terms & Conditions</Link> and agree that Nakshatra may store these details.
        </span>
      </label>
      {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
      <button className={buttonClass} type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default InquiryForm;
