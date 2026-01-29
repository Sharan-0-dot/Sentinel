import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import policyApi from '../api/policyApi';

const EmployeeLogin = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      e.preventDefault();
    
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
  
      setLoading(true);
      setError('');
  
      try {
        const response = await policyApi.get(
          `/employee/${encodeURIComponent(name.trim())}`
        );
    
        // ✅ AXIOS: data is here
        const employeeData = response.data;
    
        // Store employee data
        sessionStorage.setItem('employee', JSON.stringify(employeeData));
    
        // Navigate
        navigate('/employee-home', { state: { employee: employeeData } });
    
      } catch (err) {
        console.error('Login error:', err);
    
        if (err.response?.status === 404) {
          setError('Employee not found. Please check your name.');
        } else {
          setError('Unable to connect to server. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SENTINEL</h1>
                <p className="text-sm text-gray-600">Employee Portal</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <User className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Access</h2>
              <p className="text-gray-600">Enter your name to access your dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Portal
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your name must be registered in the system by an administrator to access the portal.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-6 text-sm">
            Need access? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;