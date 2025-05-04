
import { Database } from './types';
import type { User, Loan, LoanApplication, BankDetails } from '@/types';

// Helper functions to convert database types to application types

/**
 * Convert a database user to an application user
 */
export const dbUserToAppUser = (dbUser: Database['public']['Tables']['users']['Row']): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as User['role'],
    department: dbUser.department,
    employeeId: dbUser.employee_id,
    salary: dbUser.salary || undefined,
  };
};

/**
 * Convert a database loan to an application loan
 */
export const dbLoanToAppLoan = (dbLoan: Database['public']['Tables']['loans']['Row']): Loan => {
  return {
    id: dbLoan.id,
    name: dbLoan.name,
    description: dbLoan.description || '',
    maxAmount: Number(dbLoan.max_amount),
    interestRate: Number(dbLoan.interest_rate),
    maxTenureMonths: dbLoan.max_tenure_months,
    eligibilityCriteria: dbLoan.eligibility_criteria || '',
    isActive: dbLoan.is_active || false,
  };
};

/**
 * Convert a database loan application to an application loan application
 */
export const dbLoanApplicationToAppLoanApplication = (
  dbLoanApp: Database['public']['Tables']['loan_applications']['Row'],
  userName: string = '',
  employeeId: string = '',
  loanName: string = ''
): LoanApplication => {
  return {
    id: dbLoanApp.id,
    loanId: dbLoanApp.loan_id,
    userId: dbLoanApp.user_id,
    userName, // This needs to be populated from a join or separate query
    employeeId, // This needs to be populated from a join or separate query
    loanName, // This needs to be populated from a join or separate query
    appliedAmount: Number(dbLoanApp.applied_amount),
    appliedTenure: dbLoanApp.applied_tenure,
    emi: Number(dbLoanApp.emi),
    status: dbLoanApp.status as LoanApplication['status'],
    managerComment: dbLoanApp.manager_comment || undefined,
    financeComment: dbLoanApp.finance_comment || undefined,
    appliedDate: dbLoanApp.applied_date || new Date().toISOString(),
    approvedDate: dbLoanApp.approved_date || undefined,
    rejectedDate: dbLoanApp.rejected_date || undefined,
    completionDate: dbLoanApp.completion_date || undefined,
  };
};

/**
 * Convert a database bank details to an application bank details
 */
export const dbBankDetailsToAppBankDetails = (
  dbBankDetails: Database['public']['Tables']['bank_details']['Row']
): BankDetails => {
  return {
    accountNumber: dbBankDetails.account_number,
    bankName: dbBankDetails.bank_name,
    ifscCode: dbBankDetails.ifsc_code,
  };
};
