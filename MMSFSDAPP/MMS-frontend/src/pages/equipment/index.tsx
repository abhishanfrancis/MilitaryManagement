import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { WrenchScrewdriverIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService } from '@/services/mrmsService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardTable from '@/components/dashboard/DashboardTable';
import toast from 'react-hot-toast';

const EquipmentPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchEquipment();
  }, [user]);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await equipmentService.getEquipment({ search, page: 1, limit: 50 });
      setEquipment(response.equipment || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load equipment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEquipment();
  };

  if (isLoading) return <LoadingScreen />;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Operational: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
      UnderMaintenance: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
      Damaged: 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400',
      Decommissioned: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      InTransit: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      New: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
      Good: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      Fair: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
      Poor: 'bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
      Critical: 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    };
    return colors[condition] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <>
      <Head><title>Equipment | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">Equipment</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage military equipment and inventory</p>
              </div>
              {(user?.role === 'Admin' || user?.role === 'LogisticsOfficer') && (
                <Link href="/equipment/new" className="btn btn-primary flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" /> Add Equipment
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Search by name or serial number..." className="form-input pl-10 w-full"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="form-card p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Equipment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Operational</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{equipment.filter(e => e.status === 'Operational').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{equipment.filter(e => e.status === 'UnderMaintenance').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Damaged</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{equipment.filter(e => e.status === 'Damaged').length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <DashboardCard title="Equipment List">
            <DashboardTable
              headers={['Serial #', 'Name', 'Type', 'Status', 'Condition', 'Unit', 'Actions']}
              data={equipment.map((item: any) => [
                item.serialNumber || '-',
                item.name || '-',
                item.type || '-',
                <span key={item._id} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>,
                <span key={`${item._id}-cond`} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>,
                typeof item.assignedUnit === 'object' ? item.assignedUnit?.name : '-',
                <Link key={`${item._id}-link`} href={`/equipment/${item._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View
                </Link>
              ])}
              icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
              emptyMessage="No equipment found"
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default EquipmentPage;
