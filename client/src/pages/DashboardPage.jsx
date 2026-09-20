import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Database,
  FilePlus2,
  History,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "../services/api";

function DashboardPage() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadApplications =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/applications",
              {
                params: {
                  limit: 5,
                },
              },
            );

          setData(response.data);
        } catch (requestError) {
          setError(
            requestError.response?.data
              ?.message ||
              "Unable to load application data.",
          );
        } finally {
          setLoading(false);
        }
      };

    loadApplications();
  }, []);

  const totalApplications =
    data?.pagination?.total ?? 0;

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_auto] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <ShieldCheck size={14} />

              Human-centered decision support
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Explain the signals behind
              every credit assessment.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              UnderRight separates
              deterministic scoring from
              generative AI. Scores remain
              transparent and reproducible,
              while AI helps underwriters
              understand supplied factors.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/assessments/new"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <FilePlus2 size={17} />

                New assessment
              </Link>

              <Link
                to="/applications"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <History size={17} />

                View applications
              </Link>
            </div>
          </div>

          <div className="hidden h-36 w-36 items-center justify-center rounded-full border-[16px] border-slate-100 xl:flex">
            <div className="text-center">
              <CheckCircle2
                size={30}
                className="mx-auto text-emerald-600"
              />

              <p className="mt-2 text-xs font-semibold text-slate-600">
                API LIVE
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatusCard
          icon={Database}
          label="Persisted Applications"
          value={
            loading
              ? "..."
              : totalApplications
          }
          description="Loaded from PostgreSQL through the protected API."
        />

        <StatusCard
          icon={CircleDollarSign}
          label="Scoring Engine"
          value="Active"
          description="Numerical assessments are generated deterministically."
        />

        <StatusCard
          icon={ShieldCheck}
          label="Decision Control"
          value="Human"
          description="UnderRight does not automatically approve or reject credit."
        />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-950">
              Recent applications
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Temporary Phase 3 view.
              Full dashboard analytics
              arrives in Phase 5.
            </p>
          </div>

          <Link
            to="/applications"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950"
          >
            View all

            <ArrowRight size={15} />
          </Link>
        </div>

        {loading && (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading applications...
          </div>
        )}

        {!loading && error && (
          <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          data?.applications?.length ===
            0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              No applications found.
            </div>
          )}

        {!loading &&
          !error &&
          data?.applications?.length >
            0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <TableHeader>
                      Reference
                    </TableHeader>

                    <TableHeader>
                      Applicant
                    </TableHeader>

                    <TableHeader>
                      Requested
                    </TableHeader>

                    <TableHeader>
                      Score
                    </TableHeader>

                    <TableHeader>
                      Risk
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {data.applications.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="border-b border-slate-100 last:border-0"
                      >
                        <TableCell>
                          <span className="font-mono text-xs text-slate-500">
                            {
                              application.applicationReference
                            }
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-slate-800">
                            {
                              application.applicantName
                            }
                          </span>
                        </TableCell>

                        <TableCell>
                          {formatCurrency(
                            application.requestedAmount,
                          )}
                        </TableCell>

                        <TableCell>
                          <span className="font-semibold text-slate-950">
                            {
                              application.totalScore
                            }
                          </span>

                          <span className="text-slate-400">
                            /100
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {
                              application.riskLevel
                            }
                          </span>
                        </TableCell>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function TableHeader({
  children,
}) {
  return (
    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

function TableCell({
  children,
}) {
  return (
    <td className="px-6 py-4 text-sm text-slate-600">
      {children}
    </td>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value || 0);
}

export default DashboardPage;