const Content = require('../models/content.model');
const Analysis = require('../models/analysis.model');
const Activity = require('../models/activity.model');
const Guideline = require('../models/guideline.model');
const ApiError = require('../utils/ApiError');

class AnalysisService {
  async analyzeContent(contentId, user) {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new ApiError(404, 'Content submission not found.');
    }

    const text = content.body;
    const issues = [];

    // Core Brand Governance Rules Engine
    const rulePatterns = [
      {
        pattern: /#1\s+AI\s+company|number\s+one\s+AI\s+company|the\s+best\s+AI/gi,
        type: 'claim',
        severity: 'high',
        explanation: 'Absolute market leadership claims require independent verified citation according to Communication Rules § 4.2.',
        suggestion: 'Replace with "a leading AI company in India" or cite an approved industry benchmark.',
        guideline_ref: 'Communication Rules § 4.2 — Unsubstantiated superlative claims',
        preferredReplacement: 'a leading AI company in India',
      },
      {
        pattern: /\bcheap\s+pricing\b|\bcheap\b|\bcheapest\b/gi,
        type: 'terminology',
        severity: 'high',
        explanation: '"Cheap" is listed in Restricted Terms § 2.1 as it undermines the premium SaaS enterprise positioning.',
        suggestion: 'Replace with "cost-effective pricing" or "competitive pricing".',
        guideline_ref: 'Approved Terms § 2.1 — Prohibited: cheap, affordable, budget',
        preferredReplacement: 'cost-effective pricing',
      },
      {
        pattern: /since\s+2021|founded\s+in\s+2021|established\s+in\s+2020/gi,
        type: 'outdated_info',
        severity: 'high',
        explanation: 'BrandSync AI was founded in 2022. Citing 2021 is factually inaccurate.',
        suggestion: 'Replace with "Empowering brands since 2022".',
        guideline_ref: 'Company Info § 1.3 — Founded: 2022',
        preferredReplacement: 'Empowering brands since 2022',
      },
      {
        pattern: /guys,?\s+you've\s+gotta\s+try\s+this|hey\s+guys|check\s+this\s+out/gi,
        type: 'tone',
        severity: 'medium',
        explanation: 'Colloquial tone and gender-exclusive terms like "guys" do not conform with our inclusive corporate voice guidelines.',
        suggestion: 'Replace with "Teams, discover how BrandSync AI can transform your workflow."',
        guideline_ref: 'Voice & Tone § 3.1 — Professional, confident, and inclusive',
        preferredReplacement: 'Teams, discover how BrandSync AI can transform your workflow',
      },
      {
        pattern: /\bClick\s+here\b/gi,
        type: 'accessibility',
        severity: 'low',
        explanation: 'Non-descriptive anchor text "Click here" fails WCAG 2.1 criterion 2.4.4 for screen-reader accessibility.',
        suggestion: 'Replace with descriptive destination text, e.g. "View our pricing plans".',
        guideline_ref: 'Communication Rules § 5.1 — Descriptive link text required',
        preferredReplacement: 'View our pricing plans',
      },
    ];

    rulePatterns.forEach((rule) => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          type: rule.type,
          severity: rule.severity,
          start_index: match.index,
          end_index: match.index + match[0].length,
          original_text: match[0],
          explanation: rule.explanation,
          suggestion: rule.suggestion,
          guideline_ref: rule.guideline_ref,
          status: 'open',
        });
      }
    });

    // Score calculations
    const highCount = issues.filter((i) => i.severity === 'high').length;
    const medCount = issues.filter((i) => i.severity === 'medium').length;
    const lowCount = issues.filter((i) => i.severity === 'low').length;

    const penalty = highCount * 18 + medCount * 8 + lowCount * 4;
    const complianceScore = Math.max(15, 100 - penalty);

    // Build corrected text
    let corrected = text;
    // Replace in reverse order so string indices remain stable
    const sortedIssues = [...issues].sort((a, b) => b.start_index - a.start_index);
    sortedIssues.forEach((issue) => {
      const matchedRule = rulePatterns.find((r) => r.type === issue.type);
      if (matchedRule?.preferredReplacement) {
        corrected =
          corrected.slice(0, issue.start_index) +
          matchedRule.preferredReplacement +
          corrected.slice(issue.end_index);
      }
    });

    const summary =
      issues.length === 0
        ? 'Content strictly adheres to all enterprise brand guidelines. No critical violations found.'
        : `Identified ${issues.length} brand compliance issue${
            issues.length > 1 ? 's' : ''
          }. ${highCount} high-severity issue${highCount > 1 ? 's' : ''} require immediate resolution before release.`;

    // Persist analysis in database
    const analysis = await Analysis.create({
      content_id: content._id,
      compliance_score: complianceScore,
      brand_consistency_score: Math.min(100, complianceScore + 5),
      tone_score: Math.min(100, complianceScore + 10),
      factual_accuracy_score: Math.max(30, complianceScore - 10),
      summary,
      issues,
      corrected_text: corrected,
    });

    // Update content status & link analysis
    content.compliance_score = complianceScore;
    content.status = 'reviewed';
    content.latestAnalysis = analysis._id;
    await content.save();

    // Log Activity
    await Activity.create({
      type: 'analyzed',
      user: user?._id || content.author,
      userName: user?.name || 'System',
      content_id: content._id,
      content_title: content.title,
      details: { score: complianceScore, issueCount: issues.length },
    });

    return analysis;
  }

  async updateIssueStatus(contentId, issueId, status) {
    const analysis = await Analysis.findOne({ content_id: contentId }).sort({ createdAt: -1 });
    if (!analysis) {
      throw new ApiError(404, 'Analysis report not found for this content.');
    }

    const issue = analysis.issues.id(issueId);
    if (!issue) {
      throw new ApiError(404, 'Issue not found.');
    }

    issue.status = status;
    await analysis.save();

    return { id: issueId, status: issue.status };
  }
}

module.exports = new AnalysisService();

