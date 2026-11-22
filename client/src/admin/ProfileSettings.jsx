import React, { useState } from 'react';
import {
  UserCheck,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileSettings = () => {
  const { admin } = useAuth();

  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileStatus, setProfileStatus] = useState({ error: null, success: null, loading: false });
  const [passwordStatus, setPasswordStatus] = useState({ error: null, success: null, loading: false });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileStatus({ error: null, success: null, loading: true });

    try {
      const res = await authService.updateProfile(profileData);
      if (res.data?.success) {
        setProfileStatus({
          error: null,
          success: 'Admin profile updated successfully.',
          loading: false,
        });
      }
    } catch (err) {
      setProfileStatus({
        error: err.response?.data?.message || 'Error updating profile.',
        success: null,
        loading: false,
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: null, success: null, loading: true });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({
        error: 'New password and confirmation do not match.',
        success: null,
        loading: false,
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordStatus({
        error: 'New password must be at least 8 characters long.',
        success: null,
        loading: false,
      });
      return;
    }

    try {
      const res = await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setPasswordStatus({
          error: null,
          success: 'Password updated successfully. Please use your new password next time you login.',
          loading: false,
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setPasswordStatus({
        error: err.response?.data?.message || 'Failed to update password.',
        success: null,
        loading: false,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#17324D]">
          Administrator Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your account credentials, security preferences, and administrative details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
        {/* Profile Info Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <UserCheck className="w-4 h-4 text-[#147D55]" />
            <h2 className="font-bold text-base text-[#17324D]">Profile Credentials</h2>
          </div>

          {profileStatus.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileStatus.error}</span>
            </div>
          )}

          {profileStatus.success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileStatus.success}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Administrator Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div className="p-3 bg-[#F5F8F6] rounded border border-gray-200 text-xs space-y-1">
              <span className="text-gray-500 block">Assigned Role:</span>
              <span className="font-bold text-[#147D55] uppercase">{admin?.role || 'ADMIN'}</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileStatus.loading}
                className="w-full py-2 px-4 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                {profileStatus.loading ? 'Updating Profile...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Lock className="w-4 h-4 text-[#147D55]" />
            <h2 className="font-bold text-base text-[#17324D]">Change Password</h2>
          </div>

          {passwordStatus.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordStatus.error}</span>
            </div>
          )}

          {passwordStatus.success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordStatus.success}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                New Password (min. 8 characters)
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordStatus.loading}
                className="w-full py-2 px-4 bg-[#17324D] hover:bg-[#0f2234] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                {passwordStatus.loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
