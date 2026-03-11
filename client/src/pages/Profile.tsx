import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useUpdateProfileMutation, useChangePasswordMutation, useUserComments } from '../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const { data: userComments, isLoading: commentsLoading, isError: commentsError } = useUserComments(user?._id || '');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    yob: user?.yob || '',
    gender: user?.gender || 'male',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (updateProfileMutation.isSuccess) {
      setProfileSuccess(true);
      const t = setTimeout(() => setProfileSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [updateProfileMutation.isSuccess]);

  useEffect(() => {
    if (changePasswordMutation.isSuccess) {
      setPasswordSuccess(true);
      const t = setTimeout(() => setPasswordSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [changePasswordMutation.isSuccess]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        userId: user._id,
        data: profileData,
      });
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        userId: user._id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-all flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="yob" className="block text-sm font-semibold text-gray-700 mb-2">
                  Year of Birth
                </label>
                <input
                  id="yob"
                  name="yob"
                  type="text"
                  required
                  value={profileData.yob}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={profileData.gender}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {updateProfileMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                Profile update failed. Please try again.
              </div>
            )}

            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm transition-opacity duration-500">
                ✓ Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="cursor-pointer w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Security</h2>

          {!showPasswordForm ? (
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setPasswordSuccess(false);
              }}
              className="cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              {changePasswordMutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  Password change failed. Please check your current password.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="cursor-pointer flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
                >
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="cursor-pointer flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {passwordSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm transition-opacity duration-500">
              ✓ Password changed successfully!
            </div>
          )}
        </div>

        {/* My Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-rose-500 mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : commentsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              Failed to load reviews. Please try again later.
            </div>
          ) : userComments && userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/perfumes/${comment.perfume._id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 hover:text-rose-600 transition-colors">
                        {comment.perfume.perfumeName}
                      </h3>
                      <p className="text-sm text-gray-600">{comment.perfume.brand.brandName}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                      <span className="text-amber-500">⭐</span>
                      <span className="font-bold text-amber-700">{comment.rating}/3</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;