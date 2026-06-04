import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Orders", path: "/orders", icon: "☰" },
  { label: "Customers", path: "/customers", icon: "👤" },
  { label: "Products", path: "/products", icon: "📦" },
  { label: "Pricing", path: "/pricing", icon: "◈" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-56 bg-teal-800 flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-teal-700">
        <h1 className="text-white font-bold text-xl">FOBOH</h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-teal-600 text-white font-medium"
                  : "text-teal-100 hover:bg-teal-700"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-teal-700">
        <button
          onClick={() => {
            onLogout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-teal-100 hover:bg-teal-700 w-full transition-colors"
        >
          <span>→</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
