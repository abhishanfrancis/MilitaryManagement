import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { assetService } from '@/services/assetService';
import { useNotificationStore } from '@/stores/notificationStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AssetSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  base: Yup.string().required('Base is required'),
  openingBalance: Yup.number()
    .required('Opening balance is required')
    .min(0, 'Opening balance must be at least 0'),
});

const NewAssetPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has permission to create assets
  useEffect(() => {
    if (user && user.role !== 'Admin' && user.role !== 'LogisticsOfficer') {
      toast.error('You do not have permission to create assets');
      router.push('/assets');
    }
  }, [user, router]);

  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      base: user?.role === 'LogisticsOfficer' && user.assignedBase ? user.assignedBase : '',
      openingBalance: 0,
    },
    validationSchema: AssetSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const newAsset = await assetService.createAsset(values);
        
        // Add notification
        addNotification({
          type: 'success',
          title: 'Asset Created',
          message: `Asset ${newAsset.name} has been created successfully.`
        });
        
        toast.success('Asset created successfully');
        router.push(`/assets/${newAsset._id}`);
      } catch (error: any) {
        console.error('Error creating asset:', error);
        toast.error(error.response?.data?.error || 'Failed to create asset');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // If not admin or logistics officer, don't render the page
  if (user && user.role !== 'Admin' && user.role !== 'LogisticsOfficer') {
    return null;
  }

  return (
    <>
      <Head>
        <title>New Asset | Military Asset Management</title>
      </Head>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back button and title */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Asset</h1>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-sm shadow-card rounded-2xl border border-white/50 overflow-hidden">
            <div className="px-6 py-6">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Asset Information</h3>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="name" className="form-label">
                      Asset Name <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-input"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="form-error">{formik.errors.name}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="type" className="form-label">
                      Asset Type <span className="form-required">*</span>
                    </label>
                      <select
                        id="type"
                        name="type"
                        className="form-select"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Type</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Weapon">Weapon</option>
                        <option value="Ammunition">Ammunition</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Other">Other</option>
                      </select>
                      {formik.touched.type && formik.errors.type && (
                        <p className="form-error">{formik.errors.type}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="base" className="form-label">
                      Base <span className="form-required">*</span>
                    </label>
                      <select
                        id="base"
                        name="base"
                        className="form-select"
                        value={formik.values.base}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={user?.role === 'LogisticsOfficer' && !!user.assignedBase}
                      >
                        <option value="">Select Base</option>
                        <option value="Base Alpha">Base Alpha</option>
                        <option value="Base Bravo">Base Bravo</option>
                        <option value="Base Charlie">Base Charlie</option>
                      </select>
                      {formik.touched.base && formik.errors.base && (
                        <p className="form-error">{formik.errors.base}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="openingBalance" className="form-label">
                      Opening Balance <span className="form-required">*</span>
                    </label>
                      <input
                        type="number"
                        name="openingBalance"
                        id="openingBalance"
                        className="form-input"
                        min="0"
                        value={formik.values.openingBalance}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.openingBalance && formik.errors.openingBalance && (
                        <p className="form-error">{formik.errors.openingBalance}</p>
                      )}
                  </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Link href="/assets" className="btn btn-secondary">
                    Cancel
                  </Link>
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
                      'Create Asset'
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

export default NewAssetPage;