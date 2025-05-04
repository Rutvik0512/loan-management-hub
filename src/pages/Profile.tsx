
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';

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
              <CardTitle>Loan Summary</CardTitle>
              <CardDescription>Overview of your active and past loans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>EMI</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>LOAN001</TableCell>
                    <TableCell>Personal Loan</TableCell>
                    <TableCell>₹50,000</TableCell>
                    <TableCell>₹4,500</TableCell>
                    <TableCell>12 months</TableCell>
                    <TableCell>01 Jan 2024</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>LOAN002</TableCell>
                    <TableCell>Education Loan</TableCell>
                    <TableCell>₹100,000</TableCell>
                    <TableCell>₹4,600</TableCell>
                    <TableCell>24 months</TableCell>
                    <TableCell>15 Mar 2023</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Completed
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
