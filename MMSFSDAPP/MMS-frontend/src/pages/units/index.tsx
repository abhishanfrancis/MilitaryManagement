import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUnits();
  }, [user]);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = await unitService.getUnits({ search, page: 1, limit: 50 });
      setUnits(response.units || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Failed to load units');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnits();
  };

  if (isLoading) return <LoadingScreen />;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-emerald-50 text-emerald-700',
      Deployed: 'bg-blue-50 text-blue-700',
      StandBy: 'bg-yellow-50 text-yellow-700',
      Disbanded: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  return (
    <>
      <Head><title>Units | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">Units</h1>
                <p className="mt-1 text-sm text-gray-500">Manage military units and formations</p>
              </div>
              <Link href="/units/new" className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="h-4 w-4" /> Add Unit
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search by unit name..." className="form-input pl-10 w-full"
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
                  <UserGroupIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{units.filter(u => u.status === 'Active').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deployed</p>
                  <p className="text-2xl font-bold text-gray-900">{units.filter(u => u.status === 'Deployed').length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <DashboardCard title="Units List">
            <DashboardTable
              headers={['Name', 'Type', 'Base', 'Commander', 'Strength', 'Status', 'Actions']}
              data={units.map((unit: any) => [
                unit.name || '-',
                unit.type || '-',
                typeof unit.base === 'object' ? unit.base?.name : '-',
                unit.commander ? `${unit.commander.firstName} ${unit.commander.lastName}` : '-',
                `${unit.currentStrength || 0}/${unit.capacity || 0}`,
                <span key={unit._id} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(unit.status)}`}>
                  {unit.status}
                </span>,
                <Link key={`${unit._id}-link`} href={`/units/${unit._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
