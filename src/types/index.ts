
export type Role = 'EMPLOYEE' | 'MANAGER' | 'FINANCE' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  employeeId: string;
  bankDetails?: BankDetails;
  salary?: number;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

export interface Loan {
  id: string;
  name: string;
  description: string;
  maxAmount: number;
  interestRate: number;
  maxTenureMonths: number;
  eligibilityCriteria: string;
  isActive: boolean;
}

export interface LoanApplication {
  id: string;
  loanId: string;
  userId: string;
  userName: string;
  employeeId: string;
  loanName: string;
  appliedAmount: number;
  appliedTenure: number;
  emi: number;
  status: 'PENDING' | 'MANAGER_APPROVED' | 'MANAGER_REJECTED' | 'FINANCE_APPROVED' | 'FINANCE_REJECTED' | 'ACTIVE' | 'COMPLETED';
  managerComment?: string;
  financeComment?: string;
  appliedDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  completionDate?: string;
  workflowSteps?: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  statusFrom: string | null;
  statusTo: string;
  comment?: string;
  changedBy?: string;
  changedByName?: string;
  changedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
