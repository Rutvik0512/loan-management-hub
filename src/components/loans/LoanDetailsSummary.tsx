
import React from 'react';
import { LoanApplication } from '@/types';

interface LoanDetailsSummaryProps {
  application: LoanApplication;
}

export const LoanDetailsSummary = ({ application }: LoanDetailsSummaryProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
      <div>
        <p className="text-sm text-muted-foreground">Loan Type</p>
        <p className="font-medium">{application.loanName}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Applied Amount</p>
        <p className="font-medium">₹{application.appliedAmount.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Tenure</p>
        <p className="font-medium">{application.appliedTenure} months</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">EMI</p>
        <p className="font-medium">₹{application.emi.toLocaleString()}</p>
      </div>
    </div>
  );
};
