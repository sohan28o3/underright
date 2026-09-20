TRUNCATE TABLE chat_messages, assessments, applications
RESTART IDENTITY CASCADE;

INSERT INTO applications (
    application_reference,
    applicant_name,
    email,
    employment_type,
    employment_months,
    credit_purpose,
    monthly_income,
    requested_amount,
    existing_monthly_debt,
    average_monthly_balance,
    monthly_credits,
    monthly_debits,
    income_regularity,
    utility_payment_rate,
    missed_payments,
    account_age_months,
    created_at
)
VALUES
(
    'UR-DEMO-1001',
    'Asha Mehta',
    'asha.demo@example.com',
    'Salaried',
    72,
    'Home improvement',
    95000,
    85000,
    7000,
    90000,
    100000,
    50000,
    'High',
    99,
    0,
    84,
    NOW() - INTERVAL '10 days'
),
(
    'UR-DEMO-1002',
    'Rohan Sen',
    'rohan.demo@example.com',
    'Salaried',
    48,
    'Vehicle purchase',
    78000,
    120000,
    12000,
    52000,
    82000,
    56000,
    'High',
    96,
    0,
    50,
    NOW() - INTERVAL '9 days'
),
(
    'UR-DEMO-1003',
    'Mira Das',
    'mira.demo@example.com',
    'Salaried',
    30,
    'Personal credit',
    60000,
    120000,
    10000,
    28000,
    65000,
    42000,
    'High',
    96,
    1,
    30,
    NOW() - INTERVAL '8 days'
),
(
    'UR-DEMO-1004',
    'Karan Iyer',
    NULL,
    'Salaried',
    20,
    'Education',
    55000,
    150000,
    14000,
    18000,
    58000,
    49000,
    'Medium',
    88,
    1,
    22,
    NOW() - INTERVAL '7 days'
),
(
    'UR-DEMO-1005',
    'Neha Roy',
    NULL,
    'Contract',
    14,
    'Personal credit',
    48000,
    175000,
    17000,
    12000,
    50000,
    46000,
    'Medium',
    82,
    2,
    15,
    NOW() - INTERVAL '6 days'
),
(
    'UR-DEMO-1006',
    'Vikram Rao',
    NULL,
    'Self-employed',
    8,
    'Business expenses',
    42000,
    180000,
    19000,
    7000,
    43000,
    42000,
    'Low',
    74,
    3,
    9,
    NOW() - INTERVAL '5 days'
),
(
    'UR-DEMO-1007',
    'Tara Nair',
    'tara.demo@example.com',
    'Salaried',
    66,
    'Vehicle purchase',
    110000,
    100000,
    9000,
    85000,
    118000,
    65000,
    'High',
    98,
    0,
    70,
    NOW() - INTERVAL '4 days'
),
(
    'UR-DEMO-1008',
    'Arjun Pal',
    NULL,
    'Salaried',
    40,
    'Home improvement',
    70000,
    140000,
    15000,
    26000,
    73000,
    57000,
    'Medium',
    92,
    1,
    38,
    NOW() - INTERVAL '3 days'
),
(
    'UR-DEMO-1009',
    'Isha Kapoor',
    NULL,
    'Contract',
    26,
    'Education',
    62000,
    170000,
    18000,
    20000,
    64000,
    54000,
    'Medium',
    86,
    2,
    28,
    NOW() - INTERVAL '2 days'
),
(
    'UR-DEMO-1010',
    'Dev Bose',
    NULL,
    'Self-employed',
    5,
    'Business expenses',
    36000,
    190000,
    20000,
    3000,
    37000,
    39000,
    'Low',
    68,
    5,
    4,
    NOW() - INTERVAL '1 day'
);

INSERT INTO assessments (
    application_id,
    total_score,
    risk_level,
    income_stability_score,
    debt_capacity_score,
    payment_behaviour_score,
    cash_flow_score,
    account_stability_score,
    positive_factors,
    risk_factors,
    calculation_details
)
VALUES
(
    1,
    99,
    'Low Risk',
    20, 20, 20, 20, 19,
    '[
      "Long employment history",
      "Highly regular income",
      "Low existing debt burden",
      "Excellent payment consistency",
      "Strong positive monthly cash flow",
      "Long-standing account relationship"
    ]',
    '[]',
    '[]'
),
(
    2,
    88,
    'Low Risk',
    18, 14, 20, 19, 17,
    '[
      "Stable employment history",
      "Highly regular income",
      "Excellent utility payment history",
      "No missed payments",
      "Healthy positive cash flow"
    ]',
    '[
      "Requested amount is material relative to monthly income"
    ]',
    '[]'
),
(
    3,
    79,
    'Moderate-Low Risk',
    17, 14, 17, 17, 14,
    '[
      "Stable employment history",
      "Highly regular income",
      "Strong utility payment consistency",
      "Healthy positive monthly cash flow",
      "Established account history"
    ]',
    '[
      "One missed payment was recorded in the last 12 months",
      "Requested amount is material relative to monthly income",
      "Average balance is below half of monthly income"
    ]',
    '[]'
),
(
    4,
    57,
    'Moderate Risk',
    12, 10, 13, 11, 11,
    '[
      "Employment history exceeds one year",
      "Monthly cash flow remains positive"
    ]',
    '[
      "Existing debt burden is moderately elevated",
      "Requested amount is high relative to monthly income",
      "Payment consistency has room for improvement"
    ]',
    '[]'
),
(
    5,
    49,
    'High Risk',
    12, 6, 11, 9, 11,
    '[
      "Monthly income remains moderately regular"
    ]',
    '[
      "Existing debt burden is elevated",
      "Requested amount is high relative to income",
      "Two missed payments were recorded",
      "Monthly cash-flow surplus is limited"
    ]',
    '[]'
),
(
    6,
    27,
    'Very High Risk',
    6, 3, 6, 6, 6,
    '[
      "Monthly credits currently exceed monthly debits"
    ]',
    '[
      "Short employment history",
      "Low income regularity",
      "Existing debt burden is high",
      "Several missed payments were recorded",
      "Account history is relatively short"
    ]',
    '[]'
),
(
    7,
    99,
    'Low Risk',
    20, 20, 20, 20, 19,
    '[
      "Long employment history",
      "Highly regular income",
      "Low debt burden",
      "Excellent payment history",
      "Strong cash-flow surplus"
    ]',
    '[]',
    '[]'
),
(
    8,
    71,
    'Moderate-Low Risk',
    15, 12, 15, 13, 16,
    '[
      "Established employment history",
      "Good utility payment consistency",
      "Established account history"
    ]',
    '[
      "Existing obligations reduce available repayment capacity",
      "One missed payment was recorded",
      "Requested amount is material relative to income"
    ]',
    '[]'
),
(
    9,
    60,
    'Moderate Risk',
    14, 10, 11, 11, 14,
    '[
      "Employment history exceeds two years",
      "Monthly cash flow remains positive"
    ]',
    '[
      "Existing debt burden is moderately elevated",
      "Two missed payments were recorded",
      "Requested amount is relatively high"
    ]',
    '[]'
),
(
    10,
    12,
    'Very High Risk',
    4, 0, 2, 2, 4,
    '[]',
    '[
      "Employment history is very short",
      "Income regularity is low",
      "Existing debt exceeds half of monthly income",
      "Requested amount is very high relative to income",
      "Monthly debits exceed monthly credits",
      "Multiple missed payments were recorded"
    ]',
    '[]'
);