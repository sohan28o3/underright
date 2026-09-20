import {
  ArrowLeft,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-400">
          ERROR 404
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you requested does not
          exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />

          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;