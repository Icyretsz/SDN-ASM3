import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useUpdateProfileMutation, useChangePasswordMutation, useUserComments } from '../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const { data: userComments, isLoading: commentsLoading, isError: commentsError, error: commentsErrorData } = useUserComments(user?._id || '');

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        userId: user._id,
        data: profileData,
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
      alert('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={profileData.name}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={profileData.email}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="yob" className="block text-sm font-medium text-gray-700">
              Year of Birth
            </label>
            <input
              id="yob"
              name="yob"
              type="text"
              required
              value={profileData.yob}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={profileData.gender}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {updateProfileMutation.isError && (
            <div className="text-red-600 text-sm">
              {updateProfileMutation.error?.response?.data?.message || 'Profile update failed. Please try again.'}
            </div>
          )}

          {updateProfileMutation.isSuccess && (
            <div className="text-green-600 text-sm">
              Profile updated successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {changePasswordMutation.isError && (
              <div className="text-red-600 text-sm">
                {changePasswordMutation.error?.response?.data?.message || 'Password change failed. Please check your current password.'}
              </div>
            )}

            {changePasswordMutation.isSuccess && (
              <div className="text-green-600 text-sm">
                Password changed successfully!
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">My Comments</h2>
        {commentsLoading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : commentsError ? (
          <div className="text-red-600 text-sm">
            {commentsErrorData?.response?.data?.message || 'Failed to load comments. Please try again later.'}
          </div>
        ) : userComments && userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment) => (
              <div key={comment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-lg text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => navigate(`/perfume/${comment.perfume._id}`)}
                    >
                      {comment.perfume.perfumeName}
                    </h3>
                    <p className="text-sm text-gray-500">{comment.perfume.brand.brandName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <p className="text-xs text-gray-400">
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
          <p className="text-gray-500">You haven't written any comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
