
import React from 'react';
import { Step } from './utils/workflow-helpers';
import { WorkflowStepItem } from './WorkflowStepItem';

interface VisualWorkflowTimelineProps {
  steps: Step[];
}

export const VisualWorkflowTimeline = ({ steps }: VisualWorkflowTimelineProps) => {
  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="absolute left-10 top-9 h-[calc(100%-40px)] w-1 bg-gray-200"></div>
      
      {/* Workflow steps */}
      {steps.map((step, index) => (
        <WorkflowStepItem 
          key={index} 
          step={step} 
          index={index} 
        />
      ))}
    </div>
  );
};
