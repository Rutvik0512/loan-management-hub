
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loan, LoanApplication } from '@/types';

interface LoanCardProps {
  loan: Loan;
  onApply?: (loan: Loan) => void;
  showApplyButton?: boolean;
}

interface LoanApplicationCardProps {
  application: LoanApplication;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onProcess?: (id: string) => void;
  showManagerActions?: boolean;
  showFinanceActions?: boolean;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onApply, showApplyButton = true }) => {
  return (
    <Card className="loan-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{loan.name}</CardTitle>
          <Badge variant={loan.isActive ? "default" : "outline"}>
            {loan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>{loan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Max Amount</span>
          <span className="font-medium">₹{loan.maxAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Interest Rate</span>
          <span className="font-medium">{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Max Tenure</span>
          <span className="font-medium">{loan.maxTenureMonths} months</span>
        </div>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Eligibility</p>
          <p className="text-sm">{loan.eligibilityCriteria}</p>
        </div>
      </CardContent>
      {showApplyButton && loan.isActive && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => onApply && onApply(loan)}
          >
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export const LoanApplicationCard: React.FC<LoanApplicationCardProps> = ({ 
  application, 
  onApprove, 
  onReject, 
  onProcess, 
  showManagerActions = false,
  showFinanceActions = false
}) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="status-badge status-pending">Pending</Badge>;
      case 'MANAGER_APPROVED':
        return <Badge variant="outline" className="status-badge status-approved">Manager Approved</Badge>;
      case 'MANAGER_REJECTED':
        return <Badge variant="outline" className="status-badge status-rejected">Manager Rejected</Badge>;
      case 'FINANCE_APPROVED':
        return <Badge variant="outline" className="status-badge status-approved">Finance Approved</Badge>;
      case 'FINANCE_REJECTED':
        return <Badge variant="outline" className="status-badge status-rejected">Finance Rejected</Badge>;
      case 'ACTIVE':
        return <Badge variant="outline" className="status-badge status-completed">Active</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="status-badge status-completed">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="loan-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{application.loanName}</CardTitle>
          {getStatusBadge(application.status)}
        </div>
        <CardDescription>Applied on {new Date(application.appliedDate).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Applied Amount</span>
          <span className="font-medium">₹{application.appliedAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Tenure</span>
          <span className="font-medium">{application.appliedTenure} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">EMI</span>
          <span className="font-medium">₹{application.emi.toLocaleString()}/month</span>
        </div>
        {application.managerComment && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Manager Comment</p>
            <p className="text-sm">{application.managerComment}</p>
          </div>
        )}
        {application.financeComment && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Finance Comment</p>
            <p className="text-sm">{application.financeComment}</p>
          </div>
        )}
      </CardContent>
      
      {showManagerActions && application.status === 'PENDING' && (
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onReject && onReject(application.id)}
          >
            Reject
          </Button>
          <Button 
            className="flex-1" 
            onClick={() => onApprove && onApprove(application.id)}
          >
            Approve
          </Button>
        </CardFooter>
      )}
      
      {showFinanceActions && application.status === 'MANAGER_APPROVED' && (
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onReject && onReject(application.id)}
          >
            Reject
          </Button>
          <Button 
            className="flex-1" 
            onClick={() => onProcess && onProcess(application.id)}
          >
            Process
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
