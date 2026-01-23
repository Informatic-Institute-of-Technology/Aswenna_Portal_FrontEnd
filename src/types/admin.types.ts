import type { UserRole } from './index';

export interface SuperAdminDashboardData {
  totalUsers: number;
  totalFarmers: number;
  totalInvestors: number;
  totalLandowners: number;
  activeBondedProjects: number;
  completedProjects: number;
  totalEscrowBalance: number;
  totalPlatformRevenue: number;
  overduePayments: OverduePayment[];
  recentTransactions: Transaction[];
  recentActivities: SystemActivity[];
}

export interface PlatformKPIs {
  financial: FinancialKPIs;
  projectHealth: ProjectHealthKPIs;
  userGrowth: UserGrowthKPIs;
}

export interface FinancialKPIs {
  totalInvestmentValue: number;
  totalPayoutsLast30Days: number;
  platformRevenue: number;
  escrowBalance: number;
  averageProjectValue: number;
}

export interface ProjectHealthKPIs {
  successRate: number; // % of projects reaching harvest
  averageDisputeResolutionTime: number; // in days
  overduePaymentRatio: number; // %
  activeDisputes: number;
  completionRate: number;
}

export interface UserGrowthKPIs {
  totalUsers: number;
  newUsersLast30Days: number;
  activeUsers: number;
  usersByRole: {
    farmers: number;
    investors: number;
    landowners: number;
  };
}

export interface GlobalUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  registrationDate: string;
  lastLogin: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  address?: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTransactions: number;
  totalInvested?: number;
  totalEarnings?: number;
  verificationStatus: VerificationStatus;
  documents: VerificationDocument[];
  overduePayments: number;
  disputesInvolved: number;
  trustScore: number;
}

export interface VerificationStatus {
  identity: 'pending' | 'verified' | 'rejected';
  email: 'pending' | 'verified' | 'rejected';
  phone: 'pending' | 'verified' | 'rejected';
  bankAccount?: 'pending' | 'verified' | 'rejected';
}

export interface VerificationDocument {
  id: string;
  type: 'national_id' | 'passport' | 'bank_statement' | 'land_deed' | 'other';
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: string;
  notes?: string;
}

export interface UserDetailView {
  user: GlobalUser;
  linkedProjects: ProjectSummary[];
  transactionHistory: Transaction[];
  activityLog: SystemActivity[];
}

export interface Transaction {
  id: string;
  transactionId: string;
  type: 'payment' | 'refund' | 'escrow_deposit' | 'escrow_release' | 'platform_fee';
  payer: {
    id: string;
    name: string;
    role: UserRole;
  };
  payee: {
    id: string;
    name: string;
    role: UserRole;
  };
  projectId?: string;
  projectName?: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'in_escrow' | 'disputed';
  paymentMethod?: string;
  description?: string;
  milestoneId?: string;
  milestoneName?: string;
}

export interface OverduePayment {
  id: string;
  projectId: string;
  projectName: string;
  partyId: string;
  partyName: string;
  partyRole: UserRole;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  type: 'milestone_payment' | 'rent' | 'investment' | 'profit_share';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EscrowAccount {
  projectId: string;
  projectName: string;
  totalDeposited: number;
  totalReleased: number;
  currentBalance: number;
  pendingReleases: number;
  lastUpdated: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'completed' | 'cancelled' | 'disputed' | 'pending';
  startDate: string;
  endDate?: string;
  completionPercentage: number;
  farmer: {
    id: string;
    name: string;
  };
  investor: {
    id: string;
    name: string;
  };
  landowner: {
    id: string;
    name: string;
  };
  totalInvestment: number;
  disbursedAmount: number;
  remainingBudget: number;
  totalMilestones: number;
  completedMilestones: number;
  pendingMilestones: number;
  overdueMilestones: number;
  location: {
    district: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  hasDisputes: boolean;
  hasOverduePayments: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Project360View extends ProjectSummary {
  agreement: {
    fileName: string;
    uploadDate: string;
    signedBy: string[];
    documentUrl: string;
  };
  milestones: Milestone[];
  transactions: Transaction[];
  communications: Communication[];
  disputes?: Dispute[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  completionDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'disputed';
  budgetAllocated: number;
  amountPaid: number;
  approvedBy?: string[];
  evidenceDocuments: string[];
}

export interface Communication {
  id: string;
  date: string;
  from: {
    id: string;
    name: string;
    role: UserRole;
  };
  to: {
    id: string;
    name: string;
    role: UserRole;
  };
  subject: string;
  type: 'message' | 'notification' | 'alert' | 'approval_request';
  status: 'sent' | 'read' | 'replied';
}

export interface Dispute {
  id: string;
  projectId: string;
  projectName: string;
  initiatedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  against: {
    id: string;
    name: string;
    role: UserRole;
  };
  type: 'payment' | 'milestone' | 'agreement_breach' | 'quality' | 'other';
  description: string;
  initiatedDate: string;
  status: 'open' | 'in_review' | 'resolved' | 'escalated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  amountInDispute?: number;
  resolution?: string;
  resolvedDate?: string;
  resolutionTime?: number;
}

export interface SystemActivity {
  id: string;
  timestamp: string;
  type: ActivityType;
  actor: {
    id: string;
    name: string;
    role: UserRole;
  };
  target?: {
    id: string;
    name: string;
    type: 'user' | 'project' | 'transaction' | 'document';
  };
  action: string;
  description: string;
  metadata?: Record<string, undefined>;
  ipAddress?: string;
}

export type ActivityType = 
  | 'user_registration'
  | 'user_login'
  | 'user_logout'
  | 'project_created'
  | 'project_updated'
  | 'project_completed'
  | 'agreement_signed'
  | 'payment_initiated'
  | 'payment_completed'
  | 'milestone_completed'
  | 'milestone_approved'
  | 'dispute_raised'
  | 'dispute_resolved'
  | 'document_uploaded'
  | 'verification_completed'
  | 'message_sent'
  | 'system_alert';

export interface AdminFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  userRole?: UserRole[];
  projectStatus?: ProjectSummary['status'][];
  transactionStatus?: Transaction['status'][];
  paymentStatus?: 'all' | 'overdue' | 'pending' | 'completed';
  verificationStatus?: ('verified' | 'pending' | 'rejected')[];
  searchQuery?: string;
}

export interface AdminAnalytics {
  timeSeriesData: TimeSeriesData[];
  distributionData: DistributionData;
  performanceMetrics: PerformanceMetrics;
}

export interface TimeSeriesData {
  date: string;
  newUsers: number;
  newProjects: number;
  transactionVolume: number;
  disputes: number;
}

export interface DistributionData {
  projectsByType: { [key: string]: number };
  projectsByRegion: { [key: string]: number };
  usersByRegion: { [key: string]: number };
}

export interface PerformanceMetrics {
  averageProjectDuration: number;
  averageInvestmentSize: number;
  platformGrowthRate: number;
  userRetentionRate: number;
}
