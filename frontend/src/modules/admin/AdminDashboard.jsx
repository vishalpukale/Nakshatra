import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createAdminAccount,
  fetchAdminInquiries,
  fetchAdminRegistrations,
  fetchAdmins,
  getAdminToken,
  setAdminToken,
  updateAdminAccess,
} from "../../services/adminApi";

const tabs = [
  { id: "registrations", label: "Registrations" },
  { id: "queries", label: "Queries" },
  { id: "admins", label: "Admins" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("registrations");
  const [admin, setAdmin] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    const [registrationBody, inquiryBody, adminBody] = await Promise.all([
      fetchAdminRegistrations(),
      fetchAdminInquiries(),
      fetchAdmins(),
    ]);
    setRegistrations(registrationBody.data || []);
    setInquiries(inquiryBody.data || []);
    setAdmins(adminBody.data || []);
  };

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login");
      return undefined;
    }
    const stored = sessionStorage.getItem("nakshatra_admin");
    if (stored) setAdmin(JSON.parse(stored));
    let cancelled = false;
    load().catch((loadError) => {
      if (cancelled) return;
      if (loadError.status === 401) {
        setAdminToken("");
        navigate("/admin/login");
        return;
      }
      setError(loadError.message);
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const signOut = () => {
    setAdminToken("");
    sessionStorage.removeItem("nakshatra_admin");
    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Admin</h1>
            <p className="text-sm text-gray-400">{admin?.email} · {admin?.role}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="rounded-md border border-white/20 px-3 py-2 text-sm">View site</Link>
            <button type="button" onClick={signOut} className="rounded-md border border-white/20 px-3 py-2 text-sm">Sign out</button>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-md px-4 py-2 text-sm ${tab === item.id ? "bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)]" : "border border-white/20"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error ? <p className="mb-4 text-red-400">{error}</p> : null}

        {tab === "registrations" ? (
          <RegistrationList rows={registrations} openId={openId} setOpenId={setOpenId} />
        ) : null}
        {tab === "queries" ? <InquiryList rows={inquiries} /> : null}
        {tab === "admins" ? (
          <AdminList
            rows={admins}
            current={admin}
            onCreated={load}
            onStatus={async (id, isActive) => {
              await updateAdminAccess(id, isActive);
              await load();
            }}
          />
        ) : null}
      </div>
    </main>
  );
}

function RegistrationList({ rows, openId, setOpenId }) {
  if (!rows.length) return <p className="text-gray-400">No registrations yet.</p>;
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <article key={row.id} className="rounded-xl border border-white/10 p-4">
          <button type="button" className="w-full text-left" onClick={() => setOpenId(openId === row.id ? null : row.id)}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{row.fullName || "Unnamed"}</h2>
                <p className="text-sm text-gray-400">{row.email} · {row.phone || "No phone"}</p>
              </div>
              <div className="text-right text-sm text-gray-300">
                <p>{row.eventName}</p>
                <p>{new Date(row.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </button>
          {openId === row.id ? (
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-500">State</dt><dd>{row.stateName || "—"}</dd></div>
              <div><dt className="text-gray-500">Payment</dt><dd>{row.paymentStatus}</dd></div>
              {row.answers.map((answer) => (
                <div key={answer.fieldKey}>
                  <dt className="text-gray-500">{answer.label}</dt>
                  <dd>
                    {String(answer.value).startsWith("/uploads/") ? (
                      <a className="underline" href={answer.value} target="_blank" rel="noreferrer">View video</a>
                    ) : answer.value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function InquiryList({ rows }) {
  if (!rows.length) return <p className="text-gray-400">No queries yet.</p>;
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <article key={row.id} className="rounded-xl border border-white/10 p-4">
          <div className="mb-2 flex flex-wrap justify-between gap-2">
            <h2 className="font-semibold">{row.fullName}</h2>
            <span className="text-sm uppercase text-gray-400">{row.intent}</span>
          </div>
          <p className="text-sm text-gray-400">{row.email}{row.phone ? ` · ${row.phone}` : ""}{row.city ? ` · ${row.city}` : ""}</p>
          {row.organization ? <p className="text-sm text-gray-300">{row.organization}</p> : null}
          <p className="mt-2">{row.message}</p>
          <p className="mt-2 text-xs text-gray-500">{new Date(row.createdAt).toLocaleString()}</p>
        </article>
      ))}
    </div>
  );
}

function AdminList({ rows, current, onCreated, onStatus }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setMessage("");
    try {
      await createAdminAccount(form);
      setForm({ fullName: "", email: "", password: "" });
      setMessage("Admin saved in the database.");
      await onCreated();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
            <div>
              <h2 className="font-semibold">{row.fullName || row.email}</h2>
              <p className="text-sm text-gray-400">{row.email} · {row.role}</p>
            </div>
            {current?.role === "SUPER_ADMIN" && row.id !== current.id ? (
              <button
                type="button"
                className="rounded-md border border-white/20 px-3 py-1 text-sm"
                onClick={() => onStatus(row.id, !row.isActive)}
              >
                {row.isActive ? "Deactivate" : "Activate"}
              </button>
            ) : (
              <span className="text-sm text-gray-400">{row.isActive ? "Active" : "Inactive"}</span>
            )}
          </article>
        ))}
      </div>
      {current?.role === "SUPER_ADMIN" ? (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-3 font-semibold">Add an admin</h2>
          <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Full name" value={form.fullName} onChange={(input) => setForm({ ...form, fullName: input.target.value })} />
          <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Email" type="email" value={form.email} onChange={(input) => setForm({ ...form, email: input.target.value })} />
          <input className="mb-3 w-full rounded-lg bg-white px-3 py-2 text-gray-900" placeholder="Password" type="password" value={form.password} onChange={(input) => setForm({ ...form, password: input.target.value })} />
          {error ? <p className="mb-2 text-sm text-red-400">{error}</p> : null}
          {message ? <p className="mb-2 text-sm text-green-400">{message}</p> : null}
          <button type="submit" className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2">Save admin</button>
        </form>
      ) : null}
    </div>
  );
}

export default AdminDashboard;
