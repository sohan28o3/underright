import {
  BrainCircuit,
  History,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Assessment",
    path: "/assessments/new",
    icon: PlusCircle,
  },
  {
    label: "Application History",
    path: "/applications",
    icon: History,
  },
];

function Sidebar({
  mobile = false,
  onClose,
}) {
  const {
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className={`flex h-full flex-col bg-slate-950 text-white ${
        mobile
          ? "w-[285px]"
          : "w-[260px]"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
            <BrainCircuit size={21} />
          </div>

          <div>
            <div className="text-sm font-bold tracking-[0.12em]">
              UNDER RIGHT
            </div>

            <div className="mt-0.5 text-[11px] text-slate-500">
              Credit Intelligence
            </div>
          </div>
        </NavLink>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.15em] text-slate-600">
          WORKSPACE
        </p>

        <div className="space-y-1">
          {navItems.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({
                  isActive,
                }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                  ].join(" ")
                }
              >
                <Icon size={18} />

                <span>{label}</span>
              </NavLink>
            ),
          )}
        </div>

        <div className="mx-1 mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck
              size={16}
              className="text-cyan-300"
            />

            Responsible AI
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Scores are produced by
            transparent prototype rules.
            Generative AI cannot alter the
            assessment or make a lending
            decision.
          </p>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <LogOut size={18} />

          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;