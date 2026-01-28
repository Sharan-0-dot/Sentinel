import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import api from '../api/axios';

const ReimbursementRequests = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/reimbursement/requests');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading requests...</div>
      </div>
    );
  }

  return ( <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Reimbursement Requests
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage employee reimbursement claims
                </p>
              </div>
            </div>  
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No requests found</div>
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
  );
};

export default ReimbursementRequests;