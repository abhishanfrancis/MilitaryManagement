import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { soldierService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SoldierDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [soldier, setSoldier] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchSoldier();
  }, [id]);

  const fetchSoldier = async () => {
    setIsLoading(true);
    try {
      const data = await soldierService.getSoldier(id as string);
      setSoldier(data);
    } catch (error) {
      console.error('Error fetching soldier:', error);
      toast.error('Failed to load soldier details');
      router.push('/soldiers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await soldierService.deleteSoldier(id as string);
      addNotification({
        type: 'success',
        title: 'Soldier Deleted',
        message: 'Soldier has been deleted successfully.',
      });
      toast.success('Soldier deleted successfully');
      router.push('/soldiers');
    } catch (error) {
      console.error('Error deleting soldier:', error);
      toast.error('Failed to delete soldier');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !soldier) return <LoadingScreen />;

  const canEdit = user?.role === 'Admin';
  const canDelete = user?.role === 'Admin';

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Deployed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    OnLeave: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Retired: 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Inactive: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const statusColor = statusColors[soldier.status] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <>
      <Head>
        <title>{soldier.firstName} {soldier.lastName} | MRMS</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">
              {soldier.firstName} {soldier.lastName}
            </h1>
            <div className="ml-auto flex space-x-2">
              {canEdit && (
                <Link href={`/soldiers/${soldier._id}/edit`} className="btn btn-secondary btn-sm flex items-center">
                  <PencilIcon className="h-4 w-4 mr-1" /> Edit
                </Link>
              )}
              {canDelete && (
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm flex items-center">
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </button>
              )}
            </div>
          </div>

          {/* Soldier Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-card overflow-hidden"
          >
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Soldier Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{soldier.serviceId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColor}`}>
                {soldier.status}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Service ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{soldier.serviceId}</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {soldier.firstName} {soldier.lastName}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {typeof soldier.rank === 'object' ? `${soldier.rank.name} (${soldier.rank.abbreviation})` : soldier.rank || '-'}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Unit</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {typeof soldier.unit === 'object' ? soldier.unit.name : soldier.unit || '-'}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Base</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {typeof soldier.base === 'object' ? soldier.base.name : soldier.base || '-'}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Specialization</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{soldier.specialization || '-'}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {soldier.dateOfBirth ? format(new Date(soldier.dateOfBirth), 'MMM dd, yyyy') : '-'}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Enlistment</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {soldier.dateOfEnlistment ? format(new Date(soldier.dateOfEnlistment), 'MMM dd, yyyy') : '-'}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{soldier.contactEmail || '-'}</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{soldier.contactPhone || '-'}</dd>
                </div>
                {soldier.notes && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{soldier.notes}</dd>
                  </div>
                )}
                <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {soldier.createdAt ? format(new Date(soldier.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Soldier"
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{soldier.firstName} {soldier.lastName}</strong> ({soldier.serviceId})?
            This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" disabled={isDeleting}>
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SoldierDetailPage;
