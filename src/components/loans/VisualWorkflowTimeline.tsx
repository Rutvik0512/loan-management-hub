
import React from 'react';
import { Step } from './utils/workflow-helpers';
import { CheckCircle2, Clock, XCircle, User, Calendar, MessageSquare } from 'lucide-react';

interface VisualWorkflowTimelineProps {
  steps: Step[];
}

export const VisualWorkflowTimeline = ({ steps }: VisualWorkflowTimelineProps) => {
  // Helper function to get the appropriate status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative my-6">
      {/* Horizontal timeline layout */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle with status */}
            <div className="relative flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                step.status === 'completed' ? 'border-green-500 bg-green-50' :
                step.status === 'current' ? 'border-blue-500 bg-blue-50' :
                step.status === 'rejected' ? 'border-red-500 bg-red-50' :
                'border-gray-300 bg-gray-50'
              }`}>
                {getStatusIcon(step.status)}
              </div>
              
              {/* Step name */}
              <div className="w-28 text-center mt-2">
                <p className="text-sm font-medium truncate">{step.name}</p>
                
                {/* Date info */}
                {step.date && (
                  <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{step.date}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${
                step.status === 'completed' ? 'bg-green-500' :
                'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Details section below timeline */}
      <div className="mt-8 space-y-6">
        {steps.filter(s => s.status !== 'upcoming').map((step, index) => (
          <div key={`detail-${index}`} className={`p-4 rounded-lg border ${
            step.status === 'completed' ? 'border-green-200 bg-green-50' :
            step.status === 'current' ? 'border-blue-200 bg-blue-50' :
            step.status === 'rejected' ? 'border-red-200 bg-red-50' :
            'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex justify-between items-start">
              <h4 className="font-medium flex items-center">
                {getStatusIcon(step.status)}
                <span className="ml-2">{step.name}</span>
              </h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                step.status === 'completed' ? 'bg-green-100 text-green-700' :
                step.status === 'current' ? 'bg-blue-100 text-blue-700' :
                step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {step.status === 'completed' ? 'Completed' : 
                 step.status === 'current' ? 'In Progress' :
                 step.status === 'rejected' ? 'Rejected' : 'Pending'}
              </span>
            </div>
            
            {/* Watcher information */}
            {step.user && (
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>Watcher: {step.user}</span>
              </div>
            )}
            
            {/* Date information */}
            {step.date && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Date: {step.date}</span>
              </div>
            )}
            
            {/* Comment section */}
            {step.comment && (
              <div className="mt-2 flex items-start">
                <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500" />
                <div className="bg-white p-3 rounded border shadow-sm flex-1">
                  <p className="text-sm italic">{step.comment}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
