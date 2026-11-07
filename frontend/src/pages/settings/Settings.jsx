import { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  updateProfile,
  changePassword,
  updatePreferences,
  getMe,
} from '../../services/authService.js';
import toast from 'react-hot-toast';
import { User, ShieldCheck, Bell, Moon, Sun, Building2, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [org, setOrg] = useState(user?.organisation || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Preferences state
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notificationsEnabled ?? true
  );
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.emailNotifications ?? true
  );
  const [pushNotifications, setPushNotifications] = useState(
    user?.preferences?.pushNotifications ?? false
  );
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Sync user state on mount from /auth/me
  useEffect(() => {
    async function loadFreshUser() {
      try {
        const fresh = await getMe();
        if (fresh) {
          setName(fresh.name || '');
          setOrg(fresh.organisation || '');
          if (fresh.preferences) {
            setNotificationsEnabled(fresh.preferences.notificationsEnabled ?? true);
            setEmailNotifications(fresh.preferences.emailNotifications ?? true);
            setPushNotifications(fresh.preferences.pushNotifications ?? false);
            setTheme(fresh.preferences.theme || 'light');
          }
          updateUser(fresh);
        }
      } catch {
        // Fallback to local context user if offline
      }
    }
    loadFreshUser();
  }, [updateUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await updateProfile({
        name: name.trim(),
        organisation: org.trim(),
      });
      updateUser(updated);
      toast.success('Organization profile updated in MongoDB');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await changePassword({ currentPassword, newPassword });
      toast.success(res.message || 'Password successfully updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePreferencesSave = async (overrides = {}) => {
    try {
      setSavingPrefs(true);
      const newPrefs = {
        notificationsEnabled,
        emailNotifications,
        pushNotifications,
        theme,
        ...overrides,
      };
      const res = await updatePreferences(newPrefs);
      updateUser({ preferences: res.preferences });
      toast.success('Preferences saved to database');
    } catch (err) {
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Settings & Brand Governance"
        description="Configure your enterprise account, security credentials, and compliance notification rules."
      />

      <Tabs
        tabs={[
          { value: 'profile', label: 'Profile & Org', icon: <User size={14} /> },
          { value: 'security', label: 'Security & Auth', icon: <ShieldCheck size={14} /> },
          { value: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
          { value: 'appearance', label: 'Theme & Display', icon: <Sun size={14} /> },
        ]}
        defaultTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={16} className="text-[#244C3A]" />
            <h3 className="text-sm font-bold text-[#252B27]">Profile & Enterprise Organization</h3>
          </div>
          <p className="text-xs text-[#737B75] mb-5">
            Manage your personal profile and registered enterprise workspace name.
          </p>

          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />

            <Input
              label="Enterprise Email Address"
              value={user?.email || ''}
              disabled
              hint="Corporate email addresses are bound to your account and cannot be modified directly."
            />

            <Input
              label="Organization / Workspace Name"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g. BrandSync AI Enterprise"
            />

            <div className="bg-[#F7F8F4] border border-[#DCE3DA] rounded-md p-3 text-xs text-[#737B75] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#252B27]">Assigned Role: </span>
                <span className="uppercase text-[11px] font-bold text-[#244C3A] bg-[#EBF2ED] px-2 py-0.5 rounded ml-1">
                  {user?.role?.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-[11px] text-[#737B75]">Roles are managed by Enterprise Admins.</span>
            </div>

            <div className="pt-2">
              <Button variant="primary" type="submit" size="sm" loading={savingProfile}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-[#244C3A]" />
            <h3 className="text-sm font-bold text-[#252B27]">Security & Password</h3>
          </div>
          <p className="text-xs text-[#737B75] mb-5">
            Update your authentication credentials. Passwords are encrypted with bcrypt inside MongoDB.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
            />

            <div className="pt-2">
              <Button variant="primary" type="submit" size="sm" loading={savingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-[#244C3A]" />
            <h3 className="text-sm font-bold text-[#252B27]">Governance Notification Preferences</h3>
          </div>
          <p className="text-xs text-[#737B75] mb-5">
            Configure how and when BrandSync AI alerts you about compliance violations and review approvals.
          </p>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3DA] bg-[#F7F8F4]/50">
              <div>
                <p className="text-xs font-semibold text-[#252B27]">Enable In-App Governance Alerts</p>
                <p className="text-[11px] text-[#737B75]">
                  Receive notifications inside the dashboard when content requires attention.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => {
                  setNotificationsEnabled(e.target.checked);
                  handlePreferencesSave({ notificationsEnabled: e.target.checked });
                }}
                className="w-4 h-4 accent-[#244C3A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3DA] bg-[#F7F8F4]/50">
              <div>
                <p className="text-xs font-semibold text-[#252B27]">Email Violation Digest</p>
                <p className="text-[11px] text-[#737B75]">
                  Receive email updates whenever high-severity brand violations are flagged.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => {
                  setEmailNotifications(e.target.checked);
                  handlePreferencesSave({ emailNotifications: e.target.checked });
                }}
                className="w-4 h-4 accent-[#244C3A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3DA] bg-[#F7F8F4]/50">
              <div>
                <p className="text-xs font-semibold text-[#252B27]">Browser Push Notifications</p>
                <p className="text-[11px] text-[#737B75]">
                  Instant browser toasts when review requests are submitted for your approval.
                </p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => {
                  setPushNotifications(e.target.checked);
                  handlePreferencesSave({ pushNotifications: e.target.checked });
                }}
                className="w-4 h-4 accent-[#244C3A] cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                loading={savingPrefs}
                onClick={() => handlePreferencesSave()}
              >
                Save Preferences
              </Button>
              <span className="text-[11px] text-[#737B75] flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#244C3A]" /> Changes sync immediately with MongoDB
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Appearance */}
      {activeTab === 'appearance' && (
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Sun size={16} className="text-[#244C3A]" />
            <h3 className="text-sm font-bold text-[#252B27]">Theme & Workspace Interface</h3>
          </div>
          <p className="text-xs text-[#737B75] mb-5">
            Choose your preferred interface theme for BrandSync AI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div
              onClick={() => {
                setTheme('light');
                handlePreferencesSave({ theme: 'light' });
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-[#244C3A] bg-[#EBF2ED]/30'
                  : 'border-[#DCE3DA] hover:border-[#CBD4C8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#252B27] flex items-center gap-1.5">
                  <Sun size={15} className="text-[#D5A45B]" /> Light Standard (Recommended)
                </span>
                {theme === 'light' && (
                  <span className="w-2 h-2 rounded-full bg-[#244C3A]" />
                )}
              </div>
              <p className="text-[11px] text-[#737B75]">
                Optimized for high-contrast enterprise brand governance with Soft Sage and Forest Green accents.
              </p>
            </div>

            <div
              onClick={() => {
                setTheme('dark');
                handlePreferencesSave({ theme: 'dark' });
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-[#244C3A] bg-[#EBF2ED]/30'
                  : 'border-[#DCE3DA] hover:border-[#CBD4C8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#252B27] flex items-center gap-1.5">
                  <Moon size={15} className="text-[#244C3A]" /> Dark Contrast
                </span>
                {theme === 'dark' && (
                  <span className="w-2 h-2 rounded-full bg-[#244C3A]" />
                )}
              </div>
              <p className="text-[11px] text-[#737B75]">
                Low-light workspace theme for evening reviews and extended audit workflows.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
