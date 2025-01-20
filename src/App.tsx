import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import Schedule from './pages/admin/Schedule';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeSchedule from './pages/employee/Schedule';
import EmployeeAvailability from './pages/employee/Availability';
import EmployeeProfile from './pages/employee/Profile';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Employee Routes */}
          <Route path="/" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="schedule" element={<EmployeeSchedule />} />
            <Route path="availability" element={<EmployeeAvailability />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;