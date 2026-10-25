import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createAdminAccount, fetchAdmins, updateAdminAccess } from "../../../services/adminApi";

function AdminsPage() {
  const { admin } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const body = await fetchAdmins();
    setRows(body.data || []);
  };

  useEffect(() => {
    load().catch((loadError) => setError(loadError.message));
  }, []);

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setMessage("");
    try {
      await createAdminAccount(form);
      setForm({ fullName: "", email: "", password: "" });
      setMessage("Admin saved in the database.");
      await load();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Admins</h1>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {message ? <p className="mb-4 text-green-400">{message}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
              <div>
                <h2 className="font-semibold">{row.fullName || row.email}</h2>
                <p className="text-sm text-white/50">{row.email} · {row.role}</p>
              </div>
              {admin?.role === "SUPER_ADMIN" && row.id !== admin.id ? (
                <button
                  type="button"
                  className="rounded-md border border-white/20 px-3 py-1 text-sm"
                  onClick={async () => {
                    await updateAdminAccess(row.id, !row.isActive);
                    await load();
                  }}
                >
                  {row.isActive ? "Deactivate" : "Activate"}
                </button>
              ) : (
                <span className="text-sm text-white/50">{row.isActive ? "Active" : "Inactive"}</span>
              )}
            </article>
          ))}
        </div>
        {admin?.role === "SUPER_ADMIN" ? (
          <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 p-4">
            <h2 className="mb-3 font-semibold">Add an admin</h2>
            <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Full name" value={form.fullName} onChange={(input) => setForm({ ...form, fullName: input.target.value })} />
            <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Email" type="email" value={form.email} onChange={(input) => setForm({ ...form, email: input.target.value })} />
            <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Password" type="password" value={form.password} onChange={(input) => setForm({ ...form, password: input.target.value })} />
            <button type="submit" className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2">Save admin</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default AdminsPage;
