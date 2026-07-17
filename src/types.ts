export type Language = 'ar' | 'en'
export type Role = 'admin' | 'program' | 'finance' | 'reports' | 'viewer'
export type ProjectStatus = 'active' | 'completed' | 'draft' | 'at-risk'
export type ReportStatus = 'approved' | 'review' | 'draft' | 'returned'
export type TransactionStatus = 'verified' | 'pending' | 'flagged'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  organizationId: string
}

export interface Organization {
  id: string
  name: string
  country: string
  sector: string
  plan: 'free' | 'basic' | 'professional'
}

export interface Project {
  id: string
  name: string
  code: string
  sector: string
  location: string
  donor: string
  partner: string
  budget: number
  spent: number
  beneficiaries: number
  startDate: string
  endDate: string
  status: ProjectStatus
  progress: number
}

export interface Report {
  id: string
  projectId: string
  title: string
  type: 'F1' | 'F4' | 'F5' | 'Narrative'
  period: string
  owner: string
  status: ReportStatus
  completeness: number
  submittedAt?: string
}

export interface Transaction {
  id: string
  projectId: string
  description: string
  vendor: string
  category: string
  amount: number
  date: string
  status: TransactionStatus
  evidenceCount: number
}

export interface BeneficiaryGroup {
  id: string
  projectId: string
  location: string
  households: number
  men: number
  women: number
  boys: number
  girls: number
  peopleWithDisabilities: number
}

export interface DocumentItem {
  id: string
  projectId: string
  name: string
  type: 'receipt' | 'identity' | 'invoice' | 'agreement' | 'report'
  size: string
  uploadedBy: string
  uploadedAt: string
  verified: boolean
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  tone: 'info' | 'success' | 'warning'
}

export interface AppData {
  organization: Organization
  currentUser: User
  projects: Project[]
  reports: Report[]
  transactions: Transaction[]
  beneficiaries: BeneficiaryGroup[]
  documents: DocumentItem[]
  notifications: NotificationItem[]
}
