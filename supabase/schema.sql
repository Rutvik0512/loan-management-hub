
-- Create necessary tables for the loan management system

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN')),
  department VARCHAR(100) NOT NULL,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  salary DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bank details table (linked to users)
CREATE TABLE bank_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_number VARCHAR(100) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  ifsc_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id)
);

-- Loans table (available loan types)
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_amount DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  max_tenure_months INTEGER NOT NULL,
  eligibility_criteria TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan applications table
CREATE TABLE loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id),
  user_id UUID NOT NULL REFERENCES users(id),
  applied_amount DECIMAL(12, 2) NOT NULL,
  applied_tenure INTEGER NOT NULL,
  emi DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'PENDING',
    'MANAGER_APPROVED',
    'MANAGER_REJECTED',
    'FINANCE_APPROVED',
    'FINANCE_REJECTED',
    'ACTIVE',
    'COMPLETED'
  )),
  manager_comment TEXT,
  finance_comment TEXT,
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_date TIMESTAMP WITH TIME ZONE,
  rejected_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan repayments table
CREATE TABLE loan_repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_application_id UUID NOT NULL REFERENCES loan_applications(id),
  amount DECIMAL(12, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_repayments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Bank details policies
CREATE POLICY "Users can view their own bank details" ON bank_details
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage their own bank details" ON bank_details
  FOR ALL USING (auth.uid() = user_id);

-- Loans policies
CREATE POLICY "Everyone can view active loans" ON loans
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage all loans" ON loans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Loan applications policies
CREATE POLICY "Users can view their own loan applications" ON loan_applications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create loan applications" ON loan_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Managers can view and update pending applications" ON loan_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'MANAGER'
    ) AND status = 'PENDING'
  );
  
CREATE POLICY "Finance can view and update manager-approved applications" ON loan_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'FINANCE'
    ) AND status = 'MANAGER_APPROVED'
  );

-- Loan repayments policies
CREATE POLICY "Users can view their own loan repayments" ON loan_repayments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM loan_applications 
      WHERE loan_applications.id = loan_repayments.loan_application_id 
      AND loan_applications.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Finance can manage all loan repayments" ON loan_repayments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'FINANCE'
    )
  );

-- Create triggers for updating timestamps

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bank_details_modtime
BEFORE UPDATE ON bank_details
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_loans_modtime
BEFORE UPDATE ON loans
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_loan_applications_modtime
BEFORE UPDATE ON loan_applications
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_loan_repayments_modtime
BEFORE UPDATE ON loan_repayments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
