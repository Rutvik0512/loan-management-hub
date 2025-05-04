
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoansList } from "@/components/loans/LoansList";
import { useAuth } from '@/context/AuthContext';
import { Loan } from '@/types';

const ApplyLoan: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAvailableLoans = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Example: const response = await supabase.from('loans').select('*').eq('isActive', true);
        
        // For now, let's mock the data
        setTimeout(() => {
          const mockLoans: Loan[] = [
            {
              id: '1',
              name: 'Personal Loan',
              description: 'Quick personal loan for your immediate needs',
              maxAmount: 100000,
              interestRate: 12.5,
              maxTenureMonths: 24,
              eligibilityCriteria: 'Minimum 1 year of employment',
              isActive: true
            },
            {
              id: '2',
              name: 'Home Improvement Loan',
              description: 'Upgrade your home with our affordable loan',
              maxAmount: 500000,
              interestRate: 9.5,
              maxTenureMonths: 60,
              eligibilityCriteria: 'Minimum 2 years of employment and home ownership proof',
              isActive: true
            },
            {
              id: '3',
              name: 'Education Loan',
              description: 'Support your further education or your children\'s education',
              maxAmount: 300000,
              interestRate: 8.0,
              maxTenureMonths: 48,
              eligibilityCriteria: 'Minimum 3 years of employment',
              isActive: true
            },
            {
              id: '4',
              name: 'Vehicle Loan',
              description: 'Purchase your dream vehicle with our low-interest loan',
              maxAmount: 800000,
              interestRate: 10.5,
              maxTenureMonths: 72,
              eligibilityCriteria: 'Minimum 2 years of employment and good credit score',
              isActive: true
            },
          ];
          setLoans(mockLoans);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load available loans",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchAvailableLoans();
  }, [toast]);

  const handleApply = (loan: Loan) => {
    // In a real application, this would navigate to a form or dialog
    toast({
      title: "Application Started",
      description: `You are applying for ${loan.name}`,
    });
  };

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Apply for Loan</h1>
          <p className="text-muted-foreground">Explore available loan options and apply</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p>Loading available loans...</p>
              </div>
            </CardContent>
          </Card>
        ) : loans.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No loans are available at the moment</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Loans</CardTitle>
                <CardDescription>
                  Choose from our range of loan options designed for employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoansList loans={loans} onApply={handleApply} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyLoan;
