import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { missionService, soldierService, unitService } from '@/services/mrmsService';
import { useNotificationStore } from '@/stores/notificationStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MissionSchema = Yup.object().shape({
  name: Yup.string().required('Mission name is required'),
  code: Yup.string().required('Mission code is required'),
  type: Yup.string().oneOf(['Combat', 'Reconnaissance', 'Peacekeeping', 'Training', 'Humanitarian', 'Logistics', 'Other']).required('Mission type is required'),
  status: Yup.string().oneOf(['Planning', 'Active', 'Completed', 'Cancelled', 'OnHold']).default('Planning'),
  priority: Yup.string().oneOf(['Critical', 'High', 'Medium', 'Low']).default('Medium'),
  description: Yup.string(),
  location: Yup.string(),
  startDate: Yup.date().nullable(),
  endDate: Yup.date().nullable(),
  personnelCount: Yup.number().min(0).nullable(),
});

const NewMissionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soldiers, setSoldiers] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('You do not have permission to create missions');
      router.push('/missions');
    }
    loadDropdownData();
  }, [user, router]);

  const loadDropdownData = async () => {
    try {
      const [soldiersData, unitsData] = await Promise.all([
        soldierService.getSoldiers({ limit: 200 }),
        unitService.getUnits({ limit: 100 }),
      ]);
      setSoldiers(Array.isArray(soldiersData) ? soldiersData : (soldiersData as any).soldiers || []);
      setUnits(Array.isArray(unitsData) ? unitsData : (unitsData as any).units || []);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast.error('Failed to load form options');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      type: '',
      status: 'Planning',
      priority: 'Medium',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      commander: '',
      assignedUnits: [] as string[],
      personnelCount: '',
      objectives: '',
      notes: '',
    },
    validationSchema: MissionSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const submitData: any = { ...values };
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === '' || (Array.isArray(submitData[key]) && submitData[key].length === 0)) delete submitData[key];
        });
        // Convert objectives from string to array
        if (values.objectives) {
          submitData.objectives = values.objectives.split('\n').map((o: string) => o.trim()).filter(Boolean);
        }
        if (values.personnelCount) {
          submitData.personnelCount = Number(values.personnelCount);
        }
        // Ensure required fields
        submitData.name = values.name;
        submitData.code = values.code;
        submitData.type = values.type;
        submitData.status = values.status;
        submitData.priority = values.priority;

        const newMission = await missionService.createMission(submitData);
        addNotification({ type: 'success', title: 'Mission Created', message: `Mission ${newMission.name} has been created successfully.` });
        toast.success('Mission created successfully');
        router.push(`/missions/${newMission._id}`);
      } catch (error: any) {
        console.error('Error creating mission:', error);
        toast.error(error.response?.data?.error || 'Failed to create mission');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (user && user.role !== 'Admin') return null;

  return (
    <>
      <Head><title>Create Mission | MRMS</title></Head>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="page-header">
            <button onClick={() => router.back()} className="page-header-back">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="page-title">Create New Mission</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="form-card">
            <div className="form-card-body">
              <form onSubmit={formik.handleSubmit}>
                {/* Section: Basic Info */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Basic Information</h3>
                    <p className="form-section-desc">Enter the mission name, code, type, and priority level.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="name" className="form-label">Mission Name <span className="form-required">*</span></label>
                      <input type="text" name="name" id="name" className="form-input" placeholder="e.g. Operation Thunder"
                        value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.name && formik.errors.name && <p className="form-error">{String(formik.errors.name)}</p>}
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="code" className="form-label">Mission Code <span className="form-required">*</span></label>
                      <input type="text" name="code" id="code" className="form-input" placeholder="e.g. OPS-2024-001"
                        value={formik.values.code} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      {formik.touched.code && formik.errors.code && <p className="form-error">{String(formik.errors.code)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="type" className="form-label">Type <span className="form-required">*</span></label>
                      <select id="type" name="type" className="form-select" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Select Type</option>
                        {['Combat', 'Reconnaissance', 'Peacekeeping', 'Training', 'Humanitarian', 'Logistics', 'Other'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {formik.touched.type && formik.errors.type && <p className="form-error">{String(formik.errors.type)}</p>}
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                        {['Planning', 'Active', 'Completed', 'Cancelled', 'OnHold'].map(s => (
                          <option key={s} value={s}>{s === 'OnHold' ? 'On Hold' : s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 form-group">
                      <label htmlFor="priority" className="form-label">Priority</label>
                      <select id="priority" name="priority" className="form-select" value={formik.values.priority} onChange={formik.handleChange}>
                        {['Critical', 'High', 'Medium', 'Low'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Details */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Mission Details</h3>
                    <p className="form-section-desc">Provide the description, location, personnel, and timeline.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea name="description" id="description" rows={3} className="form-textarea" placeholder="Brief description of the mission..."
                        value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input type="text" name="location" id="location" className="form-input" placeholder="e.g. Zone Alpha, Sector 7"
                        value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="personnelCount" className="form-label">Personnel Count</label>
                      <input type="number" name="personnelCount" id="personnelCount" className="form-input" placeholder="0" min="0"
                        value={formik.values.personnelCount} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="startDate" className="form-label">Start Date</label>
                      <input type="date" name="startDate" id="startDate" className="form-input"
                        value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="endDate" className="form-label">End Date</label>
                      <input type="date" name="endDate" id="endDate" className="form-input"
                        value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                {/* Section: Assignment */}
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Assignment</h3>
                    <p className="form-section-desc">Designate the commander, objectives, and any relevant notes.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 form-group">
                      <label htmlFor="commander" className="form-label">Commander</label>
                      <select id="commander" name="commander" className="form-select" value={formik.values.commander} onChange={formik.handleChange}>
                        <option value="">Select Commander (optional)</option>
                        {soldiers.map((s: any) => (
                          <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.serviceId})</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="objectives" className="form-label">Objectives</label>
                      <textarea name="objectives" id="objectives" rows={3} className="form-textarea" placeholder="Enter each objective on a new line..."
                        value={formik.values.objectives} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      <p className="mt-1 text-xs text-gray-400">Enter each objective on a separate line</p>
                    </div>
                    <div className="sm:col-span-6 form-group">
                      <label htmlFor="notes" className="form-label">Notes</label>
                      <textarea name="notes" id="notes" rows={3} className="form-textarea" placeholder="Additional notes..."
                        value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <Link href="/missions" className="btn btn-secondary">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formik.isValid}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create Mission'}
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

export default NewMissionPage;
