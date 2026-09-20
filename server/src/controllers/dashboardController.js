import pool from "../config/db.js";

export async function getDashboard(req, res) {
  const summaryResult = await pool.query(`
    SELECT
      COUNT(*)::int AS total_applications,
      COALESCE(ROUND(AVG(total_score), 1), 0) AS average_score,

      COUNT(*) FILTER (
        WHERE risk_level = 'Low Risk'
      )::int AS low_risk,

      COUNT(*) FILTER (
        WHERE risk_level = 'Moderate-Low Risk'
      )::int AS moderate_low_risk,

      COUNT(*) FILTER (
        WHERE risk_level = 'Moderate Risk'
      )::int AS moderate_risk,

      COUNT(*) FILTER (
        WHERE risk_level IN (
          'High Risk',
          'Very High Risk'
        )
      )::int AS higher_risk

    FROM assessments
  `);

  const riskDistributionResult =
    await pool.query(`
      SELECT
        risk_level,
        COUNT(*)::int AS count

      FROM assessments

      GROUP BY risk_level
    `);

  const scoreDistributionResult =
    await pool.query(`
      SELECT
        CASE
          WHEN total_score >= 80 THEN '80-100'
          WHEN total_score >= 65 THEN '65-79'
          WHEN total_score >= 50 THEN '50-64'
          WHEN total_score >= 35 THEN '35-49'
          ELSE '0-34'
        END AS score_range,

        COUNT(*)::int AS count

      FROM assessments

      GROUP BY score_range
  `);

  const trendResult =
    await pool.query(`
      SELECT
        DATE(a.created_at) AS date,
        COUNT(*)::int AS count,
        ROUND(AVG(s.total_score), 1) AS average_score

      FROM applications a

      JOIN assessments s
        ON s.application_id = a.id

      WHERE a.created_at >=
        CURRENT_DATE - INTERVAL '13 days'

      GROUP BY DATE(a.created_at)

      ORDER BY DATE(a.created_at)
  `);

  const recentResult =
    await pool.query(`
      SELECT
        a.id,
        a.application_reference,
        a.applicant_name,
        a.requested_amount,
        a.created_at,
        s.total_score,
        s.risk_level

      FROM applications a

      JOIN assessments s
        ON s.application_id = a.id

      ORDER BY a.created_at DESC

      LIMIT 6
  `);

  const summaryRow =
    summaryResult.rows[0];

  const riskOrder = [
    "Low Risk",
    "Moderate-Low Risk",
    "Moderate Risk",
    "High Risk",
    "Very High Risk",
  ];

  const riskMap =
    new Map(
      riskDistributionResult.rows.map(
        (row) => [
          row.risk_level,
          row.count,
        ],
      ),
    );

  const riskDistribution =
    riskOrder.map((riskLevel) => ({
      riskLevel,
      count:
        riskMap.get(riskLevel) || 0,
    }));

  const scoreOrder = [
    "80-100",
    "65-79",
    "50-64",
    "35-49",
    "0-34",
  ];

  const scoreMap =
    new Map(
      scoreDistributionResult.rows.map(
        (row) => [
          row.score_range,
          row.count,
        ],
      ),
    );

  const scoreDistribution =
    scoreOrder.map((range) => ({
      range,
      count:
        scoreMap.get(range) || 0,
    }));

  const assessmentTrend =
    trendResult.rows.map((row) => ({
      date: row.date,
      count: row.count,
      averageScore:
        Number(row.average_score),
    }));

  const recentApplications =
    recentResult.rows.map((row) => ({
      id: Number(row.id),
      applicationReference:
        row.application_reference,
      applicantName:
        row.applicant_name,
      requestedAmount:
        Number(row.requested_amount),
      totalScore:
        row.total_score,
      riskLevel:
        row.risk_level,
      createdAt:
        row.created_at,
    }));

  return res.status(200).json({
    summary: {
      totalApplications:
        summaryRow.total_applications,

      averageScore:
        Number(
          summaryRow.average_score,
        ),

      lowRisk:
        summaryRow.low_risk,

      moderateLowRisk:
        summaryRow.moderate_low_risk,

      moderateRisk:
        summaryRow.moderate_risk,

      higherRisk:
        summaryRow.higher_risk,
    },

    riskDistribution,
    scoreDistribution,
    assessmentTrend,
    recentApplications,
  });
}