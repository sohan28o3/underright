import {
  Menu,
  ShieldCheck,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

function getPageInformation(
  pathname,
) {
  if (
  pathname.includes(
    "/copilot",
  )
) {
  return {
    title:
      "Underwriter Copilot",

    subtitle:
      "Application-specific AI explanation and investigation workspace.",
  };
}
  if (
    pathname.includes(
      "/result",
    )
  ) {
    return {
      title:
        "Assessment Result",
      subtitle:
        "Transparent scoring, signals and calculation breakdown.",
    };
  }

  if (
    pathname.startsWith(
      "/assessments/new",
    )
  ) {
    return {
      title:
        "New Credit Assessment",
      subtitle:
        "Create a transparent prototype credit intelligence assessment.",
    };
  }

  if (
    pathname.startsWith(
      "/applications",
    )
  ) {
    return {
      title: "Applications",
      subtitle:
        "Review persisted applications and assessments.",
    };
  }

  return {
    title:
      "Credit Intelligence Dashboard",
    subtitle:
      "Overview of underwriting activity and portfolio signals.",
  };
}

function Header({
  onMenuClick,
}) {
  const location =
    useLocation();

  const { user } =
    useAuth();

  const page =
    getPageInformation(
      location.pathname,
    );

  const initials =
    user?.name
      ?.split(" ")
      .map(
        (part) =>
          part[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "DU";

  return (
    <header className="flex min-h-20 items-center justify-between gap-5 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={
            onMenuClick
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
            {page.title}
          </h1>

          <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 xl:flex">
          <ShieldCheck
            size={14}
          />

          Human review required
        </div>

        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-slate-800">
            {user?.name ||
              "Demo Underwriter"}
          </p>

          <p className="text-xs text-slate-400">
            Underwriter
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Header;