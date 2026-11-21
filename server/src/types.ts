export type UserRole = 'citizen' | 'officer' | 'admin';

export interface CitizenKarma {
  points: number;
  tier: 'Bronze Civic Sentinel' | 'Silver Community Guardian' | 'Gold Civic Hero' | 'Platinum City Champion';
  badges: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  karma?: CitizenKarma;
  createdAt: string;
}

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type IssueStatus =
  | 'Reported'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Verified'
  | 'Closed';

export interface IssueLocation {
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  city: string;
  pincode?: string;
  zone?: string;
}

export interface AIAnalysis {
  suggestedCategory: string;
  confidence: number;
  suggestedPriority: IssuePriority;
  priorityReason: string;
  summary: string;
  detectedKeywords: string[];
  isPotentialDuplicate: boolean;
  duplicateReportId?: string;
  duplicateSimilarity?: number;
  duplicateReason?: string;
  sentimentRisk?: 'Normal' | 'Elevated Hazard' | 'Critical Emergency';
  estimatedRemediationDays?: number;
}

export interface TimelineEvent {
  id: string;
  status: IssueStatus;
  title: string;
  description: string;
  actorName: string;
  actorRole: UserRole | 'system';
  timestamp: string;
}

export interface ResolutionData {
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  evidenceImages: string[];
  citizenVerified: boolean;
  citizenRating?: number; // 1 to 5
  citizenFeedback?: string;
  verifiedAt?: string;
  workOrderNumber?: string;
  costEstimate?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  location: IssueLocation;
  images: string[];
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  departmentId?: string;
  departmentName?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerPhone?: string;
  upvotes: number;
  upvotedBy: string[];
  impactMultiplier: number; // e.g. 1.0 to 5.0
  slaHours: number;
  slaDeadline: string;
  isSlaBreached: boolean;
  audioTranscript?: string;
  aiAnalysis: AIAnalysis;
  resolution?: ResolutionData;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  email: string;
  phone: string;
  description: string;
  categories: string[];
  officersCount: number;
  activeIssuesCount: number;
  resolvedIssuesCount: number;
  slaComplianceRate: number; // e.g. 96.8%
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultDepartmentId: string;
  defaultPriority: IssuePriority;
  slaHours: number;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  reportId: string;
  reportTitle: string;
  type: 'status_change' | 'assigned' | 'resolved' | 'verified' | 'comment' | 'upvote' | 'sla_warning';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetId?: string;
  details: string;
  timestamp: string;
}
