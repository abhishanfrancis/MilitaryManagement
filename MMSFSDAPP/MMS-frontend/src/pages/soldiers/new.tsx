import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { soldierService, rankService, unitService, baseService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SoldierSchema = Yup.object().shape({
  serviceId: Yup.string().required('Service ID is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  rank: Yup.string().required('Rank is required'),
  dateOfEnlistment: Yup.date().required('Date of enlistment is required'),
  status: Yup.string().oneOf(['Active', 'Deployed', 'OnLeave', 'Retired', 'Inactive']).default('Active'),
});

const NewSoldierPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ranks, setRanks] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [bases, setBases] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to create soldiers');
      router.push('/soldiers');
    }
    loadDropdownData();
  }, [user, router]);

  const loadDropdownData = async () => {
    try {
      const [ranksData, unitsData, basesData] = await Promise.all([
        rankService.getRanks(),
        unitService.getUnits({ limit: 100 }),
        baseService.getBases(),
      ]);
      setRanks(Array.isArray(ranksData) ? ranksData : []);
      setUnits(Array.isArray(unitsData) ? (unitsData as any).units || unitsData : []);
      setBases(Array.isArray(basesData) ? basesData : []);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast.error('Failed to load form options');
    }
  };

  const formik = useFormik({
    initialValues: {
      serviceId: '',
      firstName: '',
      lastName: '',
      rank: '',
      unit: '',
      base: '',
      dateOfBirth: '',
      dateOfEnlistment: '',
      specialization: '',
      status: 'Active',
      contactEmail: '',
      contactPhone: '',
      notes: '',
    },
    validationSchema: SoldierSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        // Remove empty optional fields
        const submitData: any = { ...values };
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === '') delete submitData[key];
        });
        // Ensure required fields stay
        submitData.serviceId = values.serviceId;
        submitData.firstName = values.firstName;
        submitData.lastName = values.lastName;
        submitData.rank = values.rank;
        submitData.dateOfEnlistment = values.dateOfEnlistment;
        submitData.status = values.status;

        const newSoldier = await soldierService.createSoldier(submitData);

        addNotification({
          type: 'success',
          title: 'Soldier Created',
          message: `${newSoldier.firstName} ${newSoldier.lastName} has been added successfully.`,
        });

        toast.success('Soldier created successfully');
        router.push(`/soldiers/${newSoldier._id}`);
      } catch (error: any) {
        console.error('Error creating soldier:', error);
        toast.error(error.response?.data?.error || 'Failed to create soldier');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (user && user.role !== 'Admin') return null;

  return (
    <>
      <Head>
        <title>Add Soldier | MRMS</title>
      </Head>

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back button and title */}
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">Add New Soldier</h1>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-card"
          >
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Personal Information</h3>
                    <p className="form-section-desc">Basic identification details for the soldier.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    {/* Service ID */}
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="serviceId" className="form-label">
                        Service ID <span className="form-required">*</span>
                      </label>
                      <input type="text" name="serviceId" id="serviceId" className="form-input"
                        placeholder="e.g. SVC-001"
                        value={formik.values.serviceId} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.serviceId && formik.errors.serviceId && (
                        <p className="form-error">{String(formik.errors.serviceId)}</p>
                      )}
                    </div>

                    {/* First Name */}
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="firstName" className="form-label">
                        First Name <span className="form-required">*</span>
                      </label>
                      <input type="text" name="firstName" id="firstName" className="form-input"
                        value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="form-error">{String(formik.errors.firstName)}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name <span className="form-required">*</span>
                      </label>
                      <input type="text" name="lastName" id="lastName" className="form-input"
                        value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="form-error">{String(formik.errors.lastName)}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                      <input type="date" name="dateOfBirth" id="dateOfBirth" className="form-input"
                        value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>

                    {/* Contact Email */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                      <input type="email" name="contactEmail" id="contactEmail" className="form-input"
                        placeholder="email@example.com"
                        value={formik.values.contactEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>

                    {/* Contact Phone */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="contactPhone" className="form-label">Contact Phone</label>
                      <input type="text" name="contactPhone" id="contactPhone" className="form-input"
                        placeholder="+1 (555) 000-0000"
                        value={formik.values.contactPhone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                {/* Service Details Section */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Service Details</h3>
                    <p className="form-section-desc">Military rank, status, and assignment details.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    {/* Rank */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="rank" className="form-label">
                        Rank <span className="form-required">*</span>
                      </label>
                      <select id="rank" name="rank" className="form-select"
                        value={formik.values.rank} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Rank</option>
                        {ranks.map((r: any) => (
                          <option key={r._id} value={r._id}>{r.name} ({r.abbreviation})</option>
                        ))}
                      </select>
                      {formik.touched.rank && formik.errors.rank && (
                        <p className="form-error">{String(formik.errors.rank)}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" className="form-select"
                        value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="Active">Active</option>
                        <option value="Deployed">Deployed</option>
                        <option value="OnLeave">On Leave</option>
                        <option value="Retired">Retired</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Unit */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="unit" className="form-label">Unit</label>
                      <select id="unit" name="unit" className="form-select"
                        value={formik.values.unit} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Unit (optional)</option>
                        {units.map((u: any) => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Base */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="base" className="form-label">Base</label>
                      <select id="base" name="base" className="form-select"
                        value={formik.values.base} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Base (optional)</option>
                        {bases.map((b: any) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date of Enlistment */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="dateOfEnlistment" className="form-label">
                        Date of Enlistment <span className="form-required">*</span>
                      </label>
                      <input type="date" name="dateOfEnlistment" id="dateOfEnlistment" className="form-input"
                        value={formik.values.dateOfEnlistment} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.dateOfEnlistment && formik.errors.dateOfEnlistment && (
                        <p className="form-error">{String(formik.errors.dateOfEnlistment)}</p>
                      )}
                    </div>

                    {/* Specialization */}
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="specialization" className="form-label">Specialization</label>
                      <input type="text" name="specialization" id="specialization" className="form-input"
                        placeholder="e.g. Infantry, Medic, Engineer"
                        value={formik.values.specialization} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                {/* Additional Notes Section */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Additional Notes</h3>
                    <p className="form-section-desc">Any additional information or remarks.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea name="notes" id="notes" rows={4} className="form-textarea"
                      placeholder="Enter any additional notes..."
                      value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  </div>
                </div>

                <div className="form-footer">
                  <Link href="/soldiers" className="btn btn-secondary">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formik.isValid}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Soldier'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewSoldierPage;
