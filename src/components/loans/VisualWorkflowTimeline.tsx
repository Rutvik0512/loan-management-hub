
import React from 'react';
import { Step } from './utils/workflow-helpers';
import { WorkflowStepItem } from './WorkflowStepItem';

interface VisualWorkflowTimelineProps {
  steps: Step[];
}

export const VisualWorkflowTimeline = ({ steps }: VisualWorkflowTimelineProps) => {
  return (
    <div className="relative my-6">
      {/* Horizontal timeline layout */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step box */}
            <div className={`flex flex-col items-center min-w-[120px] text-center ${
              index === steps.length - 1 ? '' : 'flex-1'
            }`}>
              <div className={`px-4 py-2 rounded-md mb-2 w-full ${
                step.status === 'completed' ? 'bg-green-50 text-green-600' :
                step.status === 'current' ? 'bg-blue-50 text-blue-600' :
                step.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                <p className="font-medium truncate">{step.name}</p>
              </div>
              
              {/* Watcher/User info */}
              {step.user && step.status !== 'upcoming' && (
                <div className="bg-amber-400 text-white px-4 py-2 rounded w-full">
                  <p className="font-medium text-center">Watcher</p>
                  <p className="text-sm">{step.user}</p>
                </div>
              )}
              
              {/* Date */}
              {step.date && (
                <p className="text-xs text-gray-500 mt-1">{step.date}</p>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Comments section below timeline */}
      <div className="mt-6 space-y-4">
        {steps.filter(step => step.comment).map((step, index) => (
          <div key={`comment-${index}`} className="bg-gray-50 p-3 rounded-md border">
            <p className="font-medium">{step.name} Comment:</p>
            <p className="text-sm italic">{step.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
