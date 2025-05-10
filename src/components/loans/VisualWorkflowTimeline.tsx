
import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, User, Calendar, MessageSquare, CreditCard, ArrowDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export interface Step {
  name: string;
  status: 'completed' | 'current' | 'rejected' | 'upcoming';
  date?: string;
  user?: string;
  comment?: string;
}

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'current':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };

  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.status === 'current');
  
  // Format large numbers with commas
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="my-6 space-y-8">
      {/* Horizontal timeline layout */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center min-w-max">
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
                  
                  {/* Date info as tooltip */}
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
      </div>

      {/* Current Progress Summary */}
      {currentStepIndex !== -1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-700 flex items-center mb-2">
            <Clock className="h-5 w-5 mr-2" />
            Current Status: {steps[currentStepIndex].name}
          </h4>
          <p className="text-sm text-blue-600">
            {currentStepIndex === 0 ? "Your loan application has been submitted and is awaiting manager review." :
             currentStepIndex === 1 ? "Your application has been approved by the manager and is now with the finance team." :
             currentStepIndex === 2 ? "Your loan has been approved by finance and is being processed for disbursement." :
             "Your loan is active and repayments are in progress."}
          </p>
        </div>
      )}

      {/* Details section using accordion for detailed information */}
      <Accordion type="multiple" defaultValue={steps.filter(s => s.status === 'current').map((_, index) => `item-${index}`)} className="w-full space-y-4">
        {steps.filter(s => s.status !== 'upcoming').map((step, index) => (
          <AccordionItem 
            key={`detail-${index}`} 
            value={`item-${index}`}
            className={`border rounded-lg overflow-hidden ${
              step.status === 'completed' ? 'border-green-200' :
              step.status === 'current' ? 'border-blue-200' :
              step.status === 'rejected' ? 'border-red-200' :
              'border-gray-200'
            }`}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-start text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'current' ? 'bg-blue-100' :
                  step.status === 'rejected' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  {getStatusIcon(step.status)}
                </div>
                <div>
                  <h4 className="font-medium text-base">{step.name}</h4>
                  {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                </div>
                <div className="ml-auto">
                  {getStatusBadge(step.status)}
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-4 bg-white">
              <div className="space-y-4 pt-2">
                {/* Watcher/User information */}
                {step.user && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Processed by: <span className="font-medium">{step.user}</span></span>
                  </div>
                )}
                
                {/* Financial details for approved steps */}
                {(step.status === 'completed' && step.name.includes('Approval')) && (
                  <div className="bg-gray-50 p-3 rounded border grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Approved Amount</p>
                        <p className="font-medium">₹500,000</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Approved Date</p>
                        <p className="font-medium">{step.date}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Loan disbursement details */}
                {step.name === 'Loan Disbursed' && step.status === 'completed' && (
                  <div className="bg-green-50 p-3 rounded border border-green-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">Disbursed Amount</p>
                        <p className="font-medium">₹500,000</p>
                      </div>
                      <ArrowDown className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Bank Account</p>
                        <p className="font-medium">XXXX4287</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-green-200">
                      <p className="text-xs text-gray-600">Transaction Reference</p>
                      <p className="font-medium text-sm">TXN123456789</p>
                    </div>
                  </div>
                )}

                {/* Repayment status for active loans */}
                {(step.name === 'Loan Disbursed' || step.name === 'Completed') && 
                 (step.status === 'completed' || step.status === 'current') && (
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Repayment Status</h5>
                    <div className="bg-white border rounded p-3 space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Total Loan Amount</p>
                          <p className="font-medium">₹500,000</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">EMI</p>
                          <p className="font-medium">₹10,830/month</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Paid Amount</p>
                          <p className="font-medium text-green-600">₹129,960</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Remaining Balance</p>
                          <p className="font-medium text-blue-600">₹370,040</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Repayment Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '26%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-gray-500">12 of 48 EMIs paid (26% complete)</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comment section */}
                {step.comment && (
                  <div className="mt-3 flex items-start">
                    <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500" />
                    <div className="bg-gray-50 p-3 rounded border shadow-sm flex-1">
                      <p className="text-sm italic">{step.comment}</p>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
