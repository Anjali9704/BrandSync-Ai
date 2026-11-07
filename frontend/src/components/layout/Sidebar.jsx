import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scan, BookOpen, Library, ClipboardCheck,
  BarChart3, Users, Settings, LogOut, ChevronLeft, ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../utils/constants.js';

const allNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: null },
  { to: '/analysis', label: 'Content Analysis', icon: Scan, roles: null },
  { to: '/guidelines', label: 'Brand Guidelines', icon: BookOpen, roles: null },
  { to: '/content', label: 'Content Library', icon: Library, roles: null },
  {
    to: '/review', label: 'Review & Approval', icon: ClipboardCheck,
    roles: [ROLES.REVIEWER, ROLES.BRAND_MANAGER, ROLES.ADMIN],
  },
  {
    to: '/reports', label: 'Reports & Analytics', icon: BarChart3,
    roles: [ROLES.BRAND_MANAGER, ROLES.ADMIN],
  },
  {
    to: '/team', label: 'Team Management', icon: Users,
    roles: [ROLES.ADMIN],
  },
  { to: '/settings', label: 'Settings', icon: Settings, roles: null },
];

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = allNavItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#DCE3DA] shrink-0 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-[#244C3A] text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck size={18} strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#244C3A] tracking-tight leading-none">BrandSync AI</div>
            <div className="text-[11px] font-medium text-[#737B75] mt-1 truncate">{user?.organisation || 'Brand Governance'}</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2.5" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-md transition-all duration-150 group font-medium text-xs sm:text-sm',
                    collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2',
                    isActive
                      ? 'bg-[#EBF2ED] text-[#244C3A] font-semibold'
                      : 'text-[#737B75] hover:text-[#252B27] hover:bg-[#F7F8F4]',
                  ].join(' ')
                }
                aria-label={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className={`shrink-0 transition-colors ${isActive ? 'text-[#244C3A]' : 'text-[#737B75] group-hover:text-[#252B27]'
                        }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile & Logout */}
      <div className="border-t border-[#DCE3DA] p-2.5 shrink-0 bg-[#F7F8F4]/50">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF2ED] border border-[#CBD4C8] text-[#244C3A] flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#252B27] truncate">{user?.name}</div>
              <div className="text-[11px] text-[#737B75] capitalize truncate">{user?.role?.replace(/_/g, ' ')}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={[
            'flex items-center gap-2.5 w-full rounded-md py-2 text-xs font-medium text-[#737B75] hover:text-[#962317] hover:bg-[#FDF2F2] transition-colors',
            collapsed ? 'justify-center px-2' : 'px-2.5',
          ].join(' ')}
          aria-label="Logout"
        >
          <LogOut size={15} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          'hidden lg:flex flex-col bg-white border-r border-[#DCE3DA] sidebar-transition shrink-0 relative shadow-sm',
          collapsed ? 'w-16' : 'w-60',
        ].join(' ')}
      >
        {sidebarContent}

        {/* Collapse button */}
        <button
          onClick={onCollapse}
          className="absolute -right-3 top-16 w-6 h-6 bg-white border border-[#DCE3DA] rounded-full flex items-center justify-center text-[#737B75] hover:text-[#244C3A] hover:border-[#244C3A] transition-colors shadow-sm z-20 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-[#252B27]/40 backdrop-blur-xs" onClick={onMobileClose} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white border-r border-[#DCE3DA] shadow-xl animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
