import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  ChartNoAxesColumn,
  CircleGauge,
  FilePlus2,
  Files,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "../services/api";

import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

import RiskDistributionChart from "../components/charts/RiskDistributionChart";
import ScoreDistributionChart from "../components/charts/ScoreDistributionChart";
import AssessmentTrendChart from "../components/charts/AssessmentTrendChart";

import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";

function DashboardPage() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/dashboard",
          );

        setDashboard(
          response.data,
        );
      } catch (requestError) {
        setError(
          requestError.response
            ?.data?.message ||
            "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const {
    summary,
    riskDistribution,
    scoreDistribution,
    assessmentTrend,
    recentApplications,
  } = dashboard;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck
              size={14}
            />

            Human-centered underwriting
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Credit Intelligence
            Overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor prototype credit
            assessments, portfolio risk
            signals and recent
            underwriting activity.
          </p>
        </div>

        <Link
          to="/assessments/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <FilePlus2 size={17} />

          New Assessment
        </Link>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Files}
          label="Total Applications"
          value={
            summary.totalApplications
          }
          description="Persisted assessments"
        />

        <StatCard
          icon={CircleGauge}
          label="Average Score"
          value={
            summary.averageScore
          }
          description="Across all applications"
        />

        <StatCard
          icon={ShieldCheck}
          label="Low Risk"
          value={
            summary.lowRisk
          }
          description="Score 80 to 100"
        />

        <StatCard
          icon={Activity}
          label="Moderate"
          value={
            summary.moderateLowRisk +
            summary.moderateRisk
          }
          description="Moderate-Low and Moderate"
        />

        <StatCard
          icon={TriangleAlert}
          label="Higher Risk"
          value={
            summary.higherRisk
          }
          description="High and Very High"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Risk Distribution"
          subtitle="Applications grouped by prototype risk classification"
        >
          <RiskDistributionChart
            data={
              riskDistribution
            }
          />
        </ChartCard>

        <ChartCard
          title="Score Distribution"
          subtitle="Distribution across scoring bands"
        >
          <ScoreDistributionChart
            data={
              scoreDistribution
            }
          />
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard
          title="Assessment Activity"
          subtitle="Applications created over the recent period"
        >
          <AssessmentTrendChart
            data={
              assessmentTrend
            }
          />
        </ChartCard>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-950">
              Recent Applications
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Most recently submitted
              assessments.
            </p>
          </div>

          <Link
            to="/applications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            View all

            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
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

                <TableHeader>
                  Date
                </TableHeader>

                <TableHeader>
                  Action
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {recentApplications.map(
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
      </section>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <h3 className="font-semibold text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-5">
        {children}
      </div>
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

export default DashboardPage;