import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  Package,
  Star,
  XCircle,
  CheckCircle
} from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data } = await axios.get(`/customer/tasks/${id}`);
      setTask(data.data);
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTask = async () => {
    if (!window.confirm('Are you sure you want to cancel this task?')) {
      return;
    }

    try {
      await axios.put(`/customer/tasks/${id}/cancel`);
      toast.success('Task cancelled successfully!');
      fetchTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel task');
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
      case 'completed':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-blue-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <Layout title="Task Details">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return null;
  }

  const canCancel = task.status === 'pending' || task.status === 'accepted';
  const canRate = task.status === 'completed' && !task.rating;

  return (
    <Layout title="Task Details">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            {getStatusIcon(task.status)}
            <span className={getStatusBadge(task.status)}>
              {task.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Task Information */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
              <p className="text-gray-600 mt-2">{task.description}</p>
            </div>
            <Package size={32} className="text-primary-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Category & Price */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-lg capitalize">{task.category.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-2xl font-bold text-primary-600">₹{task.estimatedPrice}</p>
              </div>
            </div>

            {/* Scheduled Time */}
            <div>
              <label className="text-sm font-medium text-gray-500">Scheduled Time</label>
              <p className="text-lg">
                {new Date(task.scheduledTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary-600" />
            Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Pickup Location</label>
              <p className="text-gray-800 mt-1">{task.pickupLocation.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Drop Location</label>
              <p className="text-gray-800 mt-1">{task.dropLocation.address}</p>
            </div>
          </div>
        </div>

        {/* Helper Information */}
        {task.helper && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Helper Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-medium">{task.helper.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg flex items-center gap-2">
                  <Phone size={16} />
                  {task.helper.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg flex items-center gap-2">
                  <Mail size={16} />
                  {task.helper.email}
                </p>
              </div>
              {task.helper.helperProfile?.rating > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <p className="text-lg flex items-center gap-2">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    {task.helper.helperProfile.rating.toFixed(1)} / 5.0
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating Display */}
        {task.rating && (
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star size={20} className="text-yellow-600" />
              Your Rating
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= task.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              ))}
              <span className="text-lg font-semibold ml-2">{task.rating} / 5</span>
            </div>
            {task.review && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-600">Your Review</label>
                <p className="text-gray-800 mt-1">{task.review}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="card bg-gray-50">
          <div className="flex gap-4">
            {canCancel && (
              <button
                onClick={handleCancelTask}
                className="btn btn-error flex items-center gap-2"
              >
                <XCircle size={20} />
                Cancel Task
              </button>
            )}

            {canRate && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Star size={20} />
                Rate Helper
              </button>
            )}

            {!canCancel && !canRate && task.status !== 'completed' && (
              <p className="text-gray-600 italic">
                No actions available for this task at the moment.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          taskId={task._id}
          helperName={task.helper?.name}
          onClose={() => setShowRatingModal(false)}
          onSuccess={() => {
            setShowRatingModal(false);
            fetchTask();
          }}
        />
      )}
    </Layout>
  );
}

// Rating Modal Component
function RatingModal({ taskId, helperName, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(`/customer/tasks/${taskId}/rate`, { rating, review });
      toast.success('Rating submitted successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Rate Helper</h2>
        <p className="text-gray-600 mb-6">How was your experience with {helperName}?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="input"
              placeholder="Share your experience..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
