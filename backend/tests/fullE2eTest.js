const API_BASE = 'http://localhost:5000/api/v1';

async function req(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const error = new Error(data?.message || data?.detail || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runE2E() {
  console.log('====================================================');
  console.log('BRANDSYNC AI: COMPLETE END-TO-END VERIFICATION SUITE');
  console.log('====================================================\n');

  let adminToken = '';
  let testContentId = '';
  let testIssueId = '';
  let testGuidelineId = '';
  let testTeamMemberId = '';

  try {
    // 1. Healthcheck
    console.log('[1/14] Testing Healthcheck...');
    const health = await req('/health');
    console.log('  ✓ Backend Service is Online:', health.service);

    // 2. Authentication Login
    console.log('\n[2/14] Testing Admin Login (admin@brandsync.ai)...');
    const loginRes = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@brandsync.ai',
        password: 'Pass@123',
      },
    });
    adminToken = loginRes.access_token;
    console.log('  ✓ JWT Generated. User:', loginRes.user.name, `(${loginRes.user.role})`);

    const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 3. User Profile & Preferences
    console.log('\n[3/14] Testing Profile & Preferences Management...');
    const me = await req('/auth/me', { ...authHeaders });
    console.log('  ✓ Fetched User Profile from MongoDB:', me.email);

    const updatedProfile = await req('/auth/profile', {
      method: 'PUT',
      body: { name: 'Dr. Anjali Singh (Lead Admin)', organisation: 'BrandSync Global AI' },
      ...authHeaders,
    });
    console.log('  ✓ Updated User Profile:', updatedProfile.name);

    const updatedPrefs = await req('/auth/preferences', {
      method: 'PUT',
      body: { notificationsEnabled: true, emailNotifications: true, theme: 'light' },
      ...authHeaders,
    });
    console.log('  ✓ Updated User Preferences:', updatedPrefs.preferences);

    // 4. Notifications
    console.log('\n[4/14] Testing Notifications System...');
    const notifs = await req('/notifications', { ...authHeaders });
    console.log('  ✓ Retrieved Notifications count:', notifs.notifications.length, '| Unread:', notifs.unread_count);

    const markAll = await req('/notifications/read-all', {
      method: 'PATCH',
      ...authHeaders,
    });
    console.log('  ✓ Marked all notifications read:', markAll.message);

    // 5. Dashboard Metrics
    console.log('\n[5/14] Testing Dashboard Aggregations...');
    const dash = await req('/dashboard/stats', { ...authHeaders });
    console.log('  ✓ Total Submitted:', dash.total_submitted);
    console.log('  ✓ Compliance Average:', dash.compliance_percentage + '%');
    console.log('  ✓ Recent Activities Loaded:', dash.recent_activities.length);

    // 6. Guidelines Retrieval & CRUD
    console.log('\n[6/14] Testing Guidelines Operations...');
    const guidelines = await req('/guidelines', { ...authHeaders });
    console.log('  ✓ Retrieved Guidelines from MongoDB:', guidelines.length, 'sections');

    const newGuideline = await req('/guidelines', {
      method: 'POST',
      body: {
        section: 'communication_rules',
        title: 'E2E Verified Legal Disclaimer Standard',
        content: 'All forward-looking claims must carry standard safe-harbor legal disclosures.',
        items: ['Add standard disclaimer footer', 'Review with legal counsel'],
      },
      ...authHeaders,
    });
    testGuidelineId = newGuideline.id || newGuideline._id;
    console.log('  ✓ Created new Guideline rule with ID:', testGuidelineId);

    const updateG = await req(`/guidelines/${testGuidelineId}`, {
      method: 'PUT',
      body: { title: 'E2E Verified Legal Disclaimer Standard (Updated)' },
      ...authHeaders,
    });
    console.log('  ✓ Updated Guideline:', updateG.title);

    await req(`/guidelines/${testGuidelineId}`, {
      method: 'DELETE',
      ...authHeaders,
    });
    console.log('  ✓ Deleted test Guideline rule successfully');

    // 7. Assets List
    console.log('\n[7/14] Testing Digital Assets Catalog...');
    const assets = await req('/guidelines/assets', { ...authHeaders });
    console.log('  ✓ Digital Assets fetched:', assets.length);

    // 8. Content Creation
    console.log('\n[8/14] Testing Content Ingestion...');
    const newContent = await req('/content', {
      method: 'POST',
      body: {
        title: 'Q1 Enterprise AI Platform Announcement',
        body: 'Guys, check this out! We are the #1 AI company offering cheap pricing since 2021. Click here to sign up!',
        content_type: 'social_post',
        platform: 'linkedin',
      },
      ...authHeaders,
    });
    testContentId = newContent.id || newContent._id;
    console.log('  ✓ Submitted Content record to MongoDB with ID:', testContentId);

    // 9. Content AI Governance Analysis
    console.log('\n[9/14] Running AI Brand Governance Rule Engine...');
    const analysis = await req(`/content/${testContentId}/analyze`, {
      method: 'POST',
      ...authHeaders,
    });
    console.log('  ✓ Compliance Score Calculated:', analysis.compliance_score + '%');
    console.log('  ✓ Brand Consistency Score:', analysis.brand_consistency_score + '%');
    console.log('  ✓ Issues Flagged by AI Governance Engine:', analysis.issues.length);
    analysis.issues.forEach((iss, idx) => {
      console.log(`    [Issue ${idx + 1}] [${iss.severity.toUpperCase()}] [${iss.type}] "${iss.original_text}" -> ${iss.suggestion}`);
    });

    if (analysis.issues.length > 0) {
      testIssueId = analysis.issues[0]._id;
      // 10. Update Issue Status
      console.log('\n[10/14] Updating Issue Status (Accept Correction)...');
      const patchIssue = await req(`/content/${testContentId}/issues/${testIssueId}`, {
        method: 'PATCH',
        body: { status: 'accepted' },
        ...authHeaders,
      });
      console.log('  ✓ Issue Status in MongoDB updated to:', patchIssue.status);
    }

    // 11. Review & Human Approval Pipeline
    console.log('\n[11/14] Testing Human Review Pipeline...');
    const reviewQueue = await req('/review', { ...authHeaders });
    console.log('  ✓ Review Queue contains:', reviewQueue.length, 'drafts');

    const submitRev = await req(`/review/${testContentId}`, {
      method: 'POST',
      body: {
        decision: 'approved',
        comment: 'All flagged issues resolved according to corporate brand standards.',
        final_text: 'Discover how BrandSync AI transforms your workflow with cost-effective pricing.',
      },
      ...authHeaders,
    });
    console.log('  ✓ Review Submitted with Decision:', submitRev.decision);

    const history = await req(`/review/${testContentId}/history`, { ...authHeaders });
    console.log('  ✓ Audit History log verified. Review count:', history.length);

    // 12. Content Library Verification
    console.log('\n[12/14] Testing Content Library Filter & Pagination...');
    const library = await req('/content?search=Announcement', { ...authHeaders });
    console.log('  ✓ Content search returned:', library.items.length, 'matching documents');

    // 13. Reports & Analytics Summary
    console.log('\n[13/14] Testing Governance Reporting Summary...');
    const reports = await req('/reports/summary', { ...authHeaders });
    console.log('  ✓ Compliance trend points:', reports.compliance_trend.length);
    console.log('  ✓ Category breakdowns:', reports.issues_by_category.length);
    console.log('  ✓ Common violations count:', reports.common_violations.length);
    console.log('  ✓ Approval stats:', reports.approval_stats);

    // 14. Team Management
    console.log('\n[14/14] Testing Team Member Management...');
    const team = await req('/team', { ...authHeaders });
    console.log('  ✓ Team Roster count:', team.length);

    const newMember = await req('/team', {
      method: 'POST',
      body: {
        name: 'Sarah Connor',
        email: `sarah.connor.${Date.now()}@brandsync.ai`,
        role: 'reviewer',
        department: 'Corporate Governance',
      },
      ...authHeaders,
    });
    testTeamMemberId = newMember.id || newMember._id;
    console.log('  ✓ Invited new team member ID:', testTeamMemberId);

    const updatedMember = await req(`/team/${testTeamMemberId}`, {
      method: 'PUT',
      body: { role: 'brand_manager' },
      ...authHeaders,
    });
    console.log('  ✓ Promoted team member role to:', updatedMember.role);

    await req(`/team/${testTeamMemberId}`, {
      method: 'DELETE',
      ...authHeaders,
    });
    console.log('  ✓ Removed test team member cleanly');

    console.log('\n====================================================');
    console.log('SUCCESS! ALL 14 FULL-STACK WORKFLOWS PASSED 100%');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILED:');
    if (err.data) {
      console.error('Status:', err.status);
      console.error('Data:', JSON.stringify(err.data, null, 2));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

runE2E();
