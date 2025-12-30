import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Package, 
  DollarSign, 
  UserCheck, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingHelpers, setPendingHelpers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, helpersRes, tasksRes, usersRes] = await Promise.all([
        axios.get('/admin/analytics'),
        axios.get('/admin/helpers/pending'),
        axios.get('/admin/tasks'),
        axios.get('/admin/users'),
      ]);

      setAnalytics(analyticsRes.data.data);
      setPendingHelpers(helpersRes.data.data);
      setAllTasks(tasksRes.data.data);
      setAllUsers(usersRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const approveHelper = async (helperId, isApproved) => {
    try {
      await axios.put(`/admin/helpers/${helperId}/approve`, { isApproved });
      toast.success(`Helper ${isApproved ? 'approved' : 'rejected'} successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update helper status');
    }
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-start gap-3">
              <Users size={24} className="text-blue-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {analytics?.users?.total || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.users?.customers || 0} customers, {analytics?.users?.helpers || 0} helpers
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <Package size={24} className="text-purple-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {analytics?.tasks?.total || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.tasks?.completed || 0} completed
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <DollarSign size={24} className="text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ₹{analytics?.revenue?.total || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: ₹{Math.round(analytics?.revenue?.average || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <UserCheck size={24} className="text-yellow-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Pending Approvals</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {analytics?.users?.pendingApprovals || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.users?.activeHelpers || 0} active helpers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('pending-helpers')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'pending-helpers'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            Pending Helpers ({pendingHelpers.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'tasks'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            All Tasks ({allTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            All Users ({allUsers.length})
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && (
            <OverviewTab analytics={analytics} />
          )}
          
          {activeTab === 'pending-helpers' && (
            <PendingHelpersTab
              helpers={pendingHelpers}
              onApprove={approveHelper}
            />
          )}
          
          {activeTab === 'tasks' && (
            <TasksTab tasks={allTasks} />
          )}

          {activeTab === 'users' && (
            <UsersTab users={allUsers} onUpdate={fetchData} />
          )}
        </div>
      </div>
    </Layout>
  );
}

// Overview Tab
function OverviewTab({ analytics }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Task Distribution by Category</h3>
        <div className="space-y-2">
          {analytics?.tasks?.byCategory?.map((cat) => (
            <div key={cat._id} className="flex justify-between items-center">
              <span className="text-gray-700 capitalize">{cat._id?.replace('_', ' ')}</span>
              <span className="font-semibold">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {analytics?.recentTasks?.slice(0, 5).map((task) => (
            <div key={task._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.customer?.name} → {task.helper?.name || 'Unassigned'}
                </p>
              </div>
              <span className="badge badge-info">{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pending Helpers Tab
function PendingHelpersTab({ helpers, onApprove }) {
  if (helpers.length === 0) {
    return (
      <div className="card text-center py-12">
        <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No pending helper approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {helpers.map((helper) => (
        <div key={helper._id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{helper.user?.name}</h3>
              <p className="text-gray-600">{helper.user?.email}</p>
              <p className="text-gray-600">{helper.user?.phone}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Categories: {helper.categories?.join(', ') || 'None'}
                </p>
                <p className="text-sm text-gray-500">
                  Experience: {helper.experience} years
                </p>
                <p className="text-sm text-gray-500">
                  Vehicle: {helper.vehicleType}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(helper._id, true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button
                onClick={() => onApprove(helper._id, false)}
                className="btn btn-danger flex items-center gap-2"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Tasks Tab
function TasksTab({ tasks }) {
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

  if (tasks.length === 0) {
    return (
      <div className="card text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="card">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <span className={getStatusBadge(task.status)}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p>Customer: {task.customer?.name}</p>
                  <p>Helper: {task.helper?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <p>Category: {task.category.replace('_', ' ')}</p>
                  <p>Price: ₹{task.estimatedPrice}</p>
                  <p>Date: {new Date(task.scheduledTime).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Users Tab
function UsersTab({ users, onUpdate }) {
  const [filter, setFilter] = useState('all'); // all, customer, helper, admin
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      toast.success('User status updated!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesRole = filter === 'all' || user.role === filter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="helper">Helpers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{user.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-error' :
                      user.role === 'helper' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      user.isActive ? 'badge-success' : 'badge-secondary'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`btn btn-sm ${
                          user.isActive ? 'btn-secondary' : 'btn-success'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="btn btn-sm btn-error"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

