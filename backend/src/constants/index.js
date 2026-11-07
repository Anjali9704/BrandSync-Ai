const ROLES = {
  ADMIN: 'admin',
  BRAND_MANAGER: 'brand_manager',
  CONTENT_CREATOR: 'content_creator',
  REVIEWER: 'reviewer',
  EXTERNAL_AGENCY: 'external_agency',
};

const CONTENT_TYPES = ['social_post', 'ad', 'blog', 'email', 'other'];

const PLATFORMS = ['linkedin', 'twitter', 'instagram', 'facebook', 'website', 'email', 'other'];

const SEVERITIES = ['low', 'medium', 'high'];

const ISSUE_TYPES = ['tone', 'terminology', 'factual', 'claim', 'accessibility', 'outdated_info'];

const CONTENT_STATUSES = [
  'draft',
  'submitted',
  'analyzing',
  'reviewed',
  'approved',
  'rejected',
  'changes_requested',
];

const GUIDELINE_SECTIONS = [
  'overview',
  'voice_tone',
  'approved_terms',
  'restricted_terms',
  'slogans',
  'company_info',
  'colours',
  'typography',
  'communication_rules',
];

module.exports = {
  ROLES,
  CONTENT_TYPES,
  PLATFORMS,
  SEVERITIES,
  ISSUE_TYPES,
  CONTENT_STATUSES,
  GUIDELINE_SECTIONS,
};

