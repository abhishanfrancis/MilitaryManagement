import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { assetService } from '@/services/assetService';
import { assignmentService } from '@/services/assignmentService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { Asset } from '@/types/asset';
import { Assignment } from '@/types/assignment';
import { motion } from 'framer-motion';

// Interface for the form values
interface AssignmentFormValues {
  asset: string;
  base: string;
  quantity: number;
  assignedTo: {
    name: string;
    rank: string;
    id: string;
  };
  purpose: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

// List of bases
const bases = ['Base Alpha', 'Base Bravo', 'Base Charlie'];

const AssignmentSchema = Yup.object().shape({
  asset: Yup.string().required('Asset is required'),
  base: Yup.string().required('Base is required'),
  quantity: Yup.number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number'),
  assignedTo: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    rank: Yup.string().required('Rank is required'),
    id: Yup.string().required('ID is required'),
  }),
  purpose: Yup.string().required('Purpose is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().nullable(),
  notes: Yup.string(),
});

const NewAssignmentPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { asset: assetId } = router.query;

  const formik = useFormik<AssignmentFormValues>({
    initialValues: {
      asset: (Array.isArray(assetId) ? assetId[0] : assetId) || '',
      base: user?.role === 'BaseCommander' && user.assignedBase ? user.assignedBase : '',
      quantity: 1,
      assignedTo: {
        name: '',
        rank: '',
        id: '',
      },
      purpose: '',
      startDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      endDate: '',
      notes: '',
    },
    validationSchema: AssignmentSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        // Create the assignment
        const newAssignment = await assignmentService.createAssignment(values);
        
        // Add notification
        addNotification({
          type: 'success',
          title: 'Assignment Created',
          message: `${newAssignment.quantity} ${newAssignment.assetName} assigned to ${newAssignment.assignedTo.name}.`
        });
        
        toast.success('Assignment created successfully');
        router.push(`/assignments/${newAssignment._id}`);
        
      } catch (error: any) {
        console.error('Error creating assignment:', error);
        toast.error(error.response?.data?.error || 'Failed to create assignment');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Check if user has permission to create assignments
  useEffect(() => {
    if (user && user.role !== 'Admin' && user.role !== 'BaseCommander') {
      toast.error('You do not have permission to create assignments');
      router.push('/assignments');
    }
  }, [user, router]);

  // Fetch assets for reference
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const response = await assetService.getAssets({
          limit: 100, // Get a large number of assets
          status: 'Available', // Only get available assets
        });
        
        // Filter assets based on user role and assigned base
        let filteredAssets = response.assets;
        
        if (user?.role === 'BaseCommander' && user.assignedBase) {
          filteredAssets = filteredAssets.filter(asset => asset.base === user.assignedBase);
        }
        
        setAvailableAssets(filteredAssets);
        
        // If assetId is provided in the query, select that asset
        if (assetId && typeof assetId === 'string') {
          const asset = filteredAssets.find(a => a._id === assetId);
          if (asset) {
            setSelectedAsset(asset);
            formik.setFieldValue('asset', asset._id);
            formik.setFieldValue('base', asset.base);
          }
        }
        
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchAssets();
    }
  }, [assetId, user, formik]);

  // Update selected asset when asset changes
  useEffect(() => {
    const asset = availableAssets.find(a => a._id === formik.values.asset);
    setSelectedAsset(asset || null);
    
    // If asset changes, update base
    if (asset) {
      formik.setFieldValue('base', asset.base);
    }
  }, [formik.values.asset, availableAssets]);

  // If not authorized, don't render the page
  if (user && user.role !== 'Admin' && user.role !== 'BaseCommander') {
    return null;
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>New Assignment | Military Asset Management</title>
      </Head>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back button and title */}
          <div className="page-header">
            <button
              onClick={() => router.back()}
              className="page-header-back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">New Assignment</h1>
          </div>

          {/* Assignment form */}
          <div className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Assignment Details</h3>
                    <p className="form-section-desc">Select asset, base, and assign personnel.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="asset" className="form-label">
                      Asset <span className="form-required">*</span>
                    </label>
                      <select
                        id="asset"
                        name="asset"
                        className={`form-select ${
                          formik.touched.asset && formik.errors.asset ? 'border-red-500' : ''
                        }`}
                        value={formik.values.asset}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!!assetId}
                      >
                        <option value="">Select an asset</option>
                        {availableAssets.map((asset) => (
                          <option key={asset._id} value={asset._id}>
                            {asset.name} ({asset.type}) - {asset.available} available
                          </option>
                        ))}
                      </select>
                      {formik.touched.asset && formik.errors.asset && (
                        <p className="form-error">{formik.errors.asset}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="base" className="form-label">
                      Base <span className="form-required">*</span>
                    </label>
                      <select
                        id="base"
                        name="base"
                        className={`form-select ${
                          formik.touched.base && formik.errors.base ? 'border-red-500' : ''
                        }`}
                        value={formik.values.base}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={user?.role === 'BaseCommander' || !!selectedAsset}
                      >
                        <option value="">Select a base</option>
                        {bases.map((base) => (
                          <option key={base} value={base}>
                            {base}
                          </option>
                        ))}
                      </select>
                      {formik.touched.base && formik.errors.base && (
                        <p className="form-error">{formik.errors.base}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="quantity" className="form-label">
                      Quantity <span className="form-required">*</span>
                    </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="1"
                        max={selectedAsset?.available || 1}
                        className={`form-input ${
                          formik.touched.quantity && formik.errors.quantity ? 'border-red-500' : ''
                        }`}
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {selectedAsset && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {selectedAsset.available} available
                        </p>
                      )}
                      {formik.touched.quantity && formik.errors.quantity && (
                        <p className="form-error">{formik.errors.quantity}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="purpose" className="form-label">
                      Purpose <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="purpose"
                        id="purpose"
                        className={`form-input ${
                          formik.touched.purpose && formik.errors.purpose ? 'border-red-500' : ''
                        }`}
                        value={formik.values.purpose}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., Training Exercise, Border Patrol"
                      />
                      {formik.touched.purpose && formik.errors.purpose && (
                        <p className="form-error">{formik.errors.purpose}</p>
                      )}
                  </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Personnel</h3>
                    <p className="form-section-desc">Who the asset is being assigned to.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2 form-group">
                    <label htmlFor="assignedTo.name" className="form-label">
                      Assigned To (Name) <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="assignedTo.name"
                        id="assignedTo.name"
                        className={`form-input ${
                          formik.touched.assignedTo?.name && formik.errors.assignedTo?.name ? 'border-red-500' : ''
                        }`}
                        value={formik.values.assignedTo.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.assignedTo?.name && formik.errors.assignedTo?.name && (
                        <p className="form-error">{formik.errors.assignedTo.name}</p>
                      )}
                  </div>

                  <div className="sm:col-span-2 form-group">
                    <label htmlFor="assignedTo.rank" className="form-label">
                      Assigned To (Rank) <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="assignedTo.rank"
                        id="assignedTo.rank"
                        className={`form-input ${
                          formik.touched.assignedTo?.rank && formik.errors.assignedTo?.rank ? 'border-red-500' : ''
                        }`}
                        value={formik.values.assignedTo.rank}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.assignedTo?.rank && formik.errors.assignedTo?.rank && (
                        <p className="form-error">{formik.errors.assignedTo.rank}</p>
                      )}
                  </div>

                  <div className="sm:col-span-2 form-group">
                    <label htmlFor="assignedTo.id" className="form-label">
                      Assigned To (ID) <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="assignedTo.id"
                        id="assignedTo.id"
                        className={`form-input ${
                          formik.touched.assignedTo?.id && formik.errors.assignedTo?.id ? 'border-red-500' : ''
                        }`}
                        value={formik.values.assignedTo.id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.assignedTo?.id && formik.errors.assignedTo?.id && (
                        <p className="form-error">{formik.errors.assignedTo.id}</p>
                      )}
                  </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Schedule</h3>
                    <p className="form-section-desc">Assignment dates and additional notes.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="startDate" className="form-label">
                      Start Date <span className="form-required">*</span>
                    </label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className={`form-input ${
                          formik.touched.startDate && formik.errors.startDate ? 'border-red-500' : ''
                        }`}
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.startDate && formik.errors.startDate && (
                        <p className="form-error">{formik.errors.startDate}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="endDate" className="form-label">
                      End Date (Optional)
                    </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className={`form-input ${
                          formik.touched.endDate && formik.errors.endDate ? 'border-red-500' : ''
                        }`}
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.endDate && formik.errors.endDate && (
                        <p className="form-error">{formik.errors.endDate}</p>
                      )}
                  </div>

                  <div className="sm:col-span-6 form-group">
                    <label htmlFor="notes" className="form-label">
                      Notes (Optional)
                    </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className={`form-textarea ${
                          formik.touched.notes && formik.errors.notes ? 'border-red-500' : ''
                        }`}
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Optional notes about this assignment"
                      />
                      {formik.touched.notes && formik.errors.notes && (
                        <p className="form-error">{formik.errors.notes}</p>
                      )}
                  </div>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !formik.isValid}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Assignment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAssignmentPage;