import { useEffect, useState } from "react";
import { fetchManagedSite, saveSiteContent } from "../../../services/adminApi";

const fieldClass = "mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-white";

function SitePage() {
  const [form, setForm] = useState({ heroTitle: "", heroSubtitle: "", aboutCopy: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchManagedSite()
      .then((body) => setForm(body.data))
      .catch((loadError) => setError(loadError.message));
  }, []);

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setMessage("");
    try {
      await saveSiteContent(form);
      setMessage("Saved. The public home and about pages use this text.");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Home and about</h1>
      <p className="mb-6 mt-1 text-sm text-white/60">This is the heading on the home banner and the about paragraph.</p>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {message ? <p className="mb-4 text-green-400">{message}</p> : null}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <label className="block text-sm">
          Home heading
          <input className={fieldClass} value={form.heroTitle} onChange={(input) => setForm({ ...form, heroTitle: input.target.value })} />
        </label>
        <label className="block text-sm">
          Home line
          <textarea className={fieldClass} rows="3" value={form.heroSubtitle} onChange={(input) => setForm({ ...form, heroSubtitle: input.target.value })} />
        </label>
        <label className="block text-sm">
          About paragraph
          <textarea className={fieldClass} rows="6" value={form.aboutCopy} onChange={(input) => setForm({ ...form, aboutCopy: input.target.value })} />
        </label>
        <button type="submit" className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2">
          Save text
        </button>
      </form>
    </div>
  );
}

export default SitePage;
