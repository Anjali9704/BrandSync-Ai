# BrandSync AI — Modern Professional SaaS Frontend

> **"One Brand. One Voice. One Standard."**
> AI-Powered Brand Governance Platform built for **Team NOVASTACK** at the **Codenexus India Hackathon** (Problem statement partner: **Inkloom AI**).

---

## 🎨 Visual Identity & Design System

The frontend features a **Modern Professional SaaS** design system:

- **Primary Background**: `#F7F8F4` (Warm Eggshell Canvas)
- **Primary Color**: `#244C3A` (Forest Green — headers, primary buttons, logos)
- **Secondary Accent**: `#D5A45B` (Muted Warm Gold — highlights, badges, trend indicators)
- **Supporting Color**: `#DCE3DA` (Soft Sage — borders, secondary cards, subtle dividers)
- **Text Primary**: `#252B27` (Deep Charcoal Slate — maximum typographic clarity)
- **Text Secondary**: `#737B75` (Muted Slate Sage — secondary labels & timestamps)
- **White**: `#FFFFFF` (Card surfaces, dialogs, dropdowns)

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite (ESM)
- **Language**: JavaScript (JSX only, strict no-TypeScript)
- **Styling**: Tailwind CSS (Bespoke enterprise theme tokens, subtle borders & shadows)
- **Routing**: React Router DOM v6 (Nested layout, RBAC guards, lazy-loading)
- **Icons**: Lucide React
- **Charts**: Recharts (Velocity AreaChart, Status Donut, Violation BarChart)
- **Forms**: React Hook Form
- **Notifications**: react-hot-toast (Branded in `#244C3A` & `#DCE3DA`)
- **HTTP Client**: Axios with centralized request/response interceptors

---

## 📂 Project Structure

```
frontend/
├── .env.example
├── .env
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   │   ├── Badge.jsx             # Severity, status & category badges
    │   │   ├── Button.jsx            # Variants (primary, secondary, danger, ghost, accent, sage)
    │   │   ├── Card.jsx              # Crisp white surface with subtle borders & hover states
    │   │   ├── ConfirmDialog.jsx     # Revocation & delete confirmation dialog
    │   │   ├── EmptyState.jsx        # Clean zero-data placeholder views
    │   │   ├── Input.jsx             # Clean input with icons & validation
    │   │   ├── Loader.jsx            # Forest green animated spinners
    │   │   ├── Modal.jsx             # Accessible dialog with ESC & backdrop handling
    │   │   ├── Select.jsx            # Styled dropdown selector
    │   │   ├── Skeleton.jsx          # Shimmer loading cards & rows
    │   │   ├── Table.jsx             # Sortable data table with empty/loading states
    │   │   ├── Tabs.jsx              # Forest Green underline & counter pill switcher
    │   │   └── Textarea.jsx          # Multiline input with live character counter
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx   # Shell with responsive sidebar & top navbar
    │   │   ├── Navbar.jsx            # Breadcrumb, global search, notif dropdown, profile
    │   │   ├── PageHeader.jsx        # Consistent view header with actions & breadcrumbs
    │   │   └── Sidebar.jsx           # Collapsible desktop menu & mobile drawer
    │   ├── dashboard/
    │   │   ├── ActivityChart.jsx     # Area chart for submissions vs approvals
    │   │   ├── ComplianceChart.jsx   # Donut breakdown by approval status
    │   │   ├── RecentActivity.jsx    # Chronological audit timeline
    │   │   └── StatCard.jsx          # KPI card with weekly trend percentages
    │   ├── analysis/
    │   │   ├── ComplianceScore.jsx   # SVG circular gauge ring for scores
    │   │   ├── ContentForm.jsx       # Submission form with sample loader & char counts
    │   │   ├── CorrectionComparison.jsx # Side-by-side diff comparison
    │   │   ├── HighlightedText.jsx   # Interactive inline highlighted text
    │   │   └── IssueCard.jsx         # Card with severity, explanation & accept/reject actions
    │   └── guidelines/
    │       ├── AssetUploader.jsx     # File upload dropzone & color swatches
    │       ├── GuidelineCard.jsx     # Expandable rule card with items
    │       └── GuidelineForm.jsx     # Modal form for adding/editing guidelines
    ├── context/
    │   ├── AuthContext.jsx           # Authentication state, login/logout, role check
    │   └── ThemeContext.jsx          # Dark/Light theme manager
    ├── pages/
    │   ├── analysis/ContentAnalysis.jsx # Real-time AI checker & review engine
    │   ├── auth/Login.jsx            # Sign-in with demo account one-click selectors
    │   ├── auth/ForgotPassword.jsx   # Reset password flow
    │   ├── content/ContentLibrary.jsx # Filterable content repository
    │   ├── dashboard/Dashboard.jsx   # Main KPI cockpit & quick actions
    │   ├── guidelines/BrandGuidelines.jsx # Centralized guidelines management & assets
    │   ├── reports/Reports.jsx       # Violation analytics & compliance trends
    │   ├── review/ReviewApproval.jsx # Approval queue with accept/change/reject actions
    │   ├── settings/Settings.jsx     # Profile & organization configuration
    │   ├── team/TeamManagement.jsx   # Role-based member administration
    │   └── NotFound.jsx              # 404 handler
    ├── routes/
    │   ├── AppRoutes.jsx             # Code-split route registry
    │   └── ProtectedRoute.jsx        # RBAC route protector
    ├── services/
    │   ├── api/
    │   │   ├── apiEndpoints.js       # Centralized API route dictionary
    │   │   └── axiosInstance.js      # Interceptor-equipped HTTP client
    │   ├── analysisService.js        # Analysis trigger & issue status updater
    │   ├── authService.js            # Login, session, password recovery
    │   ├── contentService.js          # Content repository CRUD
    │   ├── dashboardService.js       # Metrics & activity service
    │   ├── guidelineService.js       # Guidelines & digital assets service
    │   ├── reportService.js          # Reports summary & trend queries
    │   ├── reviewService.js          # Review queue decisions & history
    │   └── teamService.js            # Member invite, role update, deletion
    ├── styles/
    │   └── index.css                 # Base theme styles, scrollbars, focus rings
    ├── utils/
    │   ├── constants.js              # Roles, issue types, severities, colors
    │   ├── diffText.js               # Word-level LCS text diff engine
    │   ├── formatDate.js             # Date & relative time formatters
    │   └── validators.js             # Form validation helpers
    ├── App.jsx
    └── main.jsx
```

---

## ⚡ Quick Start

### 1. Configure Environment (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_USE_MOCK=false
```

### 2. Run Development Server
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 👥 Demo Personas (Password: `Pass@123`)

| Role | Email | Permissions |
| :--- | :--- | :--- |
| **Admin** | `admin@brandsync.ai` | Complete governance access, user administration & settings |
| **Brand Manager** | `manager@brandsync.ai` | Guidelines management, reports analytics, review authorizations |
| **Reviewer** | `reviewer@brandsync.ai` | Content review queue, sign-off and change requests |
| **Content Creator** | `creator@brandsync.ai` | Content analysis, guidelines viewer, content library |
| **External Agency** | `agency@brandsync.ai` | Content analysis, guidelines viewer, content library |
