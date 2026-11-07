/**
 * API Contract v1 — Aligned with Express.js + MongoDB backend routes.
 * Base: /api/v1
 */

const API = {
  // AUTH
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  UPDATE_PREFERENCES: '/auth/preferences',

  // DASHBOARD
  DASHBOARD_STATS: '/dashboard/stats',

  // GUIDELINES
  GUIDELINES: '/guidelines',
  GUIDELINE: (id) => `/guidelines/${id}`,
  GUIDELINE_ASSETS: '/guidelines/assets',
  GUIDELINE_ASSET: (id) => `/guidelines/assets/${id}`,

  // CONTENT
  CONTENT: '/content',
  CONTENT_ITEM: (id) => `/content/${id}`,
  ANALYZE: (id) => `/content/${id}/analyze`,
  UPDATE_ISSUE: (contentId, issueId) =>
    `/content/${contentId}/issues/${issueId}`,

  // REVIEW
  REVIEW: '/review',
  SUBMIT_REVIEW: (contentId) => `/review/${contentId}`,
  REVIEW_HISTORY: (contentId) => `/review/${contentId}/history`,

  // REPORTS
  REPORTS_SUMMARY: '/reports/summary',

  // TEAM
  TEAM: '/team',
  TEAM_MEMBER: (id) => `/team/${id}`,

  // NOTIFICATIONS
  NOTIFICATIONS: '/notifications',
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
  DELETE_NOTIFICATION: (id) => `/notifications/${id}`,
};

export default API;
