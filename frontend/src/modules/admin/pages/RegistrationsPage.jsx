import { useEffect, useState } from "react";
import { fetchAdminRegistrations } from "../../../services/adminApi";
import { apiUrl } from "../../../services/apiBase";

function RegistrationsPage() {
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminRegistrations()
      .then((body) => setRows(body.data || []))
      .catch((loadError) => setError(loadError.message));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Registrations</h1>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {!rows.length && !error ? <p className="text-white/50">No registrations yet.</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-white/10 p-4">
            <button type="button" className="w-full text-left" onClick={() => setOpenId(openId === row.id ? null : row.id)}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{row.fullName || "Unnamed"}</h2>
                  <p className="text-sm text-white/50">{row.email} · {row.phone || "No phone"}</p>
                </div>
                <div className="text-right text-sm text-white/70">
                  <p>{row.eventName}</p>
                  <p>{new Date(row.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </button>
            {openId === row.id ? (
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-white/40">State</dt><dd>{row.stateName || "—"}</dd></div>
                <div><dt className="text-white/40">Payment</dt><dd>{row.paymentStatus}</dd></div>
                {row.answers.map((answer) => (
                  <div key={answer.fieldKey}>
                    <dt className="text-white/40">{answer.label}</dt>
                    <dd>
                      {String(answer.value).startsWith("/uploads/") ? (
                        <a className="underline" href={apiUrl(answer.value)} target="_blank" rel="noreferrer">View video</a>
                      ) : answer.value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export default RegistrationsPage;
