import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { missionService } from '@/services/mrmsService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardTable from '@/components/dashboard/DashboardTable';
import toast from 'react-hot-toast';

const MissionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchMissions();
  }, [user]);

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const response = await missionService.getMissions({ page: 1, limit: 50 });
      setMissions(response.missions || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Paused':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'High':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      <Head>
        <title>Missions | MRMS</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Missions</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage military missions</p>
              </div>
              {user?.role === 'Admin' && (
                <Link href="/missions/new" className="btn btn-primary flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Create Mission
                </Link>
              )}
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-card rounded-2xl p-6 mb-8 border border-white/50 dark:border-gray-700/50"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <RocketLaunchIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Missions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <DashboardCard title="Missions List">
            <DashboardTable
              headers={['Mission Code', 'Name', 'Type', 'Status', 'Priority', 'Commander', 'Actions']}
              data={missions.map((mission: any) => [
                mission.code || '-',
                mission.name || '-',
                mission.type || '-',
                <span key={mission._id} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </span>,
                <span key={`${mission._id}-priority`} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityColor(mission.priority)}`}>
                  {mission.priority}
                </span>,
                mission.commander ? `${mission.commander.firstName} ${mission.commander.lastName}` : '-',
                <Link key={`${mission._id}-link`} href={`/missions/${mission._id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                  View
                </Link>
              ])}
              icon={<RocketLaunchIcon className="h-5 w-5" />}
              emptyMessage="No missions found"
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default MissionsPage;
