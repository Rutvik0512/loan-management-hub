
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanApplicationsList } from "@/components/loans/LoansList";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { dbLoanApplicationToAppLoanApplication, dbLoanToAppLoan, dbUserToAppUser } from '@/integrations/supabase/helpers';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['userLoans', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error("User not authenticated");

        // Fetch all loan applications for the user
        const { data: applicationData, error: applicationError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id);

        if (applicationError) throw applicationError;
        if (!applicationData || applicationData.length === 0) return [];

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
        
        return applicationData.map(app => {
          const loan = loanMap.get(app.loan_id);
          return dbLoanApplicationToAppLoanApplication(
            app, 
            user.name || '', 
            user.employeeId || '',
            loan?.name || ''
          );
        });
      } catch (error) {
        console.error('Error fetching loan applications:', error);
        toast({
          title: "Error",
          description: "Failed to load loan applications",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!user?.id
  });

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Loans</h1>
            <p className="text-muted-foreground">View and manage your loan applications</p>
          </div>
          <Button onClick={() => navigate('/apply-loan')}>Apply for Loan</Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p className="text-red-500">Failed to load loan applications</p>
              </div>
            </CardContent>
          </Card>
        ) : applications && applications.length > 0 ? (
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
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground mb-4">You haven't applied for any loans yet</p>
                <Button variant="outline" onClick={() => navigate('/apply-loan')}>
                  Apply for a new loan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyLoans;
