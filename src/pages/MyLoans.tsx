
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanApplicationsList } from "@/components/loans/LoansList";
import { useAuth } from '@/context/AuthContext';
import { LoanApplication } from '@/types';

const MyLoans: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMyLoans = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Example: const response = await supabase.from('loan_applications').select('*').eq('userId', user.id);
        
        // For now, let's mock the data
        setTimeout(() => {
          const mockApplications: LoanApplication[] = [
            {
              id: '1',
              loanId: 'loan1',
              userId: user?.id || '',
              userName: user?.name || '',
              employeeId: user?.employeeId || '',
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
              userId: user?.id || '',
              userName: user?.name || '',
              employeeId: user?.employeeId || '',
              loanName: 'Home Improvement Loan',
              appliedAmount: 200000,
              appliedTenure: 36,
              emi: 6500,
              status: 'MANAGER_APPROVED',
              managerComment: 'Approved based on eligibility',
              appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              approvedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '3',
              loanId: 'loan3',
              userId: user?.id || '',
              userName: user?.name || '',
              employeeId: user?.employeeId || '',
              loanName: 'Education Loan',
              appliedAmount: 100000,
              appliedTenure: 24,
              emi: 4600,
              status: 'ACTIVE',
              managerComment: 'Approved',
              financeComment: 'Processed',
              appliedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              approvedDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ];
          setApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load loan applications",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMyLoans();
    }
  }, [user, toast]);

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Loans</h1>
          <p className="text-muted-foreground">View and manage your loan applications</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p>Loading your loans...</p>
              </div>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground mb-4">You haven't applied for any loans yet</p>
                <a href="/apply-loan" className="text-primary hover:underline">
                  Apply for a new loan
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Loan Applications</CardTitle>
                <CardDescription>
                  Track the status of your loan applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoanApplicationsList applications={applications} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoans;
