import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReimbursementRequests from "./components/ReimbursementRequests";
import AdminHome from "./components/AdminHome";
import PolicyManagement from './components/PolicyManagement';
import EmployeeManagement from './components/Employeemanagement';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/requests" element={<ReimbursementRequests />} />
        <Route path="/admin/policies" element={<PolicyManagement />} />
        <Route path="/admin/employees" element={<EmployeeManagement />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
