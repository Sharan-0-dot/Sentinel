import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Edit2, Trash2, X, ArrowLeft } from 'lucide-react';
import policyApi from '../api/policyApi';

const PolicyManagement = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    policyName: '',
    spendingLimit: '',
    role: 'ENGINEER'
  });

  const roles = ['DIRECTOR', 'MANAGER', 'TEAM_LEAD', 'ENGINEER', 'INTERN'];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyApi.get('/policy/');
      setPolicies(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch policies');
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      await policyApi.post('/policy/', {
        policyName: formData.policyName,
        spendingLimit: parseFloat(formData.spendingLimit),
        role: formData.role
      });
      await fetchPolicies();
      closeModal();
    } catch (err) {
      setError(err.response?.data || 'Failed to create policy');
      console.error('Error creating policy:', err);
    }
  };

  const handleUpdatePolicy = async () => {
    try {
      await policyApi.put('/policy/', {
        policyName: formData.policyName,
        spendingLimit: parseFloat(formData.spendingLimit),
        role: formData.role
      });
      await fetchPolicies();
      closeModal();
    } catch (err) {
      setError(err.response?.data || 'Failed to update policy');
      console.error('Error updating policy:', err);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm(`Are you sure you want to delete the policy "${policyId}"?`)) {
      try {
        await policyApi.delete(`/policy/${policyId}`);
        await fetchPolicies();
        setError(null);
      } catch (err) {
        setError(err.response?.data || 'Failed to delete policy');
        console.error('Error deleting policy:', err);
      }
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      policyName: '',
      spendingLimit: '',
      role: 'ENGINEER'
    });
    setShowModal(true);
  };

  const openEditModal = (policy) => {
    setModalMode('edit');
    setSelectedPolicy(policy);
    setFormData({
      policyName: policy.policyName,
      spendingLimit: policy.spendingLimit.toString(),
      role: policy.role
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
    setFormData({
      policyName: '',
      spendingLimit: '',
      role: 'ENGINEER'
    });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      handleCreatePolicy();
    } else {
      handleUpdatePolicy();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRoleColor = (role) => {
    const colors = {
      DIRECTOR: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      TEAM_LEAD: 'bg-green-100 text-green-800',
      ENGINEER: 'bg-yellow-100 text-yellow-800',
      INTERN: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
                <p className="text-gray-600 mt-1">Configure role-based spending limits and policies</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Policies</p>
              <p className="text-3xl font-bold text-gray-900">{policies.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Policies List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Policies</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {policies.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No policies yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first policy</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create First Policy
                </button>
              </div>
            ) : (
              policies.map((policy) => (
                <div key={policy.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{policy.policyName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(policy.role)}`}>
                          {policy.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium text-gray-900">
                          Spending Limit: {formatCurrency(policy.spendingLimit)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(policy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Policy"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create New Policy Button */}
        {policies.length > 0 && (
          <div className="mt-6">
            <button
              onClick={openCreateModal}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Policy
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalMode === 'create' ? 'Create New Policy' : 'Edit Policy'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Name
                </label>
                <input
                  type="text"
                  value={formData.policyName}
                  onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter policy name"
                  required
                  disabled={modalMode === 'edit'}
                />
                {modalMode === 'edit' && (
                  <p className="mt-1 text-xs text-gray-500">Policy name cannot be changed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spending Limit (₹)
                </label>
                <input
                  type="number"
                  value={formData.spendingLimit}
                  onChange={(e) => setFormData({ ...formData, spendingLimit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter spending limit"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {modalMode === 'create' ? 'Create Policy' : 'Update Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;