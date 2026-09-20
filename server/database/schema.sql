DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    application_reference VARCHAR(40) NOT NULL UNIQUE,
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    employment_type VARCHAR(80) NOT NULL,
    employment_months INTEGER NOT NULL CHECK (employment_months >= 0),
    credit_purpose VARCHAR(150) NOT NULL,

    monthly_income NUMERIC(14, 2) NOT NULL CHECK (monthly_income > 0),
    requested_amount NUMERIC(14, 2) NOT NULL CHECK (requested_amount > 0),
    existing_monthly_debt NUMERIC(14, 2) NOT NULL CHECK (existing_monthly_debt >= 0),
    average_monthly_balance NUMERIC(14, 2) NOT NULL CHECK (average_monthly_balance >= 0),

    monthly_credits NUMERIC(14, 2) NOT NULL CHECK (monthly_credits >= 0),
    monthly_debits NUMERIC(14, 2) NOT NULL CHECK (monthly_debits >= 0),

    income_regularity VARCHAR(20) NOT NULL
        CHECK (income_regularity IN ('High', 'Medium', 'Low')),

    utility_payment_rate NUMERIC(5, 2) NOT NULL
        CHECK (utility_payment_rate >= 0 AND utility_payment_rate <= 100),

    missed_payments INTEGER NOT NULL CHECK (missed_payments >= 0),
    account_age_months INTEGER NOT NULL CHECK (account_age_months >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE
        REFERENCES applications(id) ON DELETE CASCADE,

    total_score INTEGER NOT NULL
        CHECK (total_score >= 0 AND total_score <= 100),

    risk_level VARCHAR(40) NOT NULL,

    income_stability_score INTEGER NOT NULL
        CHECK (income_stability_score BETWEEN 0 AND 20),

    debt_capacity_score INTEGER NOT NULL
        CHECK (debt_capacity_score BETWEEN 0 AND 20),

    payment_behaviour_score INTEGER NOT NULL
        CHECK (payment_behaviour_score BETWEEN 0 AND 20),

    cash_flow_score INTEGER NOT NULL
        CHECK (cash_flow_score BETWEEN 0 AND 20),

    account_stability_score INTEGER NOT NULL
        CHECK (account_stability_score BETWEEN 0 AND 20),

    positive_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    calculation_details JSONB NOT NULL DEFAULT '[]'::jsonb,

    ai_explanation TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,

    application_id BIGINT NOT NULL
        REFERENCES applications(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('user', 'assistant')),

    message TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_created_at
ON applications(created_at DESC);

CREATE INDEX idx_applications_reference
ON applications(application_reference);

CREATE INDEX idx_applications_name
ON applications(applicant_name);

CREATE INDEX idx_assessments_risk
ON assessments(risk_level);

CREATE INDEX idx_assessments_score
ON assessments(total_score);

CREATE INDEX idx_chat_application
ON chat_messages(application_id, created_at);