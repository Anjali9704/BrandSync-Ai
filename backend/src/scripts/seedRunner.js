const User = require('../models/user.model');
const Guideline = require('../models/guideline.model');
const Asset = require('../models/asset.model');
const Content = require('../models/content.model');
const Analysis = require('../models/analysis.model');
const Review = require('../models/review.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@brandsync.ai',
    password: 'Pass@123',
    role: 'admin',
    organisation: 'BrandSync AI',
    preferences: { theme: 'light', notificationsEnabled: true, emailNotifications: true, pushNotifications: false },
  },
  {
    name: 'Anjali Singh',
    email: 'manager@brandsync.ai',
    password: 'Pass@123',
    role: 'brand_manager',
    organisation: 'BrandSync AI',
    preferences: { theme: 'light', notificationsEnabled: true, emailNotifications: true, pushNotifications: false },
  },
  {
    name: 'Rahul Verma',
    email: 'creator@brandsync.ai',
    password: 'Pass@123',
    role: 'content_creator',
    organisation: 'BrandSync AI',
    preferences: { theme: 'light', notificationsEnabled: true, emailNotifications: true, pushNotifications: false },
  },
  {
    name: 'Neeraj Patel',
    email: 'reviewer@brandsync.ai',
    password: 'Pass@123',
    role: 'reviewer',
    organisation: 'BrandSync AI',
    preferences: { theme: 'light', notificationsEnabled: true, emailNotifications: true, pushNotifications: false },
  },
  {
    name: 'Priya Sharma',
    email: 'agency@brandsync.ai',
    password: 'Pass@123',
    role: 'external_agency',
    organisation: 'NovaStack Agency',
    preferences: { theme: 'light', notificationsEnabled: true, emailNotifications: false, pushNotifications: false },
  },
];

const defaultGuidelines = [
  {
    section: 'overview',
    title: 'Brand Identity & Vision',
    content: 'BrandSync AI is the premier enterprise-grade AI brand governance platform. Our mission is to ensure every communication aligns strictly with approved brand guidelines before public release.',
    items: [
      'Tagline: "One Brand. One Voice. One Standard."',
      'Headquartered in Bengaluru, India · Founded 2022',
      'Value propositions: Consistency, Risk Mitigation, AI Governance',
    ],
  },
  {
    section: 'voice_tone',
    title: 'Voice & Tone Principles',
    content: 'Our communication is confident, precise, respectful, and authoritative yet warm.',
    items: [
      'Professional and inclusive at all touchpoints',
      'Avoid hyperbole, buzzwords, and gender-exclusive terms like "guys"',
      'Active voice and clear, concise phrasing are mandatory',
    ],
  },
  {
    section: 'approved_terms',
    title: 'Approved Nomenclature',
    content: 'Standard approved terms to maintain consistency across technical and marketing copy.',
    items: [
      'AI-powered brand governance (not "AI policing")',
      'Cost-effective pricing (not "cheap")',
      'Enterprise-grade compliance (not "enterprise-ready")',
      'Real-time automated analysis (not "instant checking")',
    ],
  },
  {
    section: 'restricted_terms',
    title: 'Restricted & Banned Terms',
    content: 'The following terms are prohibited from all external communications.',
    items: [
      'cheap, cheapest, budget, low-cost',
      '#1, number one, market leader (without cited report)',
      '100% guaranteed, foolproof',
      'easy, effortless, simple (prefer "streamlined" or "intuitive")',
    ],
  },
  {
    section: 'slogans',
    title: 'Official Slogans & Taglines',
    content: 'Approved slogans for campaigns and collaterals.',
    items: [
      'Primary: "One Brand. One Voice. One Standard."',
      'Campaign: "Your Brand, Always On."',
      'Product: "AI that speaks your brand language."',
    ],
  },
  {
    section: 'company_info',
    title: 'Corporate Facts & Legal',
    content: 'Factual information authorized for public dissemination.',
    items: [
      'Founded: 2022',
      'HQ: Bengaluru, Karnataka, India',
      'Parent: Inkloom AI',
      'Customer Base: 500+ global enterprises',
    ],
  },
  {
    section: 'colours',
    title: 'Brand Color Palette',
    content: 'Official color hierarchy for web, collateral, and presentation surfaces.',
    items: [
      'Primary Background: #F7F8F4 (Eggshell Warm White)',
      'Primary Color: #244C3A (Forest Green)',
      'Secondary Accent: #D5A45B (Muted Gold)',
      'Supporting Color: #DCE3DA (Soft Sage)',
      'Text Primary: #252B27 (Deep Slate)',
      'Text Secondary: #737B75 (Muted Slate)',
    ],
  },
  {
    section: 'typography',
    title: 'Typography System',
    content: 'Inter font family utilized across all digital interfaces and materials.',
    items: [
      'Font Family: Inter, sans-serif',
      'Headings: Inter SemiBold / Bold (600–700)',
      'Body: Inter Regular (400)',
      'Buttons & Labels: Inter Medium (500)',
    ],
  },
  {
    section: 'communication_rules',
    title: 'Publishing & Compliance Rules',
    content: 'Mandatory publication standards governing all communications.',
    items: [
      '§ 4.2 — All market claims require independent, dated citations',
      '§ 5.1 — Anchor text must be descriptive; generic "Click here" is prohibited',
      '§ 5.2 — Image media must include accessible alt descriptions',
      '§ 6.1 — Competitor comparisons require explicit legal review prior to submission',
    ],
  },
];

const defaultAssets = [
  { name: 'BrandSync Forest Green Swatch', type: 'colour', url: '#244C3A' },
  { name: 'BrandSync Muted Gold Swatch', type: 'colour', url: '#D5A45B' },
  { name: 'Soft Sage Background Swatch', type: 'colour', url: '#DCE3DA' },
  { name: 'Official SVG Logomark', type: 'logo', url: '/vite.svg' },
  { name: 'Inter Google Font Package', type: 'font', url: null },
];

async function seedDatabase() {
  console.log('[Seed] Resetting and seeding database with production initial dataset...');

  // Clean collections to avoid duplicates and ensure freshness
  await User.deleteMany({});
  await Guideline.deleteMany({});
  await Asset.deleteMany({});
  await Content.deleteMany({});
  await Analysis.deleteMany({});
  await Review.deleteMany({});
  await Activity.deleteMany({});
  await Notification.deleteMany({});

  // 1. Users
  const createdUsers = [];
  for (const u of defaultUsers) {
    const user = await User.create(u);
    createdUsers.push(user);
  }
  console.log(`[Seed] Seeded ${createdUsers.length} users.`);

  const admin = createdUsers[0];
  const manager = createdUsers[1];
  const creator = createdUsers[2];
  const reviewer = createdUsers[3];
  const agency = createdUsers[4];

  // 2. Guidelines
  for (const g of defaultGuidelines) {
    await Guideline.create({ ...g, createdBy: admin._id });
  }
  console.log(`[Seed] Seeded ${defaultGuidelines.length} guidelines.`);

  // 3. Assets
  for (const a of defaultAssets) {
    await Asset.create({ ...a, uploadedBy: admin._id });
  }

  // 4. Content Submissions
  const contentItems = [
    {
      title: 'Q4 Product Launch Announcement',
      body: 'BrandSync AI is the #1 AI company in India, transforming how organisations manage brand compliance at scale. We offer cheap pricing plans for teams of all sizes. Empowering brands since 2021! guys, you\'ve gotta try this out. Click here to begin.',
      content_type: 'social_post',
      platform: 'linkedin',
      status: 'changes_requested',
      compliance_score: 58,
      author: creator._id,
    },
    {
      title: 'Customer Advisory Newsletter',
      body: 'Empowering brands since 2022, BrandSync AI ensures continuous consistency across multiple marketing touchpoints. View our pricing plans to learn how enterprise teams streamline reviews.',
      content_type: 'email',
      platform: 'email',
      status: 'approved',
      compliance_score: 95,
      author: creator._id,
    },
    {
      title: 'Blog: The Future of Brand Governance 2026',
      body: 'Discover how modern teams enforce voice, terminology, and legal compliance before publication. BrandSync AI delivers real-time validation.',
      content_type: 'blog',
      platform: 'website',
      status: 'submitted',
      compliance_score: 88,
      author: creator._id,
    },
  ];

  for (const c of contentItems) {
    const createdContent = await Content.create(c);

    // Create Analysis for first item
    if (c.compliance_score === 58) {
      const analysis = await Analysis.create({
        content_id: createdContent._id,
        compliance_score: 58,
        brand_consistency_score: 62,
        tone_score: 68,
        factual_accuracy_score: 45,
        summary: '5 policy violations detected: unsupported superlative claim, banned term "cheap", invalid founding date, informal phrasing, and non-descriptive link.',
        issues: [
          {
            type: 'claim',
            severity: 'high',
            start_index: 21,
            end_index: 43,
            original_text: '#1 AI company in India',
            explanation: 'Unsubstantiated market superlative claims violate Communication Rules § 4.2.',
            suggestion: 'Replace with "a leading AI company in India".',
            guideline_ref: 'Communication Rules § 4.2',
            status: 'open',
          },
          {
            type: 'terminology',
            severity: 'high',
            start_index: 124,
            end_index: 137,
            original_text: 'cheap pricing',
            explanation: '"Cheap" is a restricted term undermining enterprise positioning.',
            suggestion: 'Use "cost-effective pricing".',
            guideline_ref: 'Approved Terms § 2.1',
            status: 'open',
          },
        ],
        corrected_text: 'BrandSync AI is a leading AI company in India, transforming how organisations manage brand compliance at scale. We offer cost-effective pricing plans for teams of all sizes.',
      });

      createdContent.latestAnalysis = analysis._id;
      await createdContent.save();

      // Create Review record
      await Review.create({
        content_id: createdContent._id,
        reviewer: reviewer._id,
        decision: 'changes_requested',
        comment: 'Please apply the suggested fixes for superlative claim and pricing terminology before publication.',
      });
    }

    // Activity
    await Activity.create({
      type: 'submitted',
      user: creator._id,
      userName: creator.name,
      content_id: createdContent._id,
      content_title: createdContent.title,
    });
  }

  // 5. Seed Notifications in MongoDB
  const notificationTemplates = [
    {
      title: 'Action Required: Content Revision',
      message: 'Q4 Product Launch Announcement flagged 2 brand issues requiring reviewer sign-off.',
      type: 'warning',
      read: false,
    },
    {
      title: 'Approval Granted',
      message: 'Customer Advisory Newsletter has been verified and approved for distribution.',
      type: 'success',
      read: false,
    },
    {
      title: 'Guideline Update Notice',
      message: 'Brand Guidelines § 4.2 updated by Admin with updated compliance criteria.',
      type: 'info',
      read: true,
    },
    {
      title: 'Team Access Updated',
      message: 'Priya Sharma (NovaStack Agency) has been granted External Agency access.',
      type: 'info',
      read: true,
    },
  ];

  for (const user of createdUsers) {
    for (const notif of notificationTemplates) {
      await Notification.create({
        user: user._id,
        ...notif,
      });
    }
  }
  console.log(`[Seed] Seeded notifications for all ${createdUsers.length} users in MongoDB.`);

  console.log('[Seed] Successfully initialized demo dataset.');
}

module.exports = seedDatabase;
