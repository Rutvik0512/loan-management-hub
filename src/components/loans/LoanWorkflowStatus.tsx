import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle, User, BanknoteIcon, CreditCard } from 'lucide-react';
import { LoanApplication, WorkflowStep } from '@/types';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { WorkflowStepsList } from './WorkflowStepsList';

interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected';
  date?: string;
  comment?: string;
  user?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM d, yyyy');
};

// This type helps with safer typings for Supabase queries
type WorkflowHistoryRecord = {
  id: string;
  loan_application_id: string;
  status_from: string | null;
  status_to: string;
  comment: string | null;
  changed_by: string | null;
  changed_at: string | null;
};

export const LoanWorkflowStatus = ({ application }: { application: LoanApplication }) => {
  // Fetch workflow history for this application
  const { data: workflowHistory, isLoading } = useQuery({
    queryKey: ['loanWorkflowHistory', application.id],
    queryFn: async () => {
      try {
        // Since we now have the loan_workflow_history table, let's use it
        const { data: historyData, error } = await supabase
          .from('loan_workflow_history')
          .select('*')
          .eq('loan_application_id', application.id)
          .order('changed_at', { ascending: true });
        
        if (error) {
          console.error('Error fetching workflow history:', error);
          // Fallback to the legacy approach: construct workflow history from the application data
          return generateFallbackWorkflowHistory(application);
        }
        
        // Also get user names
        const userIds = (historyData || [])
          .filter(item => item.changed_by)
          .map(item => item.changed_by)
          .filter(Boolean) as string[];
        
        let userMap: Record<string, string> = {};
        if (userIds.length > 0) {
          const { data: userData } = await supabase
            .from('users')
            .select('id, name')
            .in('id', userIds);
            
          userMap = (userData || []).reduce((acc, user) => {
            if (user?.id) acc[user.id] = user.name;
            return acc;
          }, {} as Record<string, string>);
        }
        
        // Map the history data to workflow steps
        const workflowSteps: WorkflowStep[] = (historyData as WorkflowHistoryRecord[] || []).map(item => ({
          id: item.id,
          statusFrom: item.status_from || undefined,
          statusTo: item.status_to,
          comment: item.comment || undefined,
          changedAt: item.changed_at || '',
          changedBy: item.changed_by || undefined,
          changedByName: item.changed_by ? userMap[item.changed_by] || 'Unknown User' : undefined
        }));
        
        return workflowSteps.length > 0 
          ? workflowSteps 
          : generateFallbackWorkflowHistory(application);
      } catch (error) {
        console.error('Error fetching workflow history:', error);
        // Fallback to generating workflow history from application data
        return generateFallbackWorkflowHistory(application);
      }
    },
    enabled: !!application.id
  });

  // Generate fallback workflow history from application data
  const generateFallbackWorkflowHistory = (app: LoanApplication): WorkflowStep[] => {
    const steps: WorkflowStep[] = [];
    
    // Application submission step
    steps.push({
      id: '1',
      statusFrom: null,
      statusTo: 'PENDING',
      comment: 'Application submitted',
      changedByName: app.userName,
      changedAt: app.appliedDate
    });
    
    // Manager approval/rejection step
    if (['MANAGER_APPROVED', 'MANAGER_REJECTED', 'FINANCE_APPROVED', 'FINANCE_REJECTED', 'ACTIVE', 'COMPLETED'].includes(app.status)) {
      steps.push({
        id: '2',
        statusFrom: 'PENDING',
        statusTo: app.status.startsWith('MANAGER_') ? app.status : 'MANAGER_APPROVED',
        comment: app.managerComment,
        changedByName: 'Manager',
        changedAt: app.approvedDate || app.rejectedDate || ''
      });
    }
    
    // Finance approval/rejection step
    if (['FINANCE_APPROVED', 'FINANCE_REJECTED', 'ACTIVE', 'COMPLETED'].includes(app.status)) {
      steps.push({
        id: '3',
        statusFrom: 'MANAGER_APPROVED',
        statusTo: app.status.startsWith('FINANCE_') ? app.status : 'FINANCE_APPROVED',
        comment: app.financeComment,
        changedByName: 'Finance Officer',
        changedAt: app.approvedDate || app.rejectedDate || ''
      });
    }
    
    // Loan disbursement step
    if (['ACTIVE', 'COMPLETED'].includes(app.status)) {
      steps.push({
        id: '4',
        statusFrom: 'FINANCE_APPROVED',
        statusTo: 'ACTIVE',
        comment: 'Loan disbursed',
        changedByName: 'System',
        changedAt: app.approvedDate || ''
      });
    }
    
    // Loan completion step
    if (app.status === 'COMPLETED') {
      steps.push({
        id: '5',
        statusFrom: 'ACTIVE',
        statusTo: 'COMPLETED',
        comment: 'Loan fully repaid',
        changedByName: 'System',
        changedAt: app.completionDate || ''
      });
    }
    
    return steps;
  };

  // Determine the steps based on the application status and workflow history
  const generateSteps = (): Step[] => {
    const steps: Step[] = [
      {
        name: 'Application Submitted',
        status: 'completed',
        date: formatDate(application.appliedDate),
        user: application.userName
      }
    ];

    // Manager approval step
    if (['MANAGER_APPROVED', 'FINANCE_APPROVED', 'FINANCE_REJECTED', 'ACTIVE', 'COMPLETED'].includes(application.status)) {
      const managerEvent = workflowHistory?.find(h => h.statusTo === 'MANAGER_APPROVED');
      steps.push({
        name: 'Manager Approval',
        status: 'completed',
        date: formatDate(managerEvent?.changedAt || application.approvedDate),
        comment: application.managerComment,
        user: managerEvent?.changedByName
      });
    } else if (application.status === 'MANAGER_REJECTED') {
      const managerEvent = workflowHistory?.find(h => h.statusTo === 'MANAGER_REJECTED');
      steps.push({
        name: 'Manager Approval',
        status: 'rejected',
        date: formatDate(managerEvent?.changedAt || application.rejectedDate),
        comment: application.managerComment,
        user: managerEvent?.changedByName
      });
    } else {
      steps.push({
        name: 'Manager Approval',
        status: application.status === 'PENDING' ? 'current' : 'upcoming'
      });
    }

    // Finance approval step
    if (['FINANCE_APPROVED', 'ACTIVE', 'COMPLETED'].includes(application.status)) {
      const financeEvent = workflowHistory?.find(h => h.statusTo === 'FINANCE_APPROVED');
      steps.push({
        name: 'Finance Approval',
        status: 'completed',
        date: formatDate(financeEvent?.changedAt || application.approvedDate),
        comment: application.financeComment,
        user: financeEvent?.changedByName
      });
    } else if (application.status === 'FINANCE_REJECTED') {
      const financeEvent = workflowHistory?.find(h => h.statusTo === 'FINANCE_REJECTED');
      steps.push({
        name: 'Finance Approval',
        status: 'rejected',
        date: formatDate(financeEvent?.changedAt || application.rejectedDate),
        comment: application.financeComment,
        user: financeEvent?.changedByName
      });
    } else {
      steps.push({
        name: 'Finance Approval',
        status: application.status === 'MANAGER_APPROVED' ? 'current' : 'upcoming'
      });
    }

    // Loan active step
    if (['ACTIVE', 'COMPLETED'].includes(application.status)) {
      const activeEvent = workflowHistory?.find(h => h.statusTo === 'ACTIVE');
      steps.push({
        name: 'Loan Disbursed',
        status: 'completed',
        date: formatDate(activeEvent?.changedAt || application.approvedDate),
        user: activeEvent?.changedByName
      });
    } else {
      steps.push({
        name: 'Loan Disbursed',
        status: application.status === 'FINANCE_APPROVED' ? 'current' : 'upcoming'
      });
    }

    // Loan completed step
    if (application.status === 'COMPLETED') {
      const completedEvent = workflowHistory?.find(h => h.statusTo === 'COMPLETED');
      steps.push({
        name: 'Loan Completed',
        status: 'completed',
        date: formatDate(completedEvent?.changedAt || application.completionDate),
        user: completedEvent?.changedByName
      });
    } else {
      steps.push({
        name: 'Loan Completed',
        status: application.status === 'ACTIVE' ? 'current' : 'upcoming'
      });
    }

    return steps;
  };

  const steps = generateSteps();

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

  const getStepIconByName = (name: string) => {
    switch (name) {
      case 'Application Submitted':
        return <CreditCard className="h-5 w-5" />;
      case 'Manager Approval':
        return <User className="h-5 w-5" />;
      case 'Finance Approval':
        return <User className="h-5 w-5" />;
      case 'Loan Disbursed':
        return <BanknoteIcon className="h-5 w-5" />;
      case 'Loan Completed':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Loan Application Workflow</h3>
        {getStatusBadge(application.status)}
      </div>
      
      {/* Loan details summary */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
        <div>
          <p className="text-sm text-muted-foreground">Loan Type</p>
          <p className="font-medium">{application.loanName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Applied Amount</p>
          <p className="font-medium">₹{application.appliedAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tenure</p>
          <p className="font-medium">{application.appliedTenure} months</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">EMI</p>
          <p className="font-medium">₹{application.emi.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Show workflow steps list */}
      {workflowHistory && workflowHistory.length > 0 ? (
        <WorkflowStepsList steps={workflowHistory} isLoading={isLoading} />
      ) : (
        <div className="relative">
          {/* Ariba-style workflow visualization */}
          <div className="absolute left-10 top-9 h-[calc(100%-40px)] w-1 bg-gray-200"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative flex mb-8">
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
          ))}
        </div>
      )}
    </div>
  );
};
