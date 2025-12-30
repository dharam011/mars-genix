import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Briefcase, Car, Clock } from 'lucide-react';

const CATEGORIES = [
  { value: 'pickup_drop', label: 'Pickup & Drop' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'home_service', label: 'Home Service' },
  { value: 'repair', label: 'Repair' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'moving', label: 'Moving' },
  { value: 'other', label: 'Other' },
];

const VEHICLE_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'van', label: 'Van' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'weekends', label: 'Weekends Only' },
];

export default function HelperProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    categories: [],
    experience: 0,
    availability: 'full_time',
    vehicleType: 'none',
    documents: {
      idProof: '',
      addressProof: '',
      photo: '',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/helper/profile');
      const profile = data.data;
      setFormData({
        categories: profile.categories || [],
        experience: profile.experience || 0,
        availability: profile.availability || 'full_time',
        vehicleType: profile.vehicleType || 'none',
        documents: profile.documents || {
          idProof: '',
          addressProof: '',
          photo: '',
        },
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put('/helper/profile', formData);
      toast.success('Profile updated successfully!');
      navigate('/helper/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Edit Profile">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/helper/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary-600" />
              Service Categories *
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the services you can provide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.categories.includes(category.value)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                    className="form-checkbox text-primary-600"
                  />
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience & Availability */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })
                  }
                  className="input"
                  placeholder="0"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} />
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                  className="input"
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car size={20} className="text-primary-600" />
              Vehicle Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                className="input"
              >
                {VEHICLE_TYPES.map((vehicle) => (
                  <option key={vehicle.value} value={vehicle.value}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Documents (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide document URLs or upload links
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof URL
                </label>
                <input
                  type="text"
                  value={formData.documents.idProof}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      documents: { ...formData.documents, idProof: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="https://example.com/id-proof.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof URL
                </label>
                <input
                  type="text"
                  value={formData.documents.addressProof}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      documents: { ...formData.documents, addressProof: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="https://example.com/address-proof.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.documents.photo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      documents: { ...formData.documents, photo: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="card bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/helper/dashboard')}
                className="btn btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={submitting}
              >
                <Save size={20} />
                {submitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

