import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { mrmsService, MRMSDashboardData } from '@/services/mrmsService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardSummaryCard from '@/components/dashboard/DashboardSummaryCard';
import DashboardTable from '@/components/dashboard/DashboardTable';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MRMSDashboardData | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const dashboardData = await mrmsService.getDashboard();
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Dashboard | Military Resource Management</title>
      </Head>

      <div className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, {user?.fullName || 'Commander'}. Here&apos;s your operational overview.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Systems Operational
                </span>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm shadow-card rounded-2xl p-5 mb-8 border border-white/50 dark:bg-gray-800/80 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <FunnelIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Status</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Personnel</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data?.summary?.totalSoldiers || 0} Soldiers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Units Active</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data?.summary?.totalUnits || 0} Units</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Missions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data?.summary?.activeMissions || 0} Active</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <DashboardSummaryCard
              title="Total Soldiers"
              value={data?.summary?.totalSoldiers || 0}
              icon={<UsersIcon className="h-6 w-6 text-white" />}
              iconBg="bg-gradient-to-br from-primary-500 to-primary-700"
            />
            <DashboardSummaryCard
              title="Total Units"
              value={data?.summary?.totalUnits || 0}
              icon={<UserGroupIcon className="h-6 w-6 text-white" />}
              iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
            <DashboardSummaryCard
              title="Total Bases"
              value={data?.summary?.totalBases || 0}
              icon={<BuildingOffice2Icon className="h-6 w-6 text-white" />}
              iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
            />
            <DashboardSummaryCard
              title="Equipment Items"
              value={data?.summary?.totalEquipment || 0}
              icon={<WrenchScrewdriverIcon className="h-6 w-6 text-white" />}
              iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
            />
            <DashboardSummaryCard
              title="Active Missions"
              value={data?.summary?.activeMissions || 0}
              icon={<RocketLaunchIcon className="h-6 w-6 text-white" />}
              iconBg="bg-gradient-to-br from-red-500 to-rose-700"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <DashboardCard title="Equipment by Type">
              <DashboardChart
                type="pie"
                data={{
                  labels: data?.equipmentByType?.map((item) => item.type) || [],
                  datasets: [
                    {
                      data: data?.equipmentByType?.map((item) => item.count) || [],
                      backgroundColor: [
                        '#6366f1', // indigo
                        '#10b981', // emerald
                        '#f59e0b', // amber
                        '#ef4444', // red
                        '#8b5cf6', // violet
                      ],
                    },
                  ],
                }}
              />
            </DashboardCard>

            <DashboardCard title="Equipment by Status">
              <DashboardChart
                type="bar"
                data={{
                  labels: data?.equipmentByStatus?.map((item) => item.status) || [],
                  datasets: [
                    {
                      label: 'Count',
                      data: data?.equipmentByStatus?.map((item) => item.count) || [],
                      backgroundColor: '#6366f1',
                    },
                  ],
                }}
              />
            </DashboardCard>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* System Alerts */}
            {data?.alerts && data.alerts.length > 0 && (
              <DashboardCard
                title="System Alerts"
                action={null}
              >
                <div className="space-y-3">
                  {data.alerts.map((alert: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200"
                    >
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">{alert.type}</p>
                        <p className="text-sm text-red-700">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}
          </div>

          {/* Personnel and Missions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <DashboardCard
              title="Recent Soldiers"
              action={
                <Link href="/soldiers" className="text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors flex items-center gap-1">
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </Link>
              }
            >
              <DashboardTable
                headers={['Service ID', 'Name', 'Rank', 'Unit', 'Status']}
                data={
                  data?.recentSoldiers?.map((soldier: any) => [
                    soldier.serviceId || '-',
                    `${soldier.firstName} ${soldier.lastName}` || '-',
                    soldier.rank?.name || '-',
                    soldier.unit?.name || '-',
                    <span
                      key={soldier._id}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        soldier.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : soldier.status === 'Leave'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                      }`}
                    >
                      {soldier.status}
                    </span>,
                  ]) || []
                }
                icon={<UsersIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                emptyMessage="No recent soldiers"
              />
            </DashboardCard>

            <DashboardCard
              title="Recent Missions"
              action={
                <Link href="/missions" className="text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors flex items-center gap-1">
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </Link>
              }
            >
              <DashboardTable
                headers={['Code', 'Name', 'Status', 'Priority', 'Commander']}
                data={
                  data?.recentMissions?.map((mission: any) => [
                    mission.code || '-',
                    mission.name || '-',
                    <span
                      key={mission._id}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        mission.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : mission.status === 'Completed'
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                      }`}
                    >
                      {mission.status}
                    </span>,
                    <span
                      key={`${mission._id}-priority`}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        mission.priority === 'Critical'
                          ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                          : mission.priority === 'High'
                          ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
                          : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                      }`}
                    >
                      {mission.priority}
                    </span>,
                    mission.commander ? `${mission.commander.firstName} ${mission.commander.lastName}` : '-',
                  ]) || []
                }
                icon={<RocketLaunchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                emptyMessage="No recent missions"
              />
            </DashboardCard>
          </div>

          {/* Equipment Status */}
          <DashboardCard
            title="Equipment Status Overview"
            action={
              <Link href="/equipment" className="text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors flex items-center gap-1">
                View all
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>
            }
          >
            <DashboardTable
              headers={['Serial Number', 'Name', 'Type', 'Status', 'Condition', 'Maintenance Due']}
              data={
                data?.recentEquipment?.map((item: any) => [
                  item.serialNumber || '-',
                  item.name || '-',
                  item.type || '-',
                  <span
                    key={item._id}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : item.status === 'Maintenance'
                        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    }`}
                  >
                    {item.status}
                  </span>,
                  <span
                    key={`${item._id}-cond`}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      item.condition === 'Excellent'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : item.condition === 'Good'
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                        : item.condition === 'Fair'
                        ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    }`}
                  >
                    {item.condition}
                  </span>,
                  item.nextMaintenanceDate
                    ? format(new Date(item.nextMaintenanceDate), 'MMM d, yyyy')
                    : '-',
                ]) || []
              }
              icon={<WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
              emptyMessage="No equipment found"
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;