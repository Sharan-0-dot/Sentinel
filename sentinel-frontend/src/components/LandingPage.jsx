import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, FileCheck, TrendingUp, Lock, Database, Users, CheckCircle, ArrowRight, Github } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck,
      title: 'Receipt Validation',
      description: 'OCR-powered text extraction validates claims against submitted data',
      color: 'bg-blue-500'
    },
    {
      icon: AlertTriangle,
      title: 'Fraud Detection Engine',
      description: 'Multi-layered scoring system identifies suspicious claims',
      color: 'bg-yellow-500'
    },
    {
      icon: Database,
      title: 'Duplicate Detection',
      description: 'Image similarity and text comparison prevents reused receipts',
      color: 'bg-purple-500'
    },
    {
      icon: Lock,
      title: 'Policy Enforcement',
      description: 'Role-based spending limits with automated validation',
      color: 'bg-red-500'
    }
  ];

  const fraudLevels = [
    { level: 'LOW', color: 'bg-green-500', description: 'Minimal risk detected' },
    { level: 'MEDIUM', color: 'bg-yellow-500', description: 'Suspicious but acceptable' },
    { level: 'HIGH', color: 'bg-orange-500', description: 'Likely fraud' },
    { level: 'CONFIRMED', color: 'bg-red-500', description: 'Strong fraud indicators' }
  ];

  const workflowSteps = [
    'Employee submits reimbursement request with receipt image',
    'Receipt uploaded to cloud storage and processed via OCR',
    'Extracted data validated against submitted claim details',
    'Fraud detection engine runs validation and similarity checks',
    'Fraud score calculated and risk level assigned',
    'Request reviewed based on fraud level (LOW/MEDIUM/HIGH/CONFIRMED)'
  ];

  const techStack = ['Java', 'Spring Boot', 'PostgreSQL', 'Tesseract OCR', 'Docker', 'Kubernetes' ,'REST APIs', 'React', 'Tailwind CSS'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SENTINEL</h1>
                <p className="text-sm text-gray-600">Reimbursement Fraud Detection System</p>
              </div>
            </div>

            <a
              href="https://github.com/Sharan-0-dot/Sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
              title="View project on GitHub"
            >
              <Github className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>

      {/* Demo Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3 text-blue-800">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm md:text-base font-medium text-center">
              This application is a <span className="font-semibold">UI demonstration</span> of a
              production-grade reimbursement fraud detection system.
              The complete backend architecture includes OCR pipelines, fraud scoring engines,
              and policy enforcement services.
              <span className="ml-1">
                The demo is currently deployed on an
                <span className="font-semibold"> AWS EC2 instance</span>.
                Organizations interested in customization, integration, or further development may contact
                <a
                  href="mailto:sharansc482@gmail.com"
                  className="font-semibold underline ml-1 hover:text-blue-900"
                >
                  sharansc482@gmail.com
                </a>.
              </span>
            </p>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Fraud Detection
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Protect your organization from fraudulent reimbursement claims with intelligent OCR validation, 
            duplicate detection, and automated fraud scoring.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/admin')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Admin Console
            </button>
            <button
              onClick={() => navigate('/employee-login')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Employee Portal
            </button>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-lg shadow mb-8 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 rounded-lg p-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">The Problem I Solved</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Organizations lose millions annually to fraudulent reimbursement claims through duplicate submissions, 
                inflated amounts, and policy violations. Manual verification is time-consuming and error-prone. 
                Sentinel automates fraud detection using OCR, image comparison, and intelligent scoring to flag 
                suspicious claims before they're approved.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6"
                >
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow mb-8 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Levels */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Fraud Risk Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fraudLevels.map((level, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className={`${level.color} w-full h-2 rounded-full mb-4`}></div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h4>
                <p className="text-gray-600 text-sm">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Reimbursement Service</h4>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Receipt image processing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                OCR text extraction
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Fraud detection engine
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Request status management
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Policy Management Service</h4>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Employee management
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Policy assignment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Reimbursement limits
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Role-based access
              </li>
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold border border-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Built with microservices architecture for production-ready fraud detection
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            Sentinel - Protecting organizations from reimbursement fraud
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;