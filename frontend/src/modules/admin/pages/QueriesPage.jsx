import { useEffect, useState } from "react";
import { fetchAdminInquiries } from "../../../services/adminApi";

function QueriesPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminInquiries()
      .then((body) => setRows(body.data || []))
      .catch((loadError) => setError(loadError.message));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Queries</h1>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {!rows.length && !error ? <p className="text-white/50">No queries yet.</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-white/10 p-4">
            <div className="mb-2 flex flex-wrap justify-between gap-2">
              <h2 className="font-semibold">{row.fullName}</h2>
              <span className="text-sm uppercase text-white/50">{row.intent}</span>
            </div>
            <p className="text-sm text-white/50">{row.email}{row.phone ? ` · ${row.phone}` : ""}{row.city ? ` · ${row.city}` : ""}</p>
            {row.organization ? <p className="text-sm text-white/70">{row.organization}</p> : null}
            <p className="mt-2">{row.message}</p>
            <p className="mt-2 text-xs text-white/40">{new Date(row.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default QueriesPage;
