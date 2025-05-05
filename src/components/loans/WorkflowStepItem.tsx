
import React from 'react';
import { User, Clock, CheckCircle2, CreditCard, BanknoteIcon, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Step } from './utils/workflow-helpers';

// This component is used for the vertical timeline view
interface WorkflowStepItemProps {
  step: Step;
  index: number;
}

export const WorkflowStepItem = ({ step, index }: WorkflowStepItemProps) => {
  const getStepIcon = () => {
    switch (step.status) {
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

  const getStepIconByName = (name: string) => {
    switch (name) {
      case 'Application Submitted':
        return <CreditCard className="h-5 w-5 text-white" />;
      case 'Manager Approval':
        return <User className="h-5 w-5 text-white" />;
      case 'Finance Approval':
        return <User className="h-5 w-5 text-white" />;
      case 'Loan Disbursed':
        return <BanknoteIcon className="h-5 w-5 text-white" />;
      case 'Loan Completed':
        return <CheckCircle2 className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="relative flex mb-8">
      {/* Status circle */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 
        ${step.status === 'completed' ? 'bg-green-100' : 
          step.status === 'current' ? 'bg-blue-100' :
          step.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full
          ${step.status === 'completed' ? 'bg-green-500' : 
            step.status === 'current' ? 'bg-blue-500' :
            step.status === 'rejected' ? 'bg-red-500' : 'bg-gray-200'}`}>
          {getStepIconByName(step.name)}
        </div>
      </div>
      
      {/* Step details */}
      <div className="ml-6 flex-1">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{step.name}</h4>
            <div>
              {step.status === 'completed' && (
                <Badge variant="outline" className="bg-green-50 text-green-600">Completed</Badge>
              )}
              {step.status === 'current' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600">In Progress</Badge>
              )}
              {step.status === 'rejected' && (
                <Badge variant="outline" className="bg-red-50 text-red-600">Rejected</Badge>
              )}
              {step.status === 'upcoming' && (
                <Badge variant="outline" className="bg-gray-50 text-gray-600">Pending</Badge>
              )}
            </div>
          </div>
          
          {step.date && (
            <p className="text-sm text-muted-foreground mt-1">{step.date}</p>
          )}
          
          {step.user && (
            <div className="flex items-center gap-1 mt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{step.user}</p>
            </div>
          )}
          
          {step.comment && (
            <div className="mt-2 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
              <p className="text-sm italic">{step.comment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
