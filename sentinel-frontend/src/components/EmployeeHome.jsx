import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import api from '../api/axios';

const EmployeeHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get employee data from location state or sessionStorage
    const employeeData = location.state?.employee || JSON.parse(sessionStorage.getItem('employee') || 'null');
    
    if (!employeeData) {
      navigate('/employee-login');
      return;
    }
    
    setEmployee(employeeData);
    fetchRequests(employeeData.id);
  }, [location, navigate]);

  const fetchRequests = async (employeeId) => {
    try {
      const response = await api.get(`/reimbursement/requests/${employeeId}`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    navigate('/');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFraudLevelColor = (level) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800 border-green-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      CONFIRMED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!employee || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SENTINEL</h1>
                <p className="text-sm text-gray-600">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-semibold text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-500">Role: {employee.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Reimbursement Requests</h2>
            <p className="text-gray-600 mt-1">View and manage your reimbursement claims</p>
          </div>
          <button
            onClick={() => navigate('/employee/create-request')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first reimbursement request</p>
              <button
                onClick={() => navigate('/employee/create-request')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Request
              </button>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="font-semibold text-xl text-gray-900 min-w-30">
                        {formatAmount(request.amount)}
                      </div>

                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{request.vendorName}</div>
                        <div className="text-sm text-gray-500">{request.category}</div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFraudLevelColor(request.fraudLevel)}`}>
                        {request.fraudLevel}
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(request.id)}
                      className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {expandedId === request.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedId === request.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Request ID:</span>
                        <span className="ml-2 text-gray-900">{request.id}</span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Employee ID:</span>
                        <span className="ml-2 text-gray-900">{request.employeeId}</span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Expense Date:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(request.expenseDate)}
                        </span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Created At:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(request.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Fraud Score:</span>
                        <span className="ml-2 text-gray-900">
                          {request.fraudScore}/125
                        </span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <span className="ml-2 text-gray-900">{request.category}</span>
                      </div>

                      <div className="col-span-2">
                        <span className="font-medium text-gray-600 block mb-1">
                          Description:
                        </span>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                          {request.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;