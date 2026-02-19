import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService, baseService, unitService, soldierService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const EquipmentSchema = Yup.object().shape({
  name: Yup.string().required('Equipment name is required'),
  serialNumber: Yup.string().required('Serial number is required'),
  type: Yup.string().oneOf(['Vehicle', 'Weapon', 'Communication', 'Medical', 'Engineering', 'Aviation', 'Ammunition', 'Other']).required('Equipment type is required'),
  status: Yup.string().oneOf(['Operational', 'UnderMaintenance', 'Damaged', 'Decommissioned', 'InTransit']).default('Operational'),
  condition: Yup.string().oneOf(['New', 'Good', 'Fair', 'Poor', 'Critical']).default('Good'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').default(1),
});

const NewEquipmentPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bases, setBases] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [soldiers, setSoldiers] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to add equipment');
      router.push('/equipment');
    }
    loadDropdownData();
  }, [user, router]);

  const loadDropdownData = async () => {
    try {
      const [basesData, unitsData, soldiersData] = await Promise.all([
        baseService.getBases(),
        unitService.getUnits({ limit: 100 }),
        soldierService.getSoldiers({ limit: 200 }),
      ]);
      setBases(Array.isArray(basesData) ? basesData : []);
      setUnits(Array.isArray(unitsData) ? unitsData : (unitsData as any).units || []);
      setSoldiers(Array.isArray(soldiersData) ? soldiersData : (soldiersData as any).soldiers || []);
    } catch (error) {
      toast.error('Failed to load form options');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      serialNumber: '',
      type: '',
      category: '',
      base: '',
      assignedUnit: '',
      assignedSoldier: '',
      status: 'Operational',
      condition: 'Good',
      quantity: '1',
      acquisitionDate: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      notes: '',
    },
    validationSchema: EquipmentSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const submitData: any = { ...values };
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === '') delete submitData[key];
        });
        submitData.name = values.name;
        submitData.serialNumber = values.serialNumber;
        submitData.type = values.type;
        submitData.status = values.status;
        submitData.condition = values.condition;
        if (values.quantity) submitData.quantity = Number(values.quantity);

        const newEquipment = await equipmentService.createEquipment(submitData);
        addNotification({ type: 'success', title: 'Equipment Added', message: `${newEquipment.name} has been added successfully.` });
        toast.success('Equipment added successfully');
        router.push(`/equipment/${newEquipment._id}`);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to add equipment');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (user && user.role !== 'Admin') return null;

  return (
    <>
      <Head><title>Add Equipment | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">Add New Equipment</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Equipment Information</h3>
                    <p className="form-section-desc">Enter the basic details and classification of the equipment.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="name" className="form-label">Name <span className="form-required">*</span></label>
                      <input type="text" name="name" id="name" className="form-input" placeholder="e.g. M4A1 Carbine"
                        value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.name && formik.errors.name && <p className="form-error">{String(formik.errors.name)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="serialNumber" className="form-label">Serial Number <span className="form-required">*</span></label>
                      <input type="text" name="serialNumber" id="serialNumber" className="form-input" placeholder="e.g. EQ-2024-001"
                        value={formik.values.serialNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.serialNumber && formik.errors.serialNumber && <p className="form-error">{String(formik.errors.serialNumber)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="type" className="form-label">Type <span className="form-required">*</span></label>
                      <select id="type" name="type" className="form-select" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Type</option>
                        {['Vehicle', 'Weapon', 'Communication', 'Medical', 'Engineering', 'Aviation', 'Ammunition', 'Other'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {formik.touched.type && formik.errors.type && <p className="form-error">{String(formik.errors.type)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                        <option value="Operational">Operational</option>
                        <option value="UnderMaintenance">Under Maintenance</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Decommissioned">Decommissioned</option>
                        <option value="InTransit">In Transit</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="condition" className="form-label">Condition</label>
                      <select id="condition" name="condition" className="form-select" value={formik.values.condition} onChange={formik.handleChange}>
                        {['New', 'Good', 'Fair', 'Poor', 'Critical'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="category" className="form-label">Category</label>
                      <input type="text" name="category" id="category" className="form-input" placeholder="e.g. Assault Rifle"
                        value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="quantity" className="form-label">Quantity</label>
                      <input type="number" name="quantity" id="quantity" className="form-input" min="1"
                        value={formik.values.quantity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.quantity && formik.errors.quantity && <p className="form-error">{String(formik.errors.quantity)}</p>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Assignment</h3>
                    <p className="form-section-desc">Assign this equipment to a base, unit, or soldier.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="base" className="form-label">Base</label>
                      <select id="base" name="base" className="form-select" value={formik.values.base} onChange={formik.handleChange}>
                        <option value="">Select Base (optional)</option>
                        {bases.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="assignedUnit" className="form-label">Assigned Unit</label>
                      <select id="assignedUnit" name="assignedUnit" className="form-select" value={formik.values.assignedUnit} onChange={formik.handleChange}>
                        <option value="">Select Unit (optional)</option>
                        {units.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="assignedSoldier" className="form-label">Assigned Soldier</label>
                      <select id="assignedSoldier" name="assignedSoldier" className="form-select" value={formik.values.assignedSoldier} onChange={formik.handleChange}>
                        <option value="">Select Soldier (optional)</option>
                        {soldiers.map((s: any) => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.serviceId})</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Maintenance & History</h3>
                    <p className="form-section-desc">Track acquisition and maintenance schedules.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="acquisitionDate" className="form-label">Acquisition Date</label>
                      <input type="date" name="acquisitionDate" id="acquisitionDate" className="form-input"
                        value={formik.values.acquisitionDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="lastMaintenanceDate" className="form-label">Last Maintenance</label>
                      <input type="date" name="lastMaintenanceDate" id="lastMaintenanceDate" className="form-input"
                        value={formik.values.lastMaintenanceDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="nextMaintenanceDate" className="form-label">Next Maintenance</label>
                      <input type="date" name="nextMaintenanceDate" id="nextMaintenanceDate" className="form-input"
                        value={formik.values.nextMaintenanceDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="notes" className="form-label">Notes</label>
                      <textarea name="notes" id="notes" rows={3} className="form-textarea" placeholder="Additional notes..."
                        value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <Link href="/equipment" className="btn btn-secondary">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formik.isValid}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Adding...
                      </span>
                    ) : 'Add Equipment'}
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

export default NewEquipmentPage;
