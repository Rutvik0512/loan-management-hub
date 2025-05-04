
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { UserLoans } from '@/components/loans/UserLoans';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 pl-64">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View your personal information and loan history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{user?.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{user?.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge>{user?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Your saved bank account information</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.bankDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{user.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium">
                      {user.bankDetails.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IFSC Code</p>
                    <p className="font-medium">{user.bankDetails.ifscCode}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No bank details saved yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>My Loan Applications</CardTitle>
              <CardDescription>Track your loan application status</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <UserLoans userId={user.id} />
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Please login to view your loan applications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
