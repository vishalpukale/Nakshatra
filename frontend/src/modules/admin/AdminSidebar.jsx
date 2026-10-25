import { NavLink, useNavigate } from "react-router-dom";
import { setAdminToken } from "../../services/adminApi";

const links = [
  { to: "/admin/events", label: "Events", icon: "E" },
  { to: "/admin/gallery", label: "Gallery", icon: "G" },
  { to: "/admin/states", label: "States", icon: "S" },
  { to: "/admin/site", label: "Home & About", icon: "H" },
  { to: "/admin/registrations", label: "Registrations", icon: "R" },
  { to: "/admin/queries", label: "Queries", icon: "Q" },
  { to: "/admin/admins", label: "Admins", icon: "A" },
];

function AdminSidebar({ admin, collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const signOut = () => {
    setAdminToken("");
    sessionStorage.removeItem("nakshatra_admin");
    navigate("/admin/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/10 bg-[#14081c] transition-all duration-300 md:static ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-4">
        <button type="button" className="min-w-0 text-left" onClick={() => setCollapsed(false)}>
          <span className="block text-sm font-semibold tracking-wide text-white">
            {collapsed ? "N" : "Nakshatra"}
          </span>
          {collapsed ? null : <span className="block text-xs text-white/50">Backoffice</span>}
        </button>
        {collapsed ? null : (
          <button
            type="button"
            className="rounded-md p-2 text-white/70"
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed(true)}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="grid gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                title={link.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-3 py-2.5 text-sm ${
                    isActive
                      ? "bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] font-semibold"
                      : "hover:bg-white/10"
                  }`
                }
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">
                  {link.icon}
                </span>
                {collapsed ? null : <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        {collapsed ? null : (
          <p className="mb-2 truncate text-xs text-white/50">{admin?.email}</p>
        )}
        <button
          type="button"
          onClick={signOut}
          className="w-full rounded-full px-3 py-2 text-left text-sm hover:bg-white/10"
        >
          {collapsed ? "Out" : "Sign out"}
        </button>
        {collapsed ? null : (
          <a href="/" className="mt-1 block rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10">
            View public site
          </a>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;
