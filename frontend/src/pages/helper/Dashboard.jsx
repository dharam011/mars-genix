import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  Power, 
  DollarSign, 
  Star, 
  CheckCircle, 
  Package,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function HelperDashboard() {
  const [profile, setProfile] = useState(null);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, availableRes, myTasksRes, earningsRes] = await Promise.all([
        axios.get('/helper/profile'),
        axios.get('/helper/available-tasks'),
        axios.get('/helper/my-tasks'),
        axios.get('/helper/earnings'),
      ]);
      
      setProfile(profileRes.data.data);
      setAvailableTasks(availableRes.data.data);
      setMyTasks(myTasksRes.data.data);
      setEarnings(earningsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const { data } = await axios.put('/helper/toggle-status');
      setProfile({ ...profile, isOnline: data.data.isOnline });
      toast.success(`You are now ${data.data.isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const acceptTask = async (taskId) => {
    try {
      await axios.put(`/helper/tasks/${taskId}/accept`);
      toast.success('Task accepted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/helper/tasks/${taskId}/status`, { status });
      toast.success('Task status updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <Layout title="Helper Dashboard">
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  if (!profile?.isApproved) {
    return (
      <Layout title="Helper Dashboard">
        <div className="card text-center py-12">
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pending Approval</h2>
          <p className="text-gray-600">
            Your helper profile is under review. You'll be notified once approved.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Helper Dashboard">
      <div className="space-y-6">
        {/* Stats & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Status</h3>
                <p className={`text-lg font-bold mt-2 ${profile.isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                  {profile.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className={`p-2 rounded-full ${profile.isOnline ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <Power size={20} className={profile.isOnline ? 'text-green-600' : 'text-gray-600'} />
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <DollarSign size={24} className="text-primary-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  ₹{earnings?.earnings?.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Completed Tasks</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {earnings?.completedTasks || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <Star size={24} className="text-yellow-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Rating</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {earnings?.rating?.toFixed(1) || '0.0'} ⭐
                </p>
                <p className="text-xs text-gray-500">{earnings?.totalRatings || 0} ratings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'available'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            Available Tasks ({availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'my-tasks'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            My Tasks ({myTasks.length})
          </button>
        </div>

        {/* Tasks Display */}
        <div className="space-y-4">
          {activeTab === 'available' ? (
            availableTasks.length === 0 ? (
              <div className="card text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No available tasks at the moment</p>
              </div>
            ) : (
              availableTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onAccept={() => acceptTask(task._id)}
                  showAccept
                />
              ))
            )
          ) : (
            myTasks.length === 0 ? (
              <div className="card text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No tasks assigned yet</p>
              </div>
            ) : (
              myTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdateStatus={(status) => updateTaskStatus(task._id, status)}
                  showActions
                />
              ))
            )
          )}
        </div>
      </div>
    </Layout>
  );
}

// Task Card Component
function TaskCard({ task, onAccept, onUpdateStatus, showAccept, showActions }) {
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-info',
      in_progress: 'badge badge-info',
      completed: 'badge badge-success',
    };
    return badges[status] || 'badge';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Package size={20} />
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
          {task.customer && (
            <p className="text-sm text-gray-600 mt-2">
              Customer: {task.customer.name} | {task.customer.phone}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {showAccept && (
            <button onClick={onAccept} className="btn btn-primary">
              Accept Task
            </button>
          )}

          {showActions && task.status === 'accepted' && (
            <button
              onClick={() => onUpdateStatus('in_progress')}
              className="btn btn-primary"
            >
              Start Task
            </button>
          )}

          {showActions && task.status === 'in_progress' && (
            <button
              onClick={() => onUpdateStatus('completed')}
              className="btn btn-primary"
            >
              Complete Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

