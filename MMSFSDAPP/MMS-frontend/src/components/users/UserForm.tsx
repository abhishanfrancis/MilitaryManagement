import React, { useState } from 'react';
import { CreateUserData } from '@/services/userService';

interface UserFormProps {
  onSubmit: (data: CreateUserData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'LogisticsOfficer',
    assignedBase: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (formData.role !== 'Admin' && !formData.assignedBase) {
      newErrors.assignedBase = 'Assigned base is required for this role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username <span className="form-required">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`form-input ${errors.username ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="form-error">{errors.username}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password <span className="form-required">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${errors.password ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="form-error">{errors.password}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email <span className="form-required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="form-error">{errors.email}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Full Name <span className="form-required">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="form-error">{errors.fullName}</p>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="role" className="form-label">
          Role <span className="form-required">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-select"
          disabled={isSubmitting}
        >
          <option value="Admin">Admin</option>
          <option value="BaseCommander">Base Commander</option>
          <option value="LogisticsOfficer">Logistics Officer</option>
        </select>
      </div>
      
      {formData.role !== 'Admin' && (
        <div className="form-group">
          <label htmlFor="assignedBase" className="form-label">
            Assigned Base <span className="form-required">*</span>
          </label>
          <select
            id="assignedBase"
            name="assignedBase"
            value={formData.assignedBase}
            onChange={handleChange}
            className={`form-select ${errors.assignedBase ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select a base</option>
            <option value="Base Alpha">Base Alpha</option>
            <option value="Base Bravo">Base Bravo</option>
            <option value="Base Charlie">Base Charlie</option>
          </select>
          {errors.assignedBase && (
            <p className="form-error">{errors.assignedBase}</p>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;