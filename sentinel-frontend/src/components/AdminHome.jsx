import { useNavigate } from 'react-router-dom';
import { FileText, Users, TrendingUp, Shield } from 'lucide-react';

const AdminHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Reimbursement Requests',
      description: 'View and manage all reimbursement requests',
      icon: FileText,
      color: 'bg-blue-500',
      path: '/admin/requests',
      stats: 'View All Requests'
    },
    {
      title: "Policy Management",
      description: "Configure role-based spending limits and approval policies",
      icon: Shield,
      color: "bg-red-500",
      path: "/admin/policies",
      stats: "Manage Policies"
    },
    {
      title: 'Employee Management',
      description: 'Manage employee accounts and permissions',
      icon: Users,
      color: 'bg-green-500',
      path: '/admin/employees',
      stats: 'Manage Employee'
    },
    {
      title: 'Analytics',
      description: 'View reports and spending analytics',
      icon: TrendingUp,
      color: 'bg-purple-500',
      path: '/admin/analytics',
      stats: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SENTINEL</h1>
              <p className="text-gray-600 mt-1">Manage reimbursements and monitor fraud detection</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            const isEnabled = card.path === '/admin/requests' || card.path === '/admin/policies' || card.path === '/admin/employees';
            return (
              <div
                key={card.title}
                onClick={() => isEnabled && navigate(card.path)}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-all ${
                  isEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-600 mb-4">{card.description}</p>
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        {card.stats}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;