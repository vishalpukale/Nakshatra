import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, setAdminToken } from "../../services/adminApi";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = await adminLogin(email, password);
      setAdminToken(body.data.token);
      sessionStorage.setItem("nakshatra_admin", JSON.stringify(body.data.admin));
      navigate("/admin/events");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-white/10 p-8">
        <h1 className="mb-2 text-3xl font-bold">Nakshatra admin</h1>
        <p className="mb-6 text-sm text-gray-400">Sign in with an admin account stored in the database.</p>
        <label className="mb-4 block text-sm">
          Email
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            type="email"
            value={email}
            onChange={(input) => setEmail(input.target.value)}
            required
          />
        </label>
        <label className="mb-4 block text-sm">
          Password
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            type="password"
            value={password}
            onChange={(input) => setPassword(input.target.value)}
            required
          />
        </label>
        {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
