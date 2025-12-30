import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { Plus, Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/customer/tasks');
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-info',
      in_progress: 'badge badge-info',
      completed: 'badge badge-success',
      cancelled: 'badge badge-danger',
      rejected: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  return (
    <Layout title="Customer Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{tasks.length}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {tasks.filter((t) => t.status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {tasks.filter((t) => ['accepted', 'in_progress'].includes(t.status)).length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {tasks.filter((t) => t.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Create Task Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="card text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <span className={getStatusBadge(task.status)}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Category: {task.category.replace('_', ' ')}</span>
                      <span>Price: ₹{task.estimatedPrice}</span>
                      <span>
                        Scheduled: {new Date(task.scheduledTime).toLocaleDateString()}
                      </span>
                    </div>
                    {task.helper && (
                      <p className="text-sm text-gray-600 mt-2">
                        Helper: {task.helper.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/customer/tasks/${task._id}`)}
                    className="btn btn-sm btn-primary flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Task Modal - Will be implemented */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTasks();
          }}
        />
      )}
    </Layout>
  );
}

// Create Task Modal Component
function CreateTaskModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    category: 'pickup_drop',
    title: '',
    description: '',
    scheduledTime: '',
    pickupLocation: {
      address: '',
      coordinates: [0, 0],
    },
    dropLocation: {
      address: '',
      coordinates: [0, 0],
    },
  });
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  const calculatePrice = async () => {
    if (!formData.pickupLocation.address || !formData.dropLocation.address) {
      return;
    }

    setCalculatingPrice(true);
    try {
      const { data } = await axios.post('/customer/estimate-price', {
        category: formData.category,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
      });
      setEstimatedPrice(data.data.estimatedPrice);
    } catch (error) {
      console.error('Failed to calculate price:', error);
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/customer/tasks', formData);
      toast.success('Task created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
            >
              <option value="pickup_drop">Pickup & Drop</option>
              <option value="delivery">Delivery</option>
              <option value="home_service">Home Service</option>
              <option value="repair">Repair</option>
              <option value="cleaning">Cleaning</option>
              <option value="moving">Moving</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pickup Location *</label>
            <input
              type="text"
              value={formData.pickupLocation.address}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  pickupLocation: { ...formData.pickupLocation, address: e.target.value },
                });
                setEstimatedPrice(null);
              }}
              onBlur={calculatePrice}
              className="input"
              placeholder="Enter pickup address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Drop Location *</label>
            <input
              type="text"
              value={formData.dropLocation.address}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  dropLocation: { ...formData.dropLocation, address: e.target.value },
                });
                setEstimatedPrice(null);
              }}
              onBlur={calculatePrice}
              className="input"
              placeholder="Enter drop address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Time</label>
            <input
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="input"
              required
            />
          </div>

          {/* Price Estimation */}
          {(calculatingPrice || estimatedPrice) && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Estimated Price:</span>
                {calculatingPrice ? (
                  <span className="text-sm text-gray-600">Calculating...</span>
                ) : (
                  <span className="text-2xl font-bold text-primary-600">₹{estimatedPrice}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Final price may vary based on actual distance and time
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

