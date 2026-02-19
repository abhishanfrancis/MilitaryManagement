import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchMissions();
  }, [user]);

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const response = await missionService.getMissions({ search, page: 1, limit: 50 });
      setMissions(response.missions || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMissions();
  };

  if (isLoading) return <LoadingScreen />;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Planning: 'bg-purple-50 text-purple-700',
      Active: 'bg-emerald-50 text-emerald-700',
      Completed: 'bg-blue-50 text-blue-700',
      Cancelled: 'bg-red-50 text-red-700',
      OnHold: 'bg-yellow-50 text-yellow-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Critical: 'bg-red-50 text-red-700',
      High: 'bg-orange-50 text-orange-700',
      Medium: 'bg-yellow-50 text-yellow-700',
      Low: 'bg-green-50 text-green-700',
    };
    return colors[priority] || 'bg-gray-50 text-gray-700';
  };

  return (
    <>
      <Head>
        <title>Missions | MRMS</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">Missions</h1>
                <p className="mt-1 text-sm text-gray-500">Manage military missions and operations</p>
              </div>
              <Link href="/missions/new" className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Create Mission
              </Link>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search by name or code..." className="form-input pl-10 w-full"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
          </motion.div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="form-card p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <RocketLaunchIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Missions</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <RocketLaunchIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{missions.filter(m => m.status === 'Active').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <RocketLaunchIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Planning</p>
                  <p className="text-2xl font-bold text-gray-900">{missions.filter(m => m.status === 'Planning').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <RocketLaunchIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{missions.filter(m => m.status === 'Completed').length}</p>
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
                <span key={`${mission._id}-p`} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityColor(mission.priority)}`}>
                  {mission.priority}
                </span>,
                mission.commander ? `${mission.commander.firstName} ${mission.commander.lastName}` : '-',
                <Link key={`${mission._id}-link`} href={`/missions/${mission._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
