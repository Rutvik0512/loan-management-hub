
import React, { useState } from 'react';
import { Loan, LoanApplication } from '@/types';
import { LoanCard, LoanApplicationCard } from './LoanCard';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoanApplicationForm from './LoanApplicationForm';

interface LoansListProps {
  loans: Loan[];
  onApply?: (loan: Loan) => void;
  showApplyButton?: boolean;
}

interface LoanApplicationsListProps {
  applications: LoanApplication[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onProcess?: (id: string) => void;
  showManagerActions?: boolean;
  showFinanceActions?: boolean;
}

export const LoansList: React.FC<LoansListProps> = ({ 
  loans, 
  onApply, 
  showApplyButton = true
}) => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApply = (loan: Loan) => {
    if (onApply) {
      onApply(loan);
    } else {
      setSelectedLoan(loan);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map((loan) => (
          <LoanCard
            key={loan.id}
            loan={loan}
            onApply={handleApply}
            showApplyButton={showApplyButton}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Apply for Loan</DialogTitle>
          <DialogDescription>
            Fill out the form below to apply for this loan.
          </DialogDescription>
          {selectedLoan && (
            <LoanApplicationForm 
              loan={selectedLoan} 
              onSubmitSuccess={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const LoanApplicationsList: React.FC<LoanApplicationsListProps> = ({ 
  applications, 
  onApprove,
  onReject,
  onProcess,
  showManagerActions = false,
  showFinanceActions = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {applications.map((application) => (
        <LoanApplicationCard
          key={application.id}
          application={application}
          onApprove={onApprove}
          onReject={onReject}
          onProcess={onProcess}
          showManagerActions={showManagerActions}
          showFinanceActions={showFinanceActions}
        />
      ))}
    </div>
  );
};
