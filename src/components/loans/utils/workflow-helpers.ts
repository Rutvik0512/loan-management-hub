
import { format } from 'date-fns';
import { LoanApplication, WorkflowStep } from '@/types';

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM d, yyyy');
};

/**
 * Generate fallback workflow history steps from application data
 */
export const generateFallbackWorkflowHistory = (app: LoanApplication): WorkflowStep[] => {
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

/**
 * Generate workflow visual steps based on application status and history
 */
export interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected';
  date?: string;
  comment?: string;
  user?: string;
}

export const generateVisualSteps = (application: LoanApplication, workflowHistory?: WorkflowStep[]): Step[] => {
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

/**
 * Get status badge variant based on loan status
 */
export const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { variant: "outline" as const, className: "bg-yellow-50 text-yellow-600 border-yellow-200" };
    case 'MANAGER_APPROVED':
      return { variant: "outline" as const, className: "bg-blue-50 text-blue-600 border-blue-200" };
    case 'MANAGER_REJECTED':
      return { variant: "outline" as const, className: "bg-red-50 text-red-600 border-red-200" };
    case 'FINANCE_APPROVED':
      return { variant: "outline" as const, className: "bg-purple-50 text-purple-600 border-purple-200" };
    case 'FINANCE_REJECTED':
      return { variant: "outline" as const, className: "bg-red-50 text-red-600 border-red-200" };
    case 'ACTIVE':
      return { variant: "outline" as const, className: "bg-green-50 text-green-600 border-green-200" };
    case 'COMPLETED':
      return { variant: "outline" as const, className: "bg-gray-50 text-gray-600 border-gray-200" };
    default:
      return { variant: "outline" as const, className: "" };
  }
};
