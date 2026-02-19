import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { baseService, soldierService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BaseSchema = Yup.object().shape({
  name: Yup.string().required('Base name is required'),
  location: Yup.string().required('Location is required'),
  type: Yup.string().oneOf(['Army', 'Navy', 'AirForce', 'Joint', 'Training', 'Logistics']).required('Base type is required'),
  capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
  status: Yup.string().oneOf(['Operational', 'UnderConstruction', 'Decommissioned', 'Restricted']).required(),
});

const EditBasePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [base, setBase] = useState<any>(null);
  const [soldiers, setSoldiers] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to edit bases');
      router.push('/bases');
    }
  }, [user, router]);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [baseData, soldiersData] = await Promise.all([
        baseService.getBase(id as string),
        soldierService.getSoldiers({ limit: 200 }),
      ]);
      setBase(baseData);
      setSoldiers(Array.isArray(soldiersData) ? soldiersData : (soldiersData as any).soldiers || []);
    } catch (error) {
      toast.error('Failed to load base data');
      router.push('/bases');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: base?.name || '',
      location: base?.location || '',
      type: base?.type || '',
      capacity: base?.capacity || '',
      currentOccupancy: base?.currentOccupancy || '0',
      commander: (typeof base?.commander === 'object' ? base?.commander?._id : base?.commander) || '',
      status: base?.status || 'Operational',
      latitude: base?.coordinates?.latitude || '',
      longitude: base?.coordinates?.longitude || '',
      facilities: (base?.facilities || []).join(', '),
      description: base?.description || '',
    },
    validationSchema: BaseSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const submitData: any = {};
        submitData.name = values.name;
        submitData.location = values.location;
        submitData.type = values.type;
        submitData.capacity = Number(values.capacity);
        submitData.status = values.status;
        if (values.currentOccupancy) submitData.currentOccupancy = Number(values.currentOccupancy);
        if (values.commander) submitData.commander = values.commander;
        if (values.latitude || values.longitude) {
          submitData.coordinates = {};
          if (values.latitude) submitData.coordinates.latitude = Number(values.latitude);
          if (values.longitude) submitData.coordinates.longitude = Number(values.longitude);
        }
        if (values.facilities) {
          submitData.facilities = values.facilities.split(',').map((f: string) => f.trim()).filter(Boolean);
        } else {
          submitData.facilities = [];
        }
        if (values.description) submitData.description = values.description;

        await baseService.updateBase(id as string, submitData);
        addNotification({ type: 'success', title: 'Base Updated', message: `${values.name} has been updated successfully.` });
        toast.success('Base updated successfully');
        router.push(`/bases/${id}`);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to update base');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isLoading || !base) return <LoadingScreen />;
  if (user && user.role !== 'Admin') return null;

  return (
    <>
      <Head><title>Edit {base.name} | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">Edit Base: {base.name}</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Base Information</h3>
                    <p className="form-section-desc">Name, location, type, and command.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="name" className="form-label">Base Name <span className="form-required">*</span></label>
                      <input type="text" name="name" id="name" className="form-input"
                        value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.name && formik.errors.name && <p className="form-error">{String(formik.errors.name)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="location" className="form-label">Location <span className="form-required">*</span></label>
                      <input type="text" name="location" id="location" className="form-input"
                        value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.location && formik.errors.location && <p className="form-error">{String(formik.errors.location)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="type" className="form-label">Type <span className="form-required">*</span></label>
                      <select id="type" name="type" className="form-select" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Type</option>
                        {['Army', 'Navy', 'AirForce', 'Joint', 'Training', 'Logistics'].map(t => (
                          <option key={t} value={t}>{t === 'AirForce' ? 'Air Force' : t}</option>
                        ))}
                      </select>
                      {formik.touched.type && formik.errors.type && <p className="form-error">{String(formik.errors.type)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                        <option value="Operational">Operational</option>
                        <option value="UnderConstruction">Under Construction</option>
                        <option value="Decommissioned">Decommissioned</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="commander" className="form-label">Commander</label>
                      <select id="commander" name="commander" className="form-select" value={formik.values.commander} onChange={formik.handleChange}>
                        <option value="">Select Commander (optional)</option>
                        {soldiers.map((s: any) => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Capacity & Location</h3>
                    <p className="form-section-desc">Capacity, coordinates, and facilities.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="capacity" className="form-label">Capacity <span className="form-required">*</span></label>
                      <input type="number" name="capacity" id="capacity" className="form-input" min="1"
                        value={formik.values.capacity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.capacity && formik.errors.capacity && <p className="form-error">{String(formik.errors.capacity)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="currentOccupancy" className="form-label">Current Occupancy</label>
                      <input type="number" name="currentOccupancy" id="currentOccupancy" className="form-input" min="0"
                        value={formik.values.currentOccupancy} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="latitude" className="form-label">Latitude</label>
                      <input type="number" step="any" name="latitude" id="latitude" className="form-input"
                        value={formik.values.latitude} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="longitude" className="form-label">Longitude</label>
                      <input type="number" step="any" name="longitude" id="longitude" className="form-input"
                        value={formik.values.longitude} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="facilities" className="form-label">Facilities</label>
                      <input type="text" name="facilities" id="facilities" className="form-input"
                        value={formik.values.facilities} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      <p className="mt-1 text-xs text-gray-400">Comma-separated list of facilities</p>
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea name="description" id="description" rows={3} className="form-textarea"
                        value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <Link href={`/bases/${id}`} className="btn btn-secondary">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formik.isValid}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </span>
                    ) : 'Update Base'}
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

export default EditBasePage;
