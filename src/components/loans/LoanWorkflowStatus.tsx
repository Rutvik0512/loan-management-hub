
import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { LoanApplication } from '@/types';
import { Badge } from "@/components/ui/badge";

interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected';
  date?: string;
  comment?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

export const LoanWorkflowStatus = ({ application }: { application: LoanApplication }) => {
  // Determine the steps based on the application status
  const steps: Step[] = [
    {
      name: 'Application Submitted',
      status: 'completed',
      date: formatDate(application.appliedDate),
    }
  ];

  // Manager approval step
  if (['MANAGER_APPROVED', 'FINANCE_APPROVED', 'FINANCE_REJECTED', 'ACTIVE', 'COMPLETED'].includes(application.status)) {
    steps.push({
      name: 'Manager Approval',
      status: 'completed',
      date: formatDate(application.approvedDate),
      comment: application.managerComment
    });
  } else if (application.status === 'MANAGER_REJECTED') {
    steps.push({
      name: 'Manager Approval',
      status: 'rejected',
      date: formatDate(application.rejectedDate),
      comment: application.managerComment
    });
  } else {
    steps.push({
      name: 'Manager Approval',
      status: application.status === 'PENDING' ? 'current' : 'upcoming'
    });
  }

  // Finance approval step
  if (['FINANCE_APPROVED', 'ACTIVE', 'COMPLETED'].includes(application.status)) {
    steps.push({
      name: 'Finance Approval',
      status: 'completed',
      date: formatDate(application.approvedDate),
      comment: application.financeComment
    });
  } else if (application.status === 'FINANCE_REJECTED') {
    steps.push({
      name: 'Finance Approval',
      status: 'rejected',
      date: formatDate(application.rejectedDate),
      comment: application.financeComment
    });
  } else {
    steps.push({
      name: 'Finance Approval',
      status: application.status === 'MANAGER_APPROVED' ? 'current' : 'upcoming'
    });
  }

  // Loan active step
  if (['ACTIVE', 'COMPLETED'].includes(application.status)) {
    steps.push({
      name: 'Loan Active',
      status: 'completed',
      date: formatDate(application.approvedDate)
    });
  } else {
    steps.push({
      name: 'Loan Active',
      status: application.status === 'FINANCE_APPROVED' ? 'current' : 'upcoming'
    });
  }

  // Loan completed step
  if (application.status === 'COMPLETED') {
    steps.push({
      name: 'Loan Completed',
      status: 'completed',
      date: formatDate(application.completionDate)
    });
  } else {
    steps.push({
      name: 'Loan Completed',
      status: application.status === 'ACTIVE' ? 'current' : 'upcoming'
    });
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Loan Status</h3>
        {getStatusBadge(application.status)}
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start">
              <div className="flex h-7 w-7 items-center justify-center rounded-full z-10 bg-white">
                {getStepIcon(step.status)}
              </div>
              <div className="ml-4 -mt-1">
                <h4 className="font-medium">{step.name}</h4>
                {step.date && (
                  <p className="text-sm text-muted-foreground">{step.date}</p>
                )}
                {step.comment && (
                  <p className="text-sm mt-1 italic">{step.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
