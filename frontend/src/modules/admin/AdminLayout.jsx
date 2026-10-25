import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAdminToken } from "../../services/adminApi";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login");
      return;
    }
    const stored = sessionStorage.getItem("nakshatra_admin");
    if (stored) setAdmin(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white md:flex">
      <AdminSidebar admin={admin} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`min-w-0 flex-1 ${collapsed ? "pl-[72px]" : "pl-64"} md:pl-0`}>
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Outlet context={{ admin }} />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
