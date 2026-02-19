import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeftIcon, PencilIcon, TrashIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { missionService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MissionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [mission, setMission] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchMission();
  }, [id]);

  const fetchMission = async () => {
    setIsLoading(true);
    try {
      const data = await missionService.getMission(id as string);
      setMission(data);
    } catch (error) {
      toast.error('Failed to load mission details');
      router.push('/missions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await missionService.deleteMission(id as string);
      addNotification({ type: 'success', title: 'Mission Deleted', message: 'Mission has been deleted successfully.' });
      toast.success('Mission deleted successfully');
      router.push('/missions');
    } catch (error) {
      toast.error('Failed to delete mission');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !mission) return <LoadingScreen />;

  const canEdit = user?.role === 'Admin';
  const statusColors: Record<string, string> = {
    Planning: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Completed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    OnHold: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  const priorityColors: Record<string, string> = {
    Critical: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    High: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <>
      <Head><title>{mission.name} | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">{mission.name}</h1>
            <div className="ml-auto flex space-x-2">
              {canEdit && (
                <Link href={`/missions/${mission._id}/edit`} className="btn btn-secondary btn-sm flex items-center">
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
                  <RocketLaunchIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mission Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mission.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[mission.status] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {mission.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${priorityColors[mission.priority] || 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {mission.priority}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                {[
                  ['Mission Code', mission.code],
                  ['Name', mission.name],
                  ['Type', mission.type],
                  ['Description', mission.description || '-'],
                  ['Location', mission.location || '-'],
                  ['Commander', mission.commander ? `${mission.commander.firstName} ${mission.commander.lastName}` : '-'],
                  ['Personnel Count', mission.personnelCount || 0],
                  ['Start Date', mission.startDate ? format(new Date(mission.startDate), 'MMM dd, yyyy') : '-'],
                  ['End Date', mission.endDate ? format(new Date(mission.endDate), 'MMM dd, yyyy') : '-'],
                  ['Created', mission.createdAt ? format(new Date(mission.createdAt), 'MMM dd, yyyy HH:mm') : '-'],
                ].map(([label, value], i) => (
                  <div key={String(label)} className={`${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
                  </div>
                ))}
                {mission.objectives && mission.objectives.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Objectives</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <ul className="list-disc list-inside space-y-1">
                        {mission.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                      </ul>
                    </dd>
                  </div>
                )}
                {mission.assignedUnits && mission.assignedUnits.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Units</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {mission.assignedUnits.map((u: any) => typeof u === 'object' ? u.name : u).join(', ')}
                    </dd>
                  </div>
                )}
                {mission.notes && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{mission.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Mission">
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{mission.name}</strong> ({mission.code})? This action cannot be undone.
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

export default MissionDetailPage;
