import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReimbursementRequests from "./components/ReimbursementRequests";
import AdminHome from "./components/AdminHome";
import PolicyManagement from './components/PolicyManagement';
import EmployeeManagement from './components/Employeemanagement';
import LandingPage from './components/LandingPage';
import EmployeeLogin from './components/Employeelogin';
import EmployeeHome from './components/EmployeeHome';
import CreateRequest from './components/CreateRequest';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
          
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee-home" element={<EmployeeHome />} />
          <Route path="/employee/create-request" element={<CreateRequest />} />
          
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/requests" element={<ReimbursementRequests />} />
          <Route path="/admin/policies" element={<PolicyManagement />} />
          <Route path="/admin/employees" element={<EmployeeManagement />} />

          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
