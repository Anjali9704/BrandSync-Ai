import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut, CheckCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../services/notificationService.js';
import toast from 'react-hot-toast';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function Navbar({ pageTitle, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fetchNotifs = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      const data = await getNotifications();
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count ?? data.unreadCount ?? 0);
      }
    } catch {
      // Quiet fail on background notification polling
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifs();
    // Poll notifications every 45s
    const interval = setInterval(fetchNotifs, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  useEffect(() => {
    const handler = (e) => {
      if (!notifRef.current?.contains(e.target)) setNotifOpen(false);
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error(err.message || 'Failed to mark notifications');
    }
  };

  const handleMarkSingleRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      toast.error(err.message || 'Failed to update notification');
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error(err.message || 'Failed to delete notification');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-[#DCE3DA] flex items-center px-4 sm:px-6 gap-3 shrink-0 shadow-xs z-10">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md text-[#737B75] hover:text-[#252B27] hover:bg-[#F7F8F4] transition-colors"
        aria-label="Open sidebar menu"
      >
        <Menu size={20} />
      </button>

      {/* Page Title */}
      <h1 className="text-sm font-semibold text-[#252B27] tracking-tight hidden sm:block">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Quick Search Input */}
      <div className="hidden md:flex items-center gap-2 bg-[#F7F8F4] border border-[#DCE3DA] rounded-md px-3 py-1.5 w-56 lg:w-72">
        <Search size={14} className="text-[#737B75] shrink-0" />
        <input
          type="search"
          placeholder="Search guidelines, content, team…"
          className="bg-transparent text-xs text-[#252B27] placeholder-[#9CA39E] outline-none w-full"
          aria-label="Quick search"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              navigate(`/content?search=${encodeURIComponent(e.target.value.trim())}`);
            }
          }}
        />
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setNotifOpen((p) => !p);
            setProfileOpen(false);
          }}
          className="relative p-1.5 rounded-md text-[#737B75] hover:text-[#252B27] hover:bg-[#F7F8F4] transition-colors cursor-pointer"
          aria-label={`Notifications (${unreadCount} unread)`}
          aria-haspopup="true"
          aria-expanded={notifOpen}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#D5A45B] rounded-full ring-2 ring-white" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-[#DCE3DA] rounded-lg shadow-modal z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-[#DCE3DA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#252B27]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-[#D5A45B]/20 text-[#8F6621] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-medium text-[#244C3A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loadingNotifs && notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#737B75]">Loading notifications…</div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#737B75]">
                  <Bell size={24} className="mx-auto mb-2 text-[#CBD4C8]" />
                  No notifications to review
                </div>
              ) : (
                <ul className="divide-y divide-[#DCE3DA]/50">
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      onClick={(e) => !n.read && handleMarkSingleRead(n._id, e)}
                      className={`px-4 py-3 hover:bg-[#F7F8F4] transition-colors cursor-pointer text-left ${
                        !n.read ? 'bg-[#F7F8F4]/70' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? 'bg-[#D5A45B]' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#252B27] truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-[#737B75] leading-relaxed line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[11px] text-[#9CA39E]">
                              {formatTimeAgo(n.createdAt)}
                            </span>
                            <div className="flex items-center gap-2">
                              {!n.read && (
                                <button
                                  onClick={(e) => handleMarkSingleRead(n._id, e)}
                                  className="text-[10px] text-[#244C3A] font-semibold hover:underline"
                                  title="Mark as read"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteNotification(n._id, e)}
                                className="text-[#9CA39E] hover:text-[#962317] p-0.5"
                                title="Delete notification"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Menu */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => {
            setProfileOpen((p) => !p);
            setNotifOpen(false);
          }}
          className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F7F8F4] transition-colors cursor-pointer border border-transparent hover:border-[#DCE3DA]"
          aria-haspopup="true"
          aria-expanded={profileOpen}
          aria-label="User navigation"
        >
          <div className="w-7 h-7 rounded-full bg-[#EBF2ED] text-[#244C3A] border border-[#CBD4C8] flex items-center justify-center font-bold text-xs">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="hidden sm:block text-xs font-medium text-[#252B27] max-w-28 truncate">{user?.name}</span>
          <ChevronDown size={12} className="text-[#737B75] hidden sm:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DCE3DA] rounded-lg shadow-modal z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-[#DCE3DA] bg-[#F7F8F4]/50">
              <div className="text-xs font-semibold text-[#252B27] truncate">{user?.name}</div>
              <div className="text-[11px] text-[#737B75] truncate mt-0.5">{user?.email}</div>
              <div className="text-[10px] uppercase font-bold text-[#244C3A] tracking-wider mt-1">
                {user?.role?.replace(/_/g, ' ')}
              </div>
            </div>
            <ul className="py-1">
              <li>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#252B27] hover:bg-[#F7F8F4] transition-colors text-left"
                >
                  <User size={14} className="text-[#737B75]" />
                  Profile Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#252B27] hover:bg-[#F7F8F4] transition-colors text-left"
                >
                  <Settings size={14} className="text-[#737B75]" />
                  Brand Settings
                </button>
              </li>
              <li className="border-t border-[#DCE3DA] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#962317] hover:bg-[#FDF2F2] transition-colors text-left font-medium"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
