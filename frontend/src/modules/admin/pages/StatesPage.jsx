import { useEffect, useState } from "react";
import { fetchManagedStates, updateParticipatingState } from "../../../services/adminApi";

function StatesPage() {
  const [states, setStates] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const body = await fetchManagedStates();
    setStates(body.data || []);
  };

  useEffect(() => {
    load().catch((loadError) => setError(loadError.message));
  }, []);

  const toggle = async (state) => {
    await updateParticipatingState(state.id, !state.isParticipating);
    await load();
  };

  const visible = states.filter((state) => state.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <h1 className="text-3xl font-bold">Participating states</h1>
      <p className="mb-6 mt-1 text-sm text-white/60">States switched on here are the ones shown on the home page.</p>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      <input
        className="mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-black px-3 py-2"
        placeholder="Search states"
        value={query}
        onChange={(input) => setQuery(input.target.value)}
      />
      <div className="space-y-2">
        {visible.map((state) => (
          <article key={state.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            <div>
              <h2 className="font-medium">{state.name}</h2>
              <p className="text-xs text-white/50">{state.code}</p>
            </div>
            <button type="button" className="rounded-md border border-white/20 px-3 py-1 text-sm" onClick={() => toggle(state)}>
              {state.isParticipating ? "Shown on home" : "Hidden"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default StatesPage;
