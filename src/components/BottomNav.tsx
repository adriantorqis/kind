import { Home, ClipboardList, Wifi } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/activity", label: "Activity", icon: ClipboardList },
  { to: "/connectivity", label: "Connect", icon: Wifi },
];

export function BottomNav() {
  return (
    <div className="flex shrink-0 items-start justify-around border-t border-black/5 bg-white pb-6 pt-3">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 ${isActive ? "text-[#1d4ed8]" : "text-[#9e9e9e]"}`
          }
        >
          <Icon size={24} />
          <span className="text-[11px] font-medium">{label}</span>
        </NavLink>
      ))}
    </div>
  );
}
