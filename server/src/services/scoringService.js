function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function determineRiskLevel(score) {
  if (score >= 80) {
    return "Low Risk";
  }

  if (score >= 65) {
    return "Moderate-Low Risk";
  }

  if (score >= 50) {
    return "Moderate Risk";
  }

  if (score >= 35) {
    return "High Risk";
  }

  return "Very High Risk";
}

function getEmploymentPoints(months) {
  if (months >= 60) return 12;
  if (months >= 36) return 10;
  if (months >= 24) return 9;
  if (months >= 12) return 7;
  if (months >= 6) return 4;
  return 2;
}

function getRegularityPoints(regularity) {
  const points = {
    High: 8,
    Medium: 5,
    Low: 2,
  };

  return points[regularity] ?? 0;
}

function getDebtRatioPoints(ratio) {
  if (ratio <= 0.1) return 12;
  if (ratio <= 0.2) return 10;
  if (ratio <= 0.3) return 8;
  if (ratio <= 0.4) return 5;
  if (ratio <= 0.5) return 2;
  return 0;
}

function getRequestedAmountPoints(ratio) {
  if (ratio <= 1) return 8;
  if (ratio <= 2) return 4;
  if (ratio <= 3) return 2;
  if (ratio <= 5) return 1;
  return 0;
}

function getUtilityPoints(rate) {
  if (rate >= 95) return 12;
  if (rate >= 90) return 10;
  if (rate >= 80) return 8;
  if (rate >= 70) return 5;
  return 2;
}

function getMissedPaymentPoints(count) {
  if (count === 0) return 8;
  if (count === 1) return 5;
  if (count === 2) return 3;
  if (count === 3) return 1;
  return 0;
}

function getCashSurplusPoints(ratio) {
  if (ratio >= 0.3) return 10;
  if (ratio >= 0.2) return 8;
  if (ratio >= 0.1) return 6;
  if (ratio > 0) return 4;
  return 0;
}

function getBalanceCoveragePoints(ratio) {
  if (ratio >= 1) return 10;
  if (ratio >= 0.75) return 9;
  if (ratio >= 0.5) return 7;
  if (ratio >= 0.25) return 5;
  if (ratio > 0) return 2;
  return 0;
}

function getAccountAgePoints(months) {
  if (months >= 60) return 12;
  if (months >= 36) return 11;
  if (months >= 24) return 9;
  if (months >= 12) return 6;
  if (months >= 6) return 4;
  return 2;
}

function getBalanceIncomePoints(ratio) {
  if (ratio >= 1) return 8;
  if (ratio >= 0.75) return 7;
  if (ratio >= 0.5) return 6;
  if (ratio >= 0.25) return 5;
  if (ratio > 0) return 2;
  return 0;
}

export function calculateCreditScore(application) {
  const monthlyIncome = Number(application.monthlyIncome);
  const requestedAmount = Number(application.requestedAmount);
  const existingMonthlyDebt = Number(application.existingMonthlyDebt);
  const averageMonthlyBalance = Number(application.averageMonthlyBalance);
  const monthlyCredits = Number(application.monthlyCredits);
  const monthlyDebits = Number(application.monthlyDebits);
  const employmentMonths = Number(application.employmentMonths);
  const utilityPaymentRate = Number(application.utilityPaymentRate);
  const missedPayments = Number(application.missedPayments);
  const accountAgeMonths = Number(application.accountAgeMonths);
  const incomeRegularity = application.incomeRegularity;

  const employmentPoints = getEmploymentPoints(employmentMonths);
  const regularityPoints = getRegularityPoints(incomeRegularity);

  const incomeStability = Math.min(
    20,
    employmentPoints + regularityPoints,
  );

  const debtToIncomeRatio =
    monthlyIncome > 0 ? existingMonthlyDebt / monthlyIncome : 1;

  const requestedAmountRatio =
    monthlyIncome > 0 ? requestedAmount / monthlyIncome : 999;

  const debtRatioPoints = getDebtRatioPoints(debtToIncomeRatio);
  const requestedAmountPoints =
    getRequestedAmountPoints(requestedAmountRatio);

  const debtCapacity = Math.min(
    20,
    debtRatioPoints + requestedAmountPoints,
  );

  const utilityPoints = getUtilityPoints(utilityPaymentRate);
  const missedPaymentPoints =
    getMissedPaymentPoints(missedPayments);

  const paymentBehaviour = Math.min(
    20,
    utilityPoints + missedPaymentPoints,
  );

  const netCashFlow = monthlyCredits - monthlyDebits;

  const cashSurplusRatio =
    monthlyCredits > 0 ? netCashFlow / monthlyCredits : 0;

  const balanceCoverageRatio =
    monthlyDebits > 0
      ? averageMonthlyBalance / monthlyDebits
      : averageMonthlyBalance > 0
        ? 1
        : 0;

  const cashSurplusPoints =
    getCashSurplusPoints(cashSurplusRatio);

  const balanceCoveragePoints =
    getBalanceCoveragePoints(balanceCoverageRatio);

  const cashFlowStability = Math.min(
    20,
    cashSurplusPoints + balanceCoveragePoints,
  );

  const accountAgePoints =
    getAccountAgePoints(accountAgeMonths);

  const balanceIncomeRatio =
    monthlyIncome > 0
      ? averageMonthlyBalance / monthlyIncome
      : 0;

  const balanceIncomePoints =
    getBalanceIncomePoints(balanceIncomeRatio);

  const accountStability = Math.min(
    20,
    accountAgePoints + balanceIncomePoints,
  );

  const totalScore =
    incomeStability +
    debtCapacity +
    paymentBehaviour +
    cashFlowStability +
    accountStability;

  const riskLevel = determineRiskLevel(totalScore);

  const positiveFactors = [];
  const riskFactors = [];

  if (employmentMonths >= 24) {
    positiveFactors.push(
      "Established employment history supports income stability.",
    );
  } else if (employmentMonths < 12) {
    riskFactors.push(
      "Employment history is relatively short.",
    );
  }

  if (incomeRegularity === "High") {
    positiveFactors.push(
      "Income is reported as highly regular.",
    );
  } else if (incomeRegularity === "Low") {
    riskFactors.push(
      "Low income regularity introduces additional cash-flow uncertainty.",
    );
  }

  if (debtToIncomeRatio <= 0.2) {
    positiveFactors.push(
      "Existing monthly debt is relatively low compared with monthly income.",
    );
  } else if (debtToIncomeRatio > 0.4) {
    riskFactors.push(
      "Existing debt consumes a significant share of monthly income.",
    );
  } else if (debtToIncomeRatio > 0.3) {
    riskFactors.push(
      "Existing debt burden is moderately elevated.",
    );
  }

  if (requestedAmountRatio <= 1) {
    positiveFactors.push(
      "Requested credit is relatively modest compared with monthly income.",
    );
  } else if (requestedAmountRatio >= 1.5) {
    riskFactors.push(
      "Requested credit amount is material relative to monthly income.",
    );
  }

  if (utilityPaymentRate >= 95) {
    positiveFactors.push(
      "Utility payment consistency is strong.",
    );
  } else if (utilityPaymentRate < 80) {
    riskFactors.push(
      "Utility payment consistency is below the stronger range used by this prototype.",
    );
  }

  if (missedPayments === 0) {
    positiveFactors.push(
      "No missed payments were reported during the last 12 months.",
    );
  } else if (missedPayments === 1) {
    riskFactors.push(
      "One missed payment was reported during the last 12 months.",
    );
  } else if (missedPayments > 1) {
    riskFactors.push(
      `${missedPayments} missed payments were reported during the last 12 months.`,
    );
  }

  if (cashSurplusRatio >= 0.2) {
    positiveFactors.push(
      "Monthly cash flow shows a healthy positive surplus.",
    );
  } else if (netCashFlow <= 0) {
    riskFactors.push(
      "Monthly debits meet or exceed monthly credits.",
    );
  } else if (cashSurplusRatio < 0.1) {
    riskFactors.push(
      "Monthly cash-flow surplus is limited.",
    );
  }

  if (accountAgeMonths >= 24) {
    positiveFactors.push(
      "The account has an established operating history.",
    );
  } else if (accountAgeMonths < 12) {
    riskFactors.push(
      "Account history is relatively short.",
    );
  }

  if (balanceIncomeRatio >= 0.5) {
    positiveFactors.push(
      "Average account balance provides a comparatively strong liquidity buffer.",
    );
  } else if (balanceIncomeRatio < 0.25) {
    riskFactors.push(
      "Average account balance is low relative to monthly income.",
    );
  } else if (balanceIncomeRatio < 0.5) {
    riskFactors.push(
      "Average account balance is below half of monthly income.",
    );
  }

  const calculationDetails = [
    {
      component: "Income / Employment Stability",
      factor: "Employment duration",
      value: `${employmentMonths} months`,
      points: employmentPoints,
      maxPoints: 12,
    },
    {
      component: "Income / Employment Stability",
      factor: "Income regularity",
      value: incomeRegularity,
      points: regularityPoints,
      maxPoints: 8,
    },
    {
      component: "Debt Capacity",
      factor: "Existing debt-to-income ratio",
      value: `${round(debtToIncomeRatio * 100, 1)}%`,
      points: debtRatioPoints,
      maxPoints: 12,
    },
    {
      component: "Debt Capacity",
      factor: "Requested credit relative to monthly income",
      value: `${round(requestedAmountRatio, 2)}x monthly income`,
      points: requestedAmountPoints,
      maxPoints: 8,
    },
    {
      component: "Payment Behaviour",
      factor: "Utility payment rate",
      value: `${round(utilityPaymentRate, 1)}%`,
      points: utilityPoints,
      maxPoints: 12,
    },
    {
      component: "Payment Behaviour",
      factor: "Missed payments in last 12 months",
      value: missedPayments,
      points: missedPaymentPoints,
      maxPoints: 8,
    },
    {
      component: "Cash Flow Stability",
      factor: "Monthly cash-flow surplus",
      value: `${round(cashSurplusRatio * 100, 1)}%`,
      points: cashSurplusPoints,
      maxPoints: 10,
    },
    {
      component: "Cash Flow Stability",
      factor: "Average balance coverage of monthly debits",
      value: `${round(balanceCoverageRatio, 2)}x`,
      points: balanceCoveragePoints,
      maxPoints: 10,
    },
    {
      component: "Account Stability",
      factor: "Account age",
      value: `${accountAgeMonths} months`,
      points: accountAgePoints,
      maxPoints: 12,
    },
    {
      component: "Account Stability",
      factor: "Average balance relative to income",
      value: `${round(balanceIncomeRatio, 2)}x monthly income`,
      points: balanceIncomePoints,
      maxPoints: 8,
    },
  ];

  return {
    totalScore,
    riskLevel,
    components: {
      incomeStability,
      debtCapacity,
      paymentBehaviour,
      cashFlowStability,
      accountStability,
    },
    positiveFactors,
    riskFactors,
    calculationDetails,
    metrics: {
      debtToIncomeRatio: round(debtToIncomeRatio, 4),
      requestedAmountRatio: round(requestedAmountRatio, 4),
      netCashFlow: round(netCashFlow, 2),
      cashSurplusRatio: round(cashSurplusRatio, 4),
      balanceCoverageRatio: round(balanceCoverageRatio, 4),
      balanceIncomeRatio: round(balanceIncomeRatio, 4),
    },
  };
}