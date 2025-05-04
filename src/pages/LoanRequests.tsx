
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

const LoanRequests: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLoanRequests = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Example: const response = await supabase.from('loan_applications').select('*').eq('status', 'PENDING');
        
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
              status: 'PENDING',
              appliedDate: new Date().toISOString(),
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
              status: 'PENDING',
              appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '3',
              loanId: 'loan3',
              userId: 'user3',
              userName: 'Michael Johnson',
              employeeId: 'EMP003',
              loanName: 'Education Loan',
              appliedAmount: 100000,
              appliedTenure: 24,
              emi: 4600,
              status: 'PENDING',
              appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ];
          setApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load loan requests",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (user && user.role === 'MANAGER') {
      fetchLoanRequests();
    }
  }, [user, toast]);

  const handleApprove = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsApproveDialogOpen(true);
    }
  };

  const handleReject = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsRejectDialogOpen(true);
    }
  };

  const confirmApprove = async () => {
    if (!selectedApplication) return;
    
    try {
      // In a real application, this would be an API call
      // Example: await supabase.from('loan_applications').update({ status: 'MANAGER_APPROVED', managerComment: comment }).eq('id', selectedApplication.id);
      
      // Update the local state
      setApplications(prev => 
        prev.filter(app => app.id !== selectedApplication.id)
      );
      
      toast({
        title: "Request Approved",
        description: `Loan request for ${selectedApplication.userName} has been approved.`,
      });
      
      setIsApproveDialogOpen(false);
      setSelectedApplication(null);
      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the loan request",
        variant: "destructive",
      });
    }
  };

  const confirmReject = async () => {
    if (!selectedApplication) return;
    
    try {
      // In a real application, this would be an API call
      // Example: await supabase.from('loan_applications').update({ status: 'MANAGER_REJECTED', managerComment: comment }).eq('id', selectedApplication.id);
      
      // Update the local state
      setApplications(prev => 
        prev.filter(app => app.id !== selectedApplication.id)
      );
      
      toast({
        title: "Request Rejected",
        description: `Loan request for ${selectedApplication.userName} has been rejected.`,
      });
      
      setIsRejectDialogOpen(false);
      setSelectedApplication(null);
      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the loan request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loan Requests</h1>
          <p className="text-muted-foreground">Manage pending loan requests from employees</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p>Loading loan requests...</p>
              </div>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No pending loan requests at the moment</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Review and approve or reject loan applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoanApplicationsList 
                  applications={applications} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showManagerActions={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Loan Request</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>You are approving {selectedApplication.userName}'s loan request for ₹{selectedApplication.appliedAmount.toLocaleString()}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Comment (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Add a comment about this approval"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Request</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>You are rejecting {selectedApplication.userName}'s loan request for ₹{selectedApplication.appliedAmount.toLocaleString()}</>
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

export default LoanRequests;
