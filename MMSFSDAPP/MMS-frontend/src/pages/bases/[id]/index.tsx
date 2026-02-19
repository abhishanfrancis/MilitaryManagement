import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeftIcon, PencilIcon, TrashIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { baseService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BaseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [base, setBase] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBase();
  }, [id]);

  const fetchBase = async () => {
    setIsLoading(true);
    try {
      const data = await baseService.getBase(id as string);
      setBase(data);
    } catch (error) {
      toast.error('Failed to load base details');
      router.push('/bases');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await baseService.deleteBase(id as string);
      addNotification({ type: 'success', title: 'Base Deleted', message: 'Base has been deleted successfully.' });
      toast.success('Base deleted successfully');
      router.push('/bases');
    } catch (error) {
      toast.error('Failed to delete base');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !base) return <LoadingScreen />;

  const canEdit = user?.role === 'Admin';
  const statusColors: Record<string, string> = {
    Operational: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    UnderConstruction: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Decommissioned: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Restricted: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <>
      <Head><title>{base.name} | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">{base.name}</h1>
            <div className="ml-auto flex space-x-2">
              {canEdit && (
                <Link href={`/bases/${base._id}/edit`} className="btn btn-secondary btn-sm flex items-center">
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
                  <BuildingOffice2Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{base.type} Base</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[base.status] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                {base.status}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                {[
                  ['Name', base.name],
                  ['Location', base.location],
                  ['Type', base.type === 'AirForce' ? 'Air Force' : base.type],
                  ['Commander', base.commander ? `${base.commander.firstName} ${base.commander.lastName}` : '-'],
                  ['Capacity', base.capacity],
                  ['Current Occupancy', base.currentOccupancy || 0],
                  ['Occupancy Rate', `${base.occupancyRate || 0}%`],
                  ['Coordinates', base.coordinates?.latitude ? `${base.coordinates.latitude}, ${base.coordinates.longitude}` : '-'],
                  ['Description', base.description || '-'],
                  ['Created', base.createdAt ? format(new Date(base.createdAt), 'MMM dd, yyyy HH:mm') : '-'],
                ].map(([label, value], i) => (
                  <div key={String(label)} className={`${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
                  </div>
                ))}
                {base.facilities && base.facilities.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Facilities</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {base.facilities.map((f: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{f}</span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Base">
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{base.name}</strong>? This action cannot be undone.
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

export default BaseDetailPage;
