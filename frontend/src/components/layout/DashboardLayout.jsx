import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analysis': 'Content Analysis',
  '/guidelines': 'Brand Guidelines',
  '/content': 'Content Library',
  '/review': 'Review & Approval',
  '/reports': 'Reports & Analytics',
  '/team': 'Team Management',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const title = pageTitles[pathname] || 'Brand Governance';

  return (
    <div className="flex h-screen bg-[#F7F8F4] overflow-hidden text-[#252B27]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          pageTitle={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
