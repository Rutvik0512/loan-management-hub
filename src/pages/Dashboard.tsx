
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoanApplicationsList } from '@/components/loans/LoansList';
import { LoanApplication, Loan } from '@/types';

// Mock data
const MOCK_LOANS: Loan[] = [
  {
    id: '1',
    name: 'Personal Loan',
    description: 'For personal expenses like vacations, home renovation, etc.',
    maxAmount: 500000,
    interestRate: 10.5,
    maxTenureMonths: 60,
    eligibilityCriteria: 'Minimum 1 year of employment',
    isActive: true,
  },
  {
    id: '2',
    name: 'Education Loan',
    description: 'For higher education expenses like tuition, books, etc.',
    maxAmount: 1000000,
    interestRate: 8.5,
    maxTenureMonths: 120,
    eligibilityCriteria: 'Minimum 2 years of employment',
    isActive: true,
  },
  {
    id: '3',
    name: 'Home Loan',
    description: 'For purchasing a house or apartment',
    maxAmount: 5000000,
    interestRate: 7.5,
    maxTenureMonths: 240,
    eligibilityCriteria: 'Minimum 3 years of employment and credit score above 700',
    isActive: true,
  }
];

const MOCK_APPLICATIONS: LoanApplication[] = [
  {
    id: '1',
    loanId: '1',
    userId: '1',
    userName: 'John Employee',
    employeeId: 'EMP001',
    loanName: 'Personal Loan',
    appliedAmount: 200000,
    appliedTenure: 36,
    emi: 6500,
    status: 'PENDING',
    appliedDate: '2023-04-15T10:30:00',
  },
  {
    id: '2',
    loanId: '2',
    userId: '1',
    userName: 'John Employee',
    employeeId: 'EMP001',
    loanName: 'Education Loan',
    appliedAmount: 500000,
    appliedTenure: 60,
    emi: 10200,
    status: 'MANAGER_APPROVED',
    managerComment: 'Employee has good credit history',
    appliedDate: '2023-03-10T14:20:00',
    approvedDate: '2023-03-15T09:45:00',
  },
  {
    id: '3',
    loanId: '1',
    userId: '1',
    userName: 'John Employee',
    employeeId: 'EMP001',
    loanName: 'Personal Loan',
    appliedAmount: 100000,
    appliedTenure: 24,
    emi: 4600,
    status: 'ACTIVE',
    appliedDate: '2023-01-05T11:15:00',
    approvedDate: '2023-01-10T16:30:00',
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentLoans, setRecentLoans] = useState<LoanApplication[]>([]);
  const [pendingApproval, setPendingApproval] = useState<LoanApplication[]>([]);
  const [pendingProcessing, setPendingProcessing] = useState<LoanApplication[]>([]);

  useEffect(() => {
    // In a real application, these would be API calls
    // Filter data based on user role
    if (user) {
      if (user.role === 'EMPLOYEE') {
        setRecentLoans(MOCK_APPLICATIONS.filter(app => app.userId === user.id));
      } else if (user.role === 'MANAGER') {
        setPendingApproval(MOCK_APPLICATIONS.filter(app => app.status === 'PENDING'));
      } else if (user.role === 'FINANCE') {
        setPendingProcessing(MOCK_APPLICATIONS.filter(app => app.status === 'MANAGER_APPROVED'));
      }
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Welcome, {user.name}</CardTitle>
            <CardDescription>
              {user.role} - {user.department}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Employee ID: {user.employeeId}
            </p>
            {user.salary && (
              <p className="text-sm text-muted-foreground mt-1">
                Salary: ₹{user.salary.toLocaleString()}/month
              </p>
            )}
          </CardContent>
        </Card>

        {user.role === 'EMPLOYEE' && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {recentLoans.filter(loan => loan.status === 'ACTIVE').length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total EMI: ₹{recentLoans
                    .filter(loan => loan.status === 'ACTIVE')
                    .reduce((sum, loan) => sum + loan.emi, 0)
                    .toLocaleString()}/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {recentLoans.filter(loan => 
                    loan.status === 'PENDING' || 
                    loan.status === 'MANAGER_APPROVED'
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {recentLoans.filter(loan => loan.status === 'PENDING').length} awaiting manager approval
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'MANAGER' && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {pendingApproval.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Awaiting your review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approved This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {/* In a real app, this would filter by current month */}
                  2
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total amount: ₹500,000
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'FINANCE' && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {pendingProcessing.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Awaiting disbursement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {/* In a real app, this would be a count of all active loans */}
                  5
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly collection: ₹35,000
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {/* In a real app, this would be the actual count */}
                  42
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Across 5 departments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {/* In a real app, this would be the actual count */}
                  15
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total amount: ₹3,500,000
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {user.role === 'EMPLOYEE' && recentLoans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Recent Loans</h2>
          <LoanApplicationsList applications={recentLoans} />
        </div>
      )}

      {user.role === 'MANAGER' && pendingApproval.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Approval Requests</h2>
          <LoanApplicationsList 
            applications={pendingApproval} 
            showManagerActions={true}
            onApprove={(id) => console.log('Approve', id)}
            onReject={(id) => console.log('Reject', id)}
          />
        </div>
      )}

      {user.role === 'FINANCE' && pendingProcessing.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Loan Disbursements</h2>
          <LoanApplicationsList 
            applications={pendingProcessing} 
            showFinanceActions={true}
            onProcess={(id) => console.log('Process', id)}
            onReject={(id) => console.log('Reject', id)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
