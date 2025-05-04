
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { dbLoanApplicationToAppLoanApplication, dbLoanToAppLoan, dbUserToAppUser } from '@/integrations/supabase/helpers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LoanApplication, Loan, User } from '@/types';
import { LoanWorkflowStatus } from './LoanWorkflowStatus';
import { useToast } from '@/components/ui/use-toast';

interface UserLoansProps {
  userId: string;
}

export const UserLoans = ({ userId }: UserLoansProps) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['userLoanApplications', userId],
    queryFn: async () => {
      try {
        // Fetch all loan applications for the user
        const { data: applicationData, error: applicationError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', userId);

        if (applicationError) throw applicationError;
        if (!applicationData) return [];

        // Get all unique loan IDs from applications
        const loanIds = [...new Set(applicationData.map(app => app.loan_id))];
        
        // Fetch all relevant loans in one query
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('*')
          .in('id', loanIds);
          
        if (loansError) throw loansError;
        
        // Create a map of loan id to loan name for quick lookup
        const loanMap = new Map();
        loansData?.forEach(loan => {
          loanMap.set(loan.id, dbLoanToAppLoan(loan));
        });
        
        // Fetch the user data for names
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;

        // Convert DB entities to app types
        const userInfo = userData ? dbUserToAppUser(userData) : null;
        
        return applicationData.map(app => {
          const loan = loanMap.get(app.loan_id);
          return dbLoanApplicationToAppLoanApplication(
            app, 
            userInfo?.name || '', 
            userInfo?.employeeId || '',
            loan?.name || ''
          );
        });
      } catch (error) {
        console.error('Error fetching loan applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load loan applications',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Failed to load loan applications</p>
        </CardContent>
      </Card>
    );
  }

  if (!applications?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No loan applications found</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: LoanApplication['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'MANAGER_APPROVED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Manager Approved</Badge>;
      case 'MANAGER_REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Manager Rejected</Badge>;
      case 'FINANCE_APPROVED':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Finance Approved</Badge>;
      case 'FINANCE_REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Finance Rejected</Badge>;
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Completed</Badge>;
    }
  };

  const handleViewWorkflow = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsWorkflowOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{application.loanName}</CardTitle>
                  <CardDescription>Application ID: {application.id.substring(0, 8)}</CardDescription>
                </div>
                {getStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Applied Amount</p>
                  <p className="font-medium">₹{application.appliedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EMI</p>
                  <p className="font-medium">₹{application.emi.toLocaleString()}/month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenure</p>
                  <p className="font-medium">{application.appliedTenure} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium">{new Date(application.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => handleViewWorkflow(application)}
                className="w-full"
              >
                View Workflow Status
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Application Workflow</DialogTitle>
            <DialogDescription>
              {selectedApplication?.loanName} - ₹{selectedApplication?.appliedAmount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <LoanWorkflowStatus application={selectedApplication} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
