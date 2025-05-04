
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User, BankDetails } from '@/types';

interface EmployeeFormProps {
  employee?: User;
  onSubmit: (employee: Partial<User>) => void;
  isSubmitting: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSubmit,
  isSubmitting 
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: employee?.name || '',
    email: employee?.email || '',
    role: employee?.role || 'EMPLOYEE',
    department: employee?.department || '',
    employeeId: employee?.employeeId || '',
    salary: employee?.salary || 0,
    bankDetails: employee?.bankDetails || {
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails as BankDetails,
        [name]: value
      }
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.employeeId || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{employee ? 'Update Employee' : 'Add New Employee'}</CardTitle>
        <CardDescription>
          {employee 
            ? 'Update employee information in the system'
            : 'Add a new employee to the system'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-semibold mb-2">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.bankDetails?.accountNumber || ''}
                  onChange={handleBankDetailsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={handleBankDetailsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.bankDetails?.ifscCode || ''}
                  onChange={handleBankDetailsChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmployeeForm;
