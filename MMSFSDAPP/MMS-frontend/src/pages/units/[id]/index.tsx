import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeftIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { unitService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UnitDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchUnit();
  }, [id]);

  const fetchUnit = async () => {
    setIsLoading(true);
    try {
      const data = await unitService.getUnit(id as string);
      setUnit(data);
    } catch (error) {
      toast.error('Failed to load unit details');
      router.push('/units');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await unitService.deleteUnit(id as string);
      addNotification({ type: 'success', title: 'Unit Deleted', message: 'Unit has been deleted successfully.' });
      toast.success('Unit deleted successfully');
      router.push('/units');
    } catch (error) {
      toast.error('Failed to delete unit');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !unit) return <LoadingScreen />;

  const canEdit = user?.role === 'Admin';
  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Deployed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    StandBy: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Disbanded: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const strengthPercent = unit.capacity ? Math.round((unit.currentStrength / unit.capacity) * 100) : 0;

  return (
    <>
      <Head><title>{unit.name} | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">{unit.name}</h1>
            <div className="ml-auto flex space-x-2">
              {canEdit && (
                <Link href={`/units/${unit._id}/edit`} className="btn btn-secondary btn-sm flex items-center">
                  <PencilIcon className="h-4 w-4 mr-1" /> Edit
                </Link>
              )}
              {canEdit && (
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm flex items-center">
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </button>
              )}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="form-card overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unit Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{unit.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[unit.status] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                {unit.status}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                {[
                  ['Name', unit.name],
                  ['Type', unit.type],
                  ['Base', typeof unit.base === 'object' ? unit.base?.name : unit.base || '-'],
                  ['Commander', unit.commander ? `${unit.commander.firstName} ${unit.commander.lastName}` : '-'],
                  ['Parent Unit', typeof unit.parentUnit === 'object' ? unit.parentUnit?.name : unit.parentUnit || '-'],
                  ['Capacity', unit.capacity || '-'],
                  ['Current Strength', `${unit.currentStrength || 0} (${strengthPercent}%)`],
                  ['Established Date', unit.establishedDate ? format(new Date(unit.establishedDate), 'MMM dd, yyyy') : '-'],
                  ['Description', unit.description || '-'],
                  ['Created', unit.createdAt ? format(new Date(unit.createdAt), 'MMM dd, yyyy HH:mm') : '-'],
                ].map(([label, value], i) => (
                  <div key={String(label)} className={`${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Unit">
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{unit.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" disabled={isDeleting}>Cancel</button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnitDetailPage;
