
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loan } from '@/types';

const ManageLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Example: const response = await supabase.from('loans').select('*');
        
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
              isActive: false
            },
            {
              id: '5',
              name: 'Wedding Loan',
              description: 'Plan your dream wedding with our special loan',
              maxAmount: 400000,
              interestRate: 11.0,
              maxTenureMonths: 36,
              eligibilityCriteria: 'Minimum 2 years of employment',
              isActive: false
            },
          ];
          setLoans(mockLoans);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load loans",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [toast]);

  const toggleLoanStatus = (id: string) => {
    setLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, isActive: !loan.isActive } : loan
    ));
    
    toast({
      title: "Loan Status Updated",
      description: "The loan status has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Loans</h1>
            <p className="text-muted-foreground">Create and manage available loan options</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Loan
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <p>Loading loans...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>
                Manage your loan offerings and their availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Max Amount</TableHead>
                    <TableHead className="text-right">Interest Rate</TableHead>
                    <TableHead className="text-right">Max Tenure</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{loan.description}</TableCell>
                      <TableCell className="text-right">₹{loan.maxAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{loan.interestRate}%</TableCell>
                      <TableCell className="text-right">{loan.maxTenureMonths} months</TableCell>
                      <TableCell>
                        <Badge variant={loan.isActive ? "default" : "outline"}>
                          {loan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Switch 
                            checked={loan.isActive} 
                            onCheckedChange={() => toggleLoanStatus(loan.id)}
                          />
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageLoans;
