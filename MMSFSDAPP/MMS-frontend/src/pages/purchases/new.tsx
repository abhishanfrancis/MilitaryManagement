import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { assetService } from '@/services/assetService';
import { purchaseService } from '@/services/purchaseService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { Asset } from '@/types/asset';
import { motion } from 'framer-motion';

// List of bases
const bases = ['Base Alpha', 'Base Bravo', 'Base Charlie'];

// List of suppliers
const suppliers = [
  'Military Supplies Inc.',
  'Tech Defense Systems',
  'Military Outfitters',
  'Ammo Suppliers Ltd.',
  'Military Vehicles Inc.',
];

// Asset types
const assetTypes = ['Weapon', 'Vehicle', 'Equipment', 'Ammunition'];

const PurchaseSchema = Yup.object().shape({
  assetName: Yup.string().required('Asset name is required'),
  assetType: Yup.string().required('Asset type is required'),
  base: Yup.string().required('Base is required'),
  supplier: Yup.string().required('Supplier is required'),
  quantity: Yup.number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number'),
  unitCost: Yup.number()
    .required('Unit cost is required')
    .positive('Unit cost must be positive'),
  purchaseDate: Yup.date().required('Purchase date is required'),
  invoiceNumber: Yup.string(),
  notes: Yup.string(),
});

const NewPurchasePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { asset: assetId } = router.query;

  // Check if user has permission to create purchases
  useEffect(() => {
    if (user && user.role !== 'Admin' && user.role !== 'LogisticsOfficer') {
      toast.error('You do not have permission to create purchases');
      router.push('/purchases');
    }
  }, [user, router]);

  // Fetch assets for reference
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const response = await assetService.getAssets({
          limit: 100, // Get a large number of assets
        });
        
        // Filter assets based on user role and assigned base
        let filteredAssets = response.assets;
        
        if (user?.role === 'LogisticsOfficer' && user.assignedBase) {
          filteredAssets = filteredAssets.filter(asset => asset.base === user.assignedBase);
        }
        
        setAvailableAssets(filteredAssets);
        
        // If assetId is provided in the query, select that asset
        if (assetId) {
          const asset = filteredAssets.find(a => a._id === assetId);
          if (asset) {
            setSelectedAsset(asset);
            formik.setFieldValue('assetName', asset.name);
            formik.setFieldValue('assetType', asset.type);
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
  }, [assetId, user]);

  const formik = useFormik({
    initialValues: {
      assetName: '',
      assetType: '',
      base: user?.role === 'LogisticsOfficer' && user.assignedBase ? user.assignedBase : '',
      supplier: '',
      quantity: 1,
      unitCost: 0,
      purchaseDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      invoiceNumber: '',
      notes: '',
    },
    validationSchema: PurchaseSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        // Create the purchase
        const newPurchase = await purchaseService.createPurchase(values);
        
        // Add notification
        addNotification({
          type: 'success',
          title: 'Purchase Created',
          message: `Purchase of ${newPurchase.quantity} ${newPurchase.assetName} has been created.`
        });
        
        toast.success('Purchase created successfully');
        router.push(`/purchases/${newPurchase._id}`);
        
      } catch (error: any) {
        console.error('Error creating purchase:', error);
        toast.error(error.response?.data?.error || 'Failed to create purchase');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Calculate total cost
  const totalCost = formik.values.quantity * formik.values.unitCost;

  // If not admin or logistics officer, don't render the page
  if (user && user.role !== 'Admin' && user.role !== 'LogisticsOfficer') {
    return null;
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>New Purchase | Military Asset Management</title>
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
            <h1 className="page-title">New Purchase</h1>
          </div>

          {/* Purchase form */}
          <div className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Asset Information</h3>
                    <p className="form-section-desc">Enter the asset name, category, base, and supplier details.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="assetName" className="form-label">
                      Asset Name <span className="form-required">*</span>
                    </label>
                      <input
                        type="text"
                        name="assetName"
                        id="assetName"
                        className={`form-input ${
                          formik.touched.assetName && formik.errors.assetName ? 'border-red-500' : ''
                        }`}
                        value={formik.values.assetName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter asset name"
                      />
                      {formik.touched.assetName && formik.errors.assetName && (
                        <p className="form-error">{formik.errors.assetName}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="assetType" className="form-label">
                      Asset Type <span className="form-required">*</span>
                    </label>
                      <select
                        id="assetType"
                        name="assetType"
                        className={`form-select ${
                          formik.touched.assetType && formik.errors.assetType ? 'border-red-500' : ''
                        }`}
                        value={formik.values.assetType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select asset type</option>
                        {assetTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {formik.touched.assetType && formik.errors.assetType && (
                        <p className="form-error">{formik.errors.assetType}</p>
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
                        disabled={user?.role === 'LogisticsOfficer' && !!user.assignedBase}
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
                    <label htmlFor="supplier" className="form-label">
                      Supplier <span className="form-required">*</span>
                    </label>
                      <select
                        id="supplier"
                        name="supplier"
                        className={`form-select ${
                          formik.touched.supplier && formik.errors.supplier ? 'border-red-500' : ''
                        }`}
                        value={formik.values.supplier}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select a supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier} value={supplier}>
                            {supplier}
                          </option>
                        ))}
                      </select>
                      {formik.touched.supplier && formik.errors.supplier && (
                        <p className="form-error">{formik.errors.supplier}</p>
                      )}
                  </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Financial Details</h3>
                    <p className="form-section-desc">Enter the quantity, pricing, and payment information.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="quantity" className="form-label">
                      Quantity <span className="form-required">*</span>
                    </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="1"
                        className={`form-input ${
                          formik.touched.quantity && formik.errors.quantity ? 'border-red-500' : ''
                        }`}
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.quantity && formik.errors.quantity && (
                        <p className="form-error">{formik.errors.quantity}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="unitCost" className="form-label">
                      Unit Cost ($) <span className="form-required">*</span>
                    </label>
                      <input
                        type="number"
                        name="unitCost"
                        id="unitCost"
                        min="0.01"
                        step="0.01"
                        className={`form-input ${
                          formik.touched.unitCost && formik.errors.unitCost ? 'border-red-500' : ''
                        }`}
                        value={formik.values.unitCost}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.unitCost && formik.errors.unitCost && (
                        <p className="form-error">{formik.errors.unitCost}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="totalCost" className="form-label">
                      Total Cost ($)
                    </label>
                      <input
                        type="text"
                        id="totalCost"
                        className="form-input bg-gray-100 dark:bg-gray-700"
                        value={totalCost.toLocaleString()}
                        disabled
                      />
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="purchaseDate" className="form-label">
                      Purchase Date <span className="form-required">*</span>
                    </label>
                      <input
                        type="date"
                        name="purchaseDate"
                        id="purchaseDate"
                        className={`form-input ${
                          formik.touched.purchaseDate && formik.errors.purchaseDate ? 'border-red-500' : ''
                        }`}
                        value={formik.values.purchaseDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.purchaseDate && formik.errors.purchaseDate && (
                        <p className="form-error">{formik.errors.purchaseDate}</p>
                      )}
                  </div>

                  <div className="sm:col-span-3 form-group">
                    <label htmlFor="invoiceNumber" className="form-label">
                      Invoice Number
                    </label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        id="invoiceNumber"
                        className={`form-input ${
                          formik.touched.invoiceNumber && formik.errors.invoiceNumber ? 'border-red-500' : ''
                        }`}
                        value={formik.values.invoiceNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Optional invoice number"
                      />
                      {formik.touched.invoiceNumber && formik.errors.invoiceNumber && (
                        <p className="form-error">{formik.errors.invoiceNumber}</p>
                      )}
                  </div>

                  <div className="sm:col-span-6 form-group">
                    <label htmlFor="notes" className="form-label">
                      Notes
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
                        placeholder="Optional notes about this purchase"
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
                      'Create Purchase'
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

export default NewPurchasePage;