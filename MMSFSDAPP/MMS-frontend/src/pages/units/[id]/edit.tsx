import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { unitService, baseService, soldierService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UnitSchema = Yup.object().shape({
  name: Yup.string().required('Unit name is required'),
  type: Yup.string().oneOf(['Infantry', 'Armor', 'Artillery', 'Engineering', 'Signal', 'Medical', 'Logistics', 'Special Forces', 'Aviation', 'Other']).required('Unit type is required'),
  capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
  status: Yup.string().oneOf(['Active', 'Deployed', 'StandBy', 'Disbanded']).required(),
});

const EditUnitPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<any>(null);
  const [bases, setBases] = useState<any[]>([]);
  const [soldiers, setSoldiers] = useState<any[]>([]);
  const [allUnits, setAllUnits] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to edit units');
      router.push('/units');
    }
  }, [user, router]);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [unitData, basesData, soldiersData, unitsData] = await Promise.all([
        unitService.getUnit(id as string),
        baseService.getBases(),
        soldierService.getSoldiers({ limit: 200 }),
        unitService.getUnits({ limit: 100 }),
      ]);
      setUnit(unitData);
      setBases(Array.isArray(basesData) ? basesData : []);
      setSoldiers(Array.isArray(soldiersData) ? soldiersData : (soldiersData as any).soldiers || []);
      setAllUnits((Array.isArray(unitsData) ? unitsData : (unitsData as any).units || []).filter((u: any) => u._id !== id));
    } catch (error) {
      toast.error('Failed to load unit data');
      router.push('/units');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: unit?.name || '',
      type: unit?.type || '',
      base: (typeof unit?.base === 'object' ? unit?.base?._id : unit?.base) || '',
      commander: (typeof unit?.commander === 'object' ? unit?.commander?._id : unit?.commander) || '',
      parentUnit: (typeof unit?.parentUnit === 'object' ? unit?.parentUnit?._id : unit?.parentUnit) || '',
      capacity: unit?.capacity || '100',
      status: unit?.status || 'Active',
      description: unit?.description || '',
      establishedDate: unit?.establishedDate ? new Date(unit.establishedDate).toISOString().split('T')[0] : '',
    },
    validationSchema: UnitSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const submitData: any = { ...values };
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === '') delete submitData[key];
        });
        submitData.name = values.name;
        submitData.type = values.type;
        submitData.status = values.status;
        if (values.capacity) submitData.capacity = Number(values.capacity);

        await unitService.updateUnit(id as string, submitData);
        addNotification({ type: 'success', title: 'Unit Updated', message: `${values.name} has been updated successfully.` });
        toast.success('Unit updated successfully');
        router.push(`/units/${id}`);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to update unit');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isLoading || !unit) return <LoadingScreen />;
  if (user && user.role !== 'Admin') return null;

  return (
    <>
      <Head><title>Edit {unit.name} | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">Edit Unit: {unit.name}</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Unit Information</h3>
                    <p className="form-section-desc">Name, type, status, and capacity.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="name" className="form-label">Unit Name <span className="form-required">*</span></label>
                      <input type="text" name="name" id="name" className="form-input"
                        value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.name && formik.errors.name && <p className="form-error">{String(formik.errors.name)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="type" className="form-label">Type <span className="form-required">*</span></label>
                      <select id="type" name="type" className="form-select" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Type</option>
                        {['Infantry', 'Armor', 'Artillery', 'Engineering', 'Signal', 'Medical', 'Logistics', 'Special Forces', 'Aviation', 'Other'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {formik.touched.type && formik.errors.type && <p className="form-error">{String(formik.errors.type)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                        <option value="Active">Active</option>
                        <option value="Deployed">Deployed</option>
                        <option value="StandBy">Stand By</option>
                        <option value="Disbanded">Disbanded</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="capacity" className="form-label">Capacity <span className="form-required">*</span></label>
                      <input type="number" name="capacity" id="capacity" className="form-input" min="1"
                        value={formik.values.capacity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.capacity && formik.errors.capacity && <p className="form-error">{String(formik.errors.capacity)}</p>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Assignment & Organization</h3>
                    <p className="form-section-desc">Base, commander, and parent unit.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="base" className="form-label">Base</label>
                      <select id="base" name="base" className="form-select" value={formik.values.base} onChange={formik.handleChange}>
                        <option value="">Select Base (optional)</option>
                        {bases.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="commander" className="form-label">Commander</label>
                      <select id="commander" name="commander" className="form-select" value={formik.values.commander} onChange={formik.handleChange}>
                        <option value="">Select Commander (optional)</option>
                        {soldiers.map((s: any) => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.serviceId})</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="parentUnit" className="form-label">Parent Unit</label>
                      <select id="parentUnit" name="parentUnit" className="form-select" value={formik.values.parentUnit} onChange={formik.handleChange}>
                        <option value="">Select Parent Unit (optional)</option>
                        {allUnits.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="establishedDate" className="form-label">Established Date</label>
                      <input type="date" name="establishedDate" id="establishedDate" className="form-input"
                        value={formik.values.establishedDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea name="description" id="description" rows={3} className="form-textarea"
                        value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <Link href={`/units/${id}`} className="btn btn-secondary">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formik.isValid}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </span>
                    ) : 'Update Unit'}
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

export default EditUnitPage;
