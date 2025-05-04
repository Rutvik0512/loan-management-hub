
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanApplicationsList } from "@/components/loans/LoansList";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/AuthContext';
import { LoanApplication } from '@/types';

const ProcessLoans: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchApprovedLoans = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Example: const response = await supabase.from('loan_applications').select('*').eq('status', 'MANAGER_APPROVED');
        
        // For now, let's mock the data
        setTimeout(() => {
          const mockApplications: LoanApplication[] = [
            {
              id: '1',
              loanId: 'loan1',
              userId: 'user1',
              userName: 'John Doe',
              employeeId: 'EMP001',
              loanName: 'Personal Loan',
              appliedAmount: 50000,
              appliedTenure: 12,
              emi: 4500,
              status: 'MANAGER_APPROVED',
              managerComment: 'Employee meets all criteria',
              appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              approvedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              loanId: 'loan2',
              userId: 'user2',
              userName: 'Jane Smith',
              employeeId: 'EMP002',
              loanName: 'Home Improvement Loan',
              appliedAmount: 200000,
              appliedTenure: 36,
              emi: 6500,
              status: 'MANAGER_APPROVED',
              managerComment: 'Approved based on employee performance',
              appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              approvedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load approved loans",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (user && user.role === 'FINANCE') {
      fetchApprovedLoans();
    }
  }, [user, toast]);

  const handleProcess = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsProcessDialogOpen(true);
    }
  };

  const handleReject = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsRejectDialogOpen(true);
    }
  };

  const confirmProcess = async () => {
    if (!selectedApplication) return;
    
    try {
      // In a real application, this would be an API call
      // Example: await supabase.from('loan_applications').update({ status: 'ACTIVE', financeComment: comment }).eq('id', selectedApplication.id);
      
      // Update the local state
      setApplications(prev => 
        prev.filter(app => app.id !== selectedApplication.id)
      );
      
      toast({
        title: "Loan Processed",
        description: `The loan for ${selectedApplication.userName} has been processed successfully.`,
      });
      
      setIsProcessDialogOpen(false);
      setSelectedApplication(null);
      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the loan",
        variant: "destructive",
      });
    }
  };

  const confirmReject = async () => {
    if (!selectedApplication) return;
    
    try {
      // In a real application, this would be an API call
      // Example: await supabase.from('loan_applications').update({ status: 'FINANCE_REJECTED', financeComment: comment }).eq('id', selectedApplication.id);
      
      // Update the local state
      setApplications(prev => 
        prev.filter(app => app.id !== selectedApplication.id)
      );
      
      toast({
        title: "Loan Rejected",
        description: `The loan for ${selectedApplication.userName} has been rejected.`,
      });
      
      setIsRejectDialogOpen(false);
      setSelectedApplication(null);
      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the loan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Process Loans</h1>
          <p className="text-muted-foreground">Process manager-approved loans</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p>Loading approved loans...</p>
              </div>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No loans to process at the moment</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loans to Process</CardTitle>
                <CardDescription>
                  Review and process manager-approved loans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoanApplicationsList 
                  applications={applications} 
                  onProcess={handleProcess}
                  onReject={handleReject}
                  showFinanceActions={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Loan</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>You are processing {selectedApplication.userName}'s loan for ₹{selectedApplication.appliedAmount.toLocaleString()}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Processing Notes (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Add any processing details or notes"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmProcess}>
              Confirm Processing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>You are rejecting {selectedApplication.userName}'s loan for ₹{selectedApplication.appliedAmount.toLocaleString()}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="reject-comment" className="block text-sm font-medium mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reject-comment"
              placeholder="Please provide a reason for rejection"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!comment.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessLoans;
