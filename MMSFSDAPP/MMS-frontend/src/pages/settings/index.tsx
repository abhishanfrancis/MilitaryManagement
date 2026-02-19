import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { SystemSettings } from '@/services/settingsService';

// Mock settings data
const mockSettings: SystemSettings = {
  systemName: 'Military Asset Management System',
  organizationName: 'Department of Defense',
  logo: '/logo.png',
  theme: 'default',
  defaultCurrency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timezone: 'America/New_York',
  emailNotifications: true,
  maintenanceMode: false,
  assetTypes: ['Weapon', 'Vehicle', 'Equipment', 'Ammunition', 'Medical', 'Food'],
  bases: ['Base Alpha', 'Base Bravo', 'Base Charlie'],
};

const SettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [newAssetType, setNewAssetType] = useState('');
  const [newBase, setNewBase] = useState('');

  // Check if user has admin access
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to access this page');
      router.push('/dashboard');
    }
  }, [user, router]);

  // Load settings
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSaveSettings = () => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setIsLoading(false);
    }, 500);
  };

  const handleAddAssetType = () => {
    if (!newAssetType.trim()) {
      toast.error('Please enter an asset type');
      return;
    }

    if (settings.assetTypes.includes(newAssetType.trim())) {
      toast.error('Asset type already exists');
      return;
    }

    setSettings({
      ...settings,
      assetTypes: [...settings.assetTypes, newAssetType.trim()],
    });
    setNewAssetType('');
    toast.success('Asset type added successfully');
  };

  const handleRemoveAssetType = (type: string) => {
    setSettings({
      ...settings,
      assetTypes: settings.assetTypes.filter(t => t !== type),
    });
    toast.success('Asset type removed successfully');
  };

  const handleAddBase = () => {
    if (!newBase.trim()) {
      toast.error('Please enter a base name');
      return;
    }

    if (settings.bases.includes(newBase.trim())) {
      toast.error('Base already exists');
      return;
    }

    setSettings({
      ...settings,
      bases: [...settings.bases, newBase.trim()],
    });
    setNewBase('');
    toast.success('Base added successfully');
  };

  const handleRemoveBase = (base: string) => {
    setSettings({
      ...settings,
      bases: settings.bases.filter(b => b !== base),
    });
    toast.success('Base removed successfully');
  };

  const handleToggleMaintenanceMode = () => {
    setSettings({
      ...settings,
      maintenanceMode: !settings.maintenanceMode,
    });
    toast.success(`Maintenance mode ${settings.maintenanceMode ? 'disabled' : 'enabled'}`);
  };

  if (isLoading) return <LoadingScreen />;

  // If not admin, don't render the page
  if (user && user.role !== 'Admin') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Settings | Military Asset Management</title>
      </Head>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.h1 className="page-title mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>Settings</motion.h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'general'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button
                className={`${
                  activeTab === 'assets'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('assets')}
              >
                Asset Types
              </button>
              <button
                className={`${
                  activeTab === 'bases'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('bases')}
              >
                Bases
              </button>
              <button
                className={`${
                  activeTab === 'system'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('system')}
              >
                System
              </button>
            </nav>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="form-card overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  General Settings
                </h3>

                <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="systemName" className="form-label">
                      System Name
                    </label>
                      <input
                        type="text"
                        id="systemName"
                        name="systemName"
                        className="form-input"
                        value={settings.systemName}
                        onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                      />
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="organizationName" className="form-label">
                      Organization Name
                    </label>
                      <input
                        type="text"
                        id="organizationName"
                        name="organizationName"
                        className="form-input"
                        value={settings.organizationName}
                        onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                      />
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="defaultCurrency" className="form-label">
                      Default Currency
                    </label>
                      <select
                        id="defaultCurrency"
                        name="defaultCurrency"
                        className="form-select"
                        value={settings.defaultCurrency}
                        onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="theme" className="form-label">
                      Theme
                    </label>
                      <select
                        id="theme"
                        name="theme"
                        className="form-select"
                        value={settings.theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      >
                        <option value="default">Default</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="dateFormat" className="form-label">
                      Date Format
                    </label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        className="form-select"
                        value={settings.dateFormat}
                        onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="timeFormat" className="form-label">
                      Time Format
                    </label>
                      <select
                        id="timeFormat"
                        name="timeFormat"
                        className="form-select"
                        value={settings.timeFormat}
                        onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                      >
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </select>
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="timezone" className="form-label">
                      Timezone
                    </label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="form-select"
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Enable email notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Asset Types */}
          {activeTab === 'assets' && (
            <div className="form-card overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Asset Types
                </h3>

                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      className="form-input flex-1 rounded-r-none"
                      placeholder="Add new asset type"
                      value={newAssetType}
                      onChange={(e) => setNewAssetType(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary rounded-l-none"
                      onClick={handleAddAssetType}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {settings.assetTypes.map((type) => (
                    <div
                      key={type}
                      className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{type}</p>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleRemoveAssetType(type)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bases */}
          {activeTab === 'bases' && (
            <div className="form-card overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Bases
                </h3>

                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      className="form-input flex-1 rounded-r-none"
                      placeholder="Add new base"
                      value={newBase}
                      onChange={(e) => setNewBase(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary rounded-l-none"
                      onClick={handleAddBase}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {settings.bases.map((base) => (
                    <div
                      key={base}
                      className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{base}</p>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleRemoveBase(base)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="form-card overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  System Settings
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        When enabled, only administrators can access the system
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className={`${
                          settings.maintenanceMode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        } inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                        onClick={handleToggleMaintenanceMode}
                      >
                        {settings.maintenanceMode ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">System Information</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">1.0.0</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Database Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Connected
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">API Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Operational
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;