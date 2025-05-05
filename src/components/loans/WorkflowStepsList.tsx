
import React from 'react';
import { WorkflowStep } from '@/types';
import { Badge } from "@/components/ui/badge";
import { User, Clock } from 'lucide-react';
import { formatDate, getStatusBadgeProps } from './utils/workflow-helpers';

interface WorkflowStepsListProps {
  steps: WorkflowStep[];
  isLoading: boolean;
}

export const WorkflowStepsList = ({ steps, isLoading }: WorkflowStepsListProps) => {
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
            
            <Badge {...getStatusBadgeProps(step.statusTo)}>
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
