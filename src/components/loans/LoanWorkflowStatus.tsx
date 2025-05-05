
import React from 'react';
import { LoanApplication } from '@/types';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStepsList } from './WorkflowStepsList';
import { LoanDetailsSummary } from './LoanDetailsSummary';
import { VisualWorkflowTimeline } from './VisualWorkflowTimeline';
import { 
  generateFallbackWorkflowHistory,
  generateVisualSteps,
  getStatusBadgeProps
} from './utils/workflow-helpers';

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
        const workflowSteps = (historyData as WorkflowHistoryRecord[] || []).map(item => ({
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

  // Generate visual steps based on the application status and workflow history
  const visualSteps = generateVisualSteps(application, workflowHistory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Loan Application Workflow</h3>
        <Badge {...getStatusBadgeProps(application.status)}>
          {application.status.replace('_', ' ')}
        </Badge>
      </div>
      
      {/* Loan details summary */}
      <LoanDetailsSummary application={application} />
      
      {/* Show workflow steps list or visual timeline */}
      {workflowHistory && workflowHistory.length > 0 ? (
        <WorkflowStepsList steps={workflowHistory} isLoading={isLoading} />
      ) : (
        <VisualWorkflowTimeline steps={visualSteps} />
      )}
    </div>
  );
};
