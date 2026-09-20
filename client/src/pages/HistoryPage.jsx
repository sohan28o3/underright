import {
  useEffect,
  useState,
} from "react";

import {
  Filter,
  Search,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "../services/api";

import RiskBadge from "../components/RiskBadge";

import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";

function HistoryPage() {
  const [applications, setApplications] =
    useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [riskLevel, setRiskLevel] =
    useState("");

  const [minScore, setMinScore] =
    useState("");

  const [maxScore, setMaxScore] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/applications",
          {
            params: {
              search,
              riskLevel,
              minScore,
              maxScore,
              page,
              limit: 10,
            },
          },
        );

      setApplications(
        response.data.applications,
      );

      setPagination(
        response.data.pagination,
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          "Unable to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer =
      setTimeout(
        loadApplications,
        250,
      );

    return () =>
      clearTimeout(timer);
  }, [
    search,
    riskLevel,
    minScore,
    maxScore,
    page,
  ]);

  function updateFilter(
    setter,
    value,
  ) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setRiskLevel("");
    setMinScore("");
    setMaxScore("");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Application History
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search and review all
          persisted credit intelligence
          assessments.
        </p>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter size={16} />

          Filters
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(
                event,
              ) =>
                updateFilter(
                  setSearch,
                  event.target.value,
                )
              }
              placeholder="Search name or reference"
              className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={riskLevel}
            onChange={(
              event,
            ) =>
              updateFilter(
                setRiskLevel,
                event.target.value,
              )
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
          >
            <option value="">
              All risk levels
            </option>

            <option>
              Low Risk
            </option>

            <option>
              Moderate-Low Risk
            </option>

            <option>
              Moderate Risk
            </option>

            <option>
              High Risk
            </option>

            <option>
              Very High Risk
            </option>
          </select>

          <input
            type="number"
            min="0"
            max="100"
            value={minScore}
            onChange={(
              event,
            ) =>
              updateFilter(
                setMinScore,
                event.target.value,
              )
            }
            placeholder="Min score"
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
          />

          <input
            type="number"
            min="0"
            max="100"
            value={maxScore}
            onChange={(
              event,
            ) =>
              updateFilter(
                setMaxScore,
                event.target.value,
              )
            }
            placeholder="Max score"
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
          />

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Clear filters
          </button>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-950">
              Applications
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {pagination?.total || 0}{" "}
              matching records
            </p>
          </div>
        </div>

        {loading && (
          <div className="p-10 text-center text-sm text-slate-500">
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
          applications.length ===
            0 && (
            <div className="p-12 text-center text-sm text-slate-500">
              No applications match
              the selected filters.
            </div>
          )}

        {!loading &&
          !error &&
          applications.length >
            0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <TableHeader>
                        Reference
                      </TableHeader>

                      <TableHeader>
                        Applicant
                      </TableHeader>

                      <TableHeader>
                        Requested Amount
                      </TableHeader>

                      <TableHeader>
                        Score
                      </TableHeader>

                      <TableHeader>
                        Risk Level
                      </TableHeader>

                      <TableHeader>
                        Date
                      </TableHeader>

                      <TableHeader>
                        Action
                      </TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map(
                      (
                        application,
                      ) => (
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
                            <span className="font-medium text-slate-900">
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
                            <RiskBadge
                              riskLevel={
                                application.riskLevel
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {formatDate(
                              application.createdAt,
                            )}
                          </TableCell>

                          <TableCell>
                            <Link
                              to={`/applications/${application.id}`}
                              className="font-semibold text-slate-700 hover:text-slate-950"
                            >
                              View
                            </Link>
                          </TableCell>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <span className="text-xs text-slate-500">
                  Page{" "}
                  {pagination?.page ||
                    1}{" "}
                  of{" "}
                  {pagination?.totalPages ||
                    1}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={
                      page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current -
                              1,
                          ),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      page >=
                      (pagination?.totalPages ||
                        1)
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current +
                          1,
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
      </section>
    </div>
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

export default HistoryPage;