import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Edit2, Trash2, X, ArrowLeft, Briefcase } from 'lucide-react';
import policyApi from '../api/policyApi';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: 'ENGINEER'
  });

  const roles = ['DIRECTOR', 'MANAGER', 'TEAM_LEAD', 'ENGINEER', 'INTERN'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await policyApi.get('/employee/');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await policyApi.post('/employee/', {
        name: formData.name,
        role: formData.role
      });
      await fetchEmployees();
      closeModal();
      // Show success message from response
      if (typeof response.data === 'string' && response.data.includes('Successfully')) {
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to create employee');
      console.error('Error creating employee:', err);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await policyApi.put('/employee/', {
        id: formData.id,
        name: formData.name,
        role: formData.role
      });
      await fetchEmployees();
      closeModal();
      // Show success message from response
      if (typeof response.data === 'string' && response.data.includes('successfull')) {
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to update employee');
      console.error('Error updating employee:', err);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete employee "${name}"?`)) {
      try {
        await policyApi.delete(`/employee/${id}`);
        await fetchEmployees();
        setError(null);
      } catch (err) {
        setError(err.response?.data || 'Failed to delete employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      id: '',
      name: '',
      role: 'ENGINEER'
    });
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData({
      id: employee.id,
      name: employee.name,
      role: employee.role
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setFormData({
      id: '',
      name: '',
      role: 'ENGINEER'
    });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      handleCreateEmployee();
    } else {
      handleUpdateEmployee();
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      DIRECTOR: 'bg-purple-100 text-purple-800 border-purple-200',
      MANAGER: 'bg-blue-100 text-blue-800 border-blue-200',
      TEAM_LEAD: 'bg-green-100 text-green-800 border-green-200',
      ENGINEER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      INTERN: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleIcon = (role) => {
    return <Briefcase className="w-4 h-4" />;
  };

  const getEmployeesByRole = () => {
    const grouped = {};
    roles.forEach(role => {
      grouped[role] = employees.filter(emp => emp.role === role);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  const employeesByRole = getEmployeesByRole();

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
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600 mt-1">Manage employee accounts and permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-green-500" />
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Roles Configured</p>
                <p className="text-3xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Most Common Role</p>
                <p className="text-xl font-bold text-gray-900">
                  {employees.length > 0 
                    ? Object.entries(employeesByRole)
                        .sort(([,a], [,b]) => b.length - a.length)[0][0]
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
          
          {employees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first employee</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add First Employee
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Group by Role */}
              {roles.map(role => {
                const roleEmployees = employeesByRole[role];
                if (roleEmployees.length === 0) return null;
                
                return (
                  <div key={role} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(role)}`}>
                        {role}
                      </span>
                      <span className="text-sm text-gray-500">
                        {roleEmployees.length} {roleEmployees.length === 1 ? 'employee' : 'employees'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roleEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-full">
                                <Users className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                                <p className="text-xs text-gray-500">ID: {employee.id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => openEditModal(employee)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Employee"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Employee"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create New Employee Button at Bottom */}
        {employees.length > 0 && (
          <div className="mt-6">
            <button
              onClick={openCreateModal}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Employee
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
                  {modalMode === 'create' ? 'Add New Employee' : 'Edit Employee'}
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
              {modalMode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Employee ID cannot be changed</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Policy will be automatically assigned based on the selected role.
                </p>
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
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {modalMode === 'create' ? 'Add Employee' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;