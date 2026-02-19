import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService } from '@/services/mrmsService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Modal from '@/components/ui/Modal';

const statusColors: Record<string, string> = {
  Operational: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  UnderMaintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Damaged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  Decommissioned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  InTransit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const conditionColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Good: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Poor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const EquipmentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getEquipmentItem(id as string);
      setEquipment(data);
    } catch (error) {
      toast.error('Failed to load equipment');
      router.push('/equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await equipmentService.deleteEquipment(id as string);
      toast.success('Equipment deleted successfully');
      router.push('/equipment');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete equipment');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const fmtDate = (d: string | null | undefined) => d ? format(new Date(d), 'dd MMM yyyy') : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!equipment) return null;

  return (
    <>
      <Head><title>{equipment.name} | Equipment | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="page-header-back">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="page-title">{equipment.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Serial: {equipment.serialNumber}</p>
              </div>
            </div>
            {user?.role === 'Admin' && (
              <div className="flex space-x-3">
                <Link href={`/equipment/${id}/edit`} className="btn btn-secondary flex items-center">
                  <PencilSquareIcon className="h-4 w-4 mr-1.5" /> Edit
                </Link>
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger flex items-center">
                  <TrashIcon className="h-4 w-4 mr-1.5" /> Delete
                </button>
              </div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-card p-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[equipment.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {equipment.status?.replace('UnderMaintenance', 'Under Maintenance').replace('InTransit', 'In Transit')}
                </span>
              </div>
              <div className="form-card p-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Condition</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${conditionColors[equipment.condition] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {equipment.condition}
                </span>
              </div>
              <div className="form-card p-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{equipment.type}</p>
              </div>
            </div>

            {/* Details */}
            <div className="form-card overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Equipment Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{equipment.category || '—'}</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{equipment.quantity}</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Acquisition Date</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{fmtDate(equipment.acquisitionDate)}</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Maintenance</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{fmtDate(equipment.lastMaintenanceDate)}</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Maintenance</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{fmtDate(equipment.nextMaintenanceDate)}</dd></div>
                </dl>
              </div>
            </div>

            {/* Assignment */}
            <div className="form-card overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Assignment Information</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Base</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {equipment.base ? (
                        <Link href={`/bases/${equipment.base._id || equipment.base}`} className="text-indigo-600 hover:text-indigo-900">
                          {equipment.base.name || equipment.base}
                        </Link>
                      ) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Unit</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {equipment.assignedUnit ? (
                        <Link href={`/units/${equipment.assignedUnit._id || equipment.assignedUnit}`} className="text-indigo-600 hover:text-indigo-900">
                          {equipment.assignedUnit.name || equipment.assignedUnit}
                        </Link>
                      ) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Soldier</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {equipment.assignedSoldier ? (
                        <Link href={`/soldiers/${equipment.assignedSoldier._id || equipment.assignedSoldier}`} className="text-indigo-600 hover:text-indigo-900">
                          {equipment.assignedSoldier.firstName} {equipment.assignedSoldier.lastName}
                        </Link>
                      ) : '—'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Notes */}
            {equipment.notes && (
              <div className="form-card overflow-hidden">
                <div className="px-6 py-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Notes</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{equipment.notes}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Equipment">
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete <strong>{equipment.name}</strong> (SN: {equipment.serialNumber})? This action cannot be undone.</p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button type="button" className="btn btn-danger sm:ml-3" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button type="button" className="btn btn-secondary mt-3 sm:mt-0" onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default EquipmentDetailPage;
