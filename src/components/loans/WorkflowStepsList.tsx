
import React from 'react';
import { WorkflowStep } from '@/types';
import { Badge } from "@/components/ui/badge";
import { User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface WorkflowStepsListProps {
  steps: WorkflowStep[];
  isLoading: boolean;
}

export const WorkflowStepsList = ({ steps, isLoading }: WorkflowStepsListProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading workflow history...</p>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No workflow history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Status Changed: {step.statusFrom || 'New'} → {step.statusTo}</h4>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(step.changedAt)}</p>
            </div>
            
            <Badge variant="outline" className={
              step.statusTo.includes('REJECTED') ? "bg-red-50 text-red-600" :
              step.statusTo === 'COMPLETED' ? "bg-gray-50 text-gray-600" :
              step.statusTo === 'ACTIVE' ? "bg-green-50 text-green-600" :
              step.statusTo.includes('APPROVED') ? "bg-blue-50 text-blue-600" :
              "bg-yellow-50 text-yellow-600"
            }>
              {step.statusTo.replace('_', ' ')}
            </Badge>
          </div>
          
          {step.changedByName && (
            <div className="flex items-center gap-1 mt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{step.changedByName}</p>
            </div>
          )}
          
          {step.changedAt && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatDate(step.changedAt)}</p>
            </div>
          )}
          
          {step.comment && (
            <div className="mt-2 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
              <p className="text-sm italic">{step.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
