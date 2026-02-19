import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { UserCircleIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ProfilePage = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: PasswordChangeSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        const response = await authService.changePassword(values.currentPassword, values.newPassword);
        toast.success(response.message || 'Password changed successfully');
        resetForm();
      } catch (error: any) {
        console.error('Password change error:', error);
        
        // Handle API error response
        if (error.response) {
          const errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              'Failed to change password';
          toast.error(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('No response from server. Please try again later.');
        } else {
          // Something happened in setting up the request
          toast.error(error.message || 'Failed to change password');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!isInitialized) return <LoadingScreen />;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Not Authenticated</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please log in to view your profile</p>
          <Link href="/login" className="mt-4 btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | MRMS</title>
      </Head>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="page-title">Profile</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
          </motion.div>

          {/* Profile Card Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p className="text-primary-100 text-sm">{user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur mt-1.5">
                  {user.role === 'BaseCommander' ? 'Base Commander' : user.role === 'LogisticsOfficer' ? 'Logistics Officer' : user.role}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                className={`${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                onClick={() => setActiveTab('profile')}
              >
                <UserCircleIcon className="h-4 w-4" />
                Profile Information
              </button>
              <button
                className={`${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                onClick={() => setActiveTab('password')}
              >
                <KeyIcon className="h-4 w-4" />
                Change Password
              </button>
            </nav>
          </div>

          {/* Profile Information */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="form-card overflow-hidden"
            >
              <div className="px-6 py-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-primary-500" />
                  User Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Personal details and application access
                </p>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <dl className="divide-y divide-gray-50 dark:divide-gray-700">
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.fullName}
                    </dd>
                  </div>
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.username}
                    </dd>
                  </div>
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.role === 'Admin' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-800">
                          Admin
                        </span>
                      )}
                      {user.role === 'BaseCommander' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800">
                          Base Commander
                        </span>
                      )}
                      {user.role === 'LogisticsOfficer' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800">
                          Logistics Officer
                        </span>
                      )}
                    </dd>
                  </div>
                  {user.assignedBase && (
                    <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Base</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {user.assignedBase}
                      </dd>
                    </div>
                  )}
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.active ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                          Inactive
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="form-card overflow-hidden"
            >
              <div className="px-6 py-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                  <KeyIcon className="h-5 w-5 text-primary-500" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your password to keep your account secure</p>
                <form onSubmit={passwordFormik.handleSubmit}>
                  <div className="space-y-5 max-w-md">
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password <span className="form-required">*</span>
                      </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className={`form-input ${
                            passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={passwordFormik.values.currentPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                        />
                        {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                          <p className="form-error">{passwordFormik.errors.currentPassword}</p>
                        )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword" className="form-label">
                        New Password <span className="form-required">*</span>
                      </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className={`form-input ${
                            passwordFormik.touched.newPassword && passwordFormik.errors.newPassword
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={passwordFormik.values.newPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                        />
                        {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                          <p className="form-error">{passwordFormik.errors.newPassword}</p>
                        )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password <span className="form-required">*</span>
                      </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-input ${
                            passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={passwordFormik.values.confirmPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                        />
                        {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                          <p className="form-error">{passwordFormik.errors.confirmPassword}</p>
                        )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading || !passwordFormik.isValid || passwordFormik.isSubmitting}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;