import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { unitService } from '@/services/mrmsService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardTable from '@/components/dashboard/DashboardTable';
import toast from 'react-hot-toast';

const UnitsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchUnits();
  }, [user]);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = await unitService.getUnits({ page: 1, limit: 50 });
      setUnits(response.units || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load units');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Units | MRMS</title>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Units</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage military units</p>
              </div>
              {user?.role === 'Admin' && (
                <Link href="/units/new" className="btn btn-primary flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Unit
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
                  <UserGroupIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <DashboardCard title="Units List">
            <DashboardTable
              headers={['Name', 'Type', 'Commander', 'Current Strength', 'Actions']}
              data={units.map((unit: any) => [
                unit.name || '-',
                unit.type || '-',
                unit.commander ? `${unit.commander.firstName} ${unit.commander.lastName}` : '-',
                `${unit.currentStrength || 0}/${unit.capacity || 0}`,
                <Link key={unit._id} href={`/units/${unit._id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                  View
                </Link>
              ])}
              icon={<UserGroupIcon className="h-5 w-5" />}
              emptyMessage="No units found"
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default UnitsPage;
