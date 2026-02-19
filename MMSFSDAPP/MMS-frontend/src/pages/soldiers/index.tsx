import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { soldierService } from '@/services/mrmsService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardTable from '@/components/dashboard/DashboardTable';
import toast from 'react-hot-toast';

const SoldiersPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [soldiers, setSoldiers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchSoldiers();
  }, [user]);

  const fetchSoldiers = async () => {
    setIsLoading(true);
    try {
      const response = await soldierService.getSoldiers({ search, page: 1, limit: 50 });
      setSoldiers(response.soldiers || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load soldiers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSoldiers();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Soldiers | MRMS</title>
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
                <h1 className="page-title">Soldiers</h1>
                <p className="mt-1 text-sm text-gray-500">Manage military personnel</p>
              </div>
              {user?.role === 'Admin' && (
                <Link href="/soldiers/new" className="btn btn-primary flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Soldier
                </Link>
              )}
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="form-card p-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name or service ID..."
                    className="form-input pl-10 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary whitespace-nowrap flex items-center justify-center gap-2">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  Search
                </button>
              </form>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="form-card p-6 mb-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Soldiers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <DashboardCard title="Soldiers List">
            <DashboardTable
              headers={['Service ID', 'Name', 'Rank', 'Unit', 'Status', 'Actions']}
              data={soldiers.map((soldier: any) => [
                soldier.serviceId || '-',
                `${soldier.firstName} ${soldier.lastName}` || '-',
                soldier.rank?.name || soldier.rank?.abbreviation || '-',
                soldier.unit?.name || '-',
                <span key={`status-${soldier._id}`} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  soldier.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  soldier.status === 'Deployed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                  soldier.status === 'OnLeave' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                  'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {soldier.status}
                </span>,
                <Link key={`action-${soldier._id}`} href={`/soldiers/${soldier._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View
                </Link>
              ])}
              icon={<UsersIcon className="h-5 w-5" />}
              emptyMessage="No soldiers found"
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default SoldiersPage;
