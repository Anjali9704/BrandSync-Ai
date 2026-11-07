// Role constants
export const ROLES = {
  ADMIN: 'admin',
  BRAND_MANAGER: 'brand_manager',
  CONTENT_CREATOR: 'content_creator',
  REVIEWER: 'reviewer',
  EXTERNAL_AGENCY: 'external_agency',
};

// Content types
export const CONTENT_TYPES = [
  { value: 'social_post', label: 'Social Post' },
  { value: 'ad', label: 'Advertisement' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'email', label: 'Email Newsletter' },
  { value: 'other', label: 'Other Document' },
];

// Platforms
export const PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'website', label: 'Website Blog' },
  { value: 'email', label: 'Direct Email' },
  { value: 'other', label: 'Other' },
];

// Severity levels
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Modern Professional SaaS semantic badge colors
export const SEVERITY_COLORS = {
  low: { bg: 'bg-[#F0F4F8]', text: 'text-[#2D4B60]', border: 'border-[#D5E1EA]' },
  medium: { bg: 'bg-[#FCF6EC]', text: 'text-[#8A5D19]', border: 'border-[#F1DFBF]' },
  high: { bg: 'bg-[#FDF2F2]', text: 'text-[#962317]', border: 'border-[#F6D0D0]' },
};

// Issue types
export const ISSUE_TYPES = {
  TONE: 'tone',
  TERMINOLOGY: 'terminology',
  FACTUAL: 'factual',
  CLAIM: 'claim',
  ACCESSIBILITY: 'accessibility',
  OUTDATED_INFO: 'outdated_info',
};

export const ISSUE_TYPE_LABELS = {
  tone: 'Tone & Voice',
  terminology: 'Restricted Terminology',
  factual: 'Factual Discrepancy',
  claim: 'Unsupported Claim',
  accessibility: 'WCAG Accessibility',
  outdated_info: 'Outdated Information',
};

export const ISSUE_TYPE_COLORS = {
  tone: 'bg-[#F3EFEA] text-[#6E4F31] border-[#E2D6CA]',
  terminology: 'bg-[#FCF4EC] text-[#9A501E] border-[#F2DAC6]',
  factual: 'bg-[#FDF2F2] text-[#962317] border-[#F6D0D0]',
  claim: 'bg-[#FCF6EC] text-[#8A5D19] border-[#F1DFBF]',
  accessibility: 'bg-[#F0F4F8] text-[#2D4B60] border-[#D5E1EA]',
  outdated_info: 'bg-[#F7EFF5] text-[#7A3668] border-[#E8D0E3]',
};

// Statuses
export const STATUSES = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  ANALYZING: 'analyzing',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
};

export const STATUS_COLORS = {
  pending: 'bg-[#FCF6EC] text-[#8A5D19] border-[#F1DFBF]',
  submitted: 'bg-[#F0F4F8] text-[#2D4B60] border-[#D5E1EA]',
  analyzing: 'bg-[#EBF2ED] text-[#244C3A] border-[#DCE3DA]',
  reviewed: 'bg-[#F0F4F8] text-[#2D4B60] border-[#D5E1EA]',
  approved: 'bg-[#EBF2ED] text-[#1E3F30] border-[#CBD4C8]',
  rejected: 'bg-[#FDF2F2] text-[#962317] border-[#F6D0D0]',
  changes_requested: 'bg-[#FCF6EC] text-[#8A5D19] border-[#F1DFBF]',
  active: 'bg-[#EBF2ED] text-[#1E3F30] border-[#CBD4C8]',
  inactive: 'bg-[#FDF2F2] text-[#962317] border-[#F6D0D0]',
  open: 'bg-[#FCF6EC] text-[#8A5D19] border-[#F1DFBF]',
  accepted: 'bg-[#EBF2ED] text-[#1E3F30] border-[#CBD4C8]',
};

// Guideline sections
export const GUIDELINE_SECTIONS = [
  { value: 'overview', label: 'Overview' },
  { value: 'voice_tone', label: 'Voice & Tone' },
  { value: 'approved_terms', label: 'Approved Terms' },
  { value: 'restricted_terms', label: 'Restricted Terms' },
  { value: 'slogans', label: 'Slogans & Taglines' },
  { value: 'company_info', label: 'Company Info' },
  { value: 'colours', label: 'Colours & Visuals' },
  { value: 'typography', label: 'Typography' },
  { value: 'communication_rules', label: 'Communication Rules' },
];

export const MEMBER_ROLES = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.BRAND_MANAGER, label: 'Brand Manager' },
  { value: ROLES.CONTENT_CREATOR, label: 'Content Creator' },
  { value: ROLES.REVIEWER, label: 'Reviewer' },
  { value: ROLES.EXTERNAL_AGENCY, label: 'External Agency' },
];
