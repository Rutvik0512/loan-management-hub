
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAuth } from '@/context/AuthContext';
import { Loan } from '@/types';

interface LoanApplicationFormProps {
  loan: Loan;
  onSubmitSuccess?: () => void;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ 
  loan,
  onSubmitSuccess 
}) => {
  const [amount, setAmount] = useState<number>(loan.maxAmount / 2);
  const [tenure, setTenure] = useState<number>(loan.maxTenureMonths / 2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculateEMI = (principal: number, ratePerMonth: number, months: number): number => {
    const r = ratePerMonth / 100;
    return Math.round(principal * r * (Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const monthlyInterest = loan.interestRate / 12;
  const emi = calculateEMI(amount, monthlyInterest, tenure);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Loan application submitted",
        description: "Your loan application has been submitted successfully",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/my-loans');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting your application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{loan.name} Application</CardTitle>
        <CardDescription>{loan.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="amount">Loan Amount (₹)</Label>
                <span className="text-sm font-medium">{amount.toLocaleString()}</span>
              </div>
              <Slider
                id="amount"
                min={10000}
                max={loan.maxAmount}
                step={1000}
                value={[amount]}
                onValueChange={(value) => setAmount(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹10,000</span>
                <span>₹{loan.maxAmount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="tenure">Loan Tenure (months)</Label>
                <span className="text-sm font-medium">{tenure}</span>
              </div>
              <Slider
                id="tenure"
                min={3}
                max={loan.maxTenureMonths}
                step={1}
                value={[tenure]}
                onValueChange={(value) => setTenure(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3 months</span>
                <span>{loan.maxTenureMonths} months</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Loan Summary</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Principal Amount</span>
                <span className="font-medium">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{loan.interestRate}% per annum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tenure</span>
                <span className="font-medium">{tenure} months</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-sm font-medium">Monthly EMI</span>
                <span className="font-bold">₹{emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="font-bold">₹{(emi * tenure).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoanApplicationForm;
