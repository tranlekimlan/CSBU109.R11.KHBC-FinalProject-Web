import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Auth/WelcomePage/welcome.jsx';
import LoginPage from './pages/Auth/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage/RegisterPage.jsx';
import StudentDashboard from './pages/Student/StudentDashboard/StudentDashboard.jsx';
import CreateReport from './pages/Student/CreateReport/CreateReport.jsx';
import MyReports from './pages/Student/MyReports/MyReports.jsx';
import Notifications from './pages/Student/Notifications/Notifications.jsx';
import RoleSelection from './pages/Auth/RoleSelection/RoleSelection.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard.jsx';
import WorkerDashboard from './pages/Worker/WorkerDashboard/WorkerDashboard.jsx';
import AllTickets from './pages/Admin/AdminPages/AllTickets.jsx';
import ManageWorkers from './pages/Admin/AdminPages/ManageWorkers.jsx';
import AdminReports from './pages/Admin/AdminPages/AdminReports.jsx';
import ComplaintManagement from './pages/Admin/AdminPages/ComplaintManagement.jsx';
import StudentComplaints from './pages/Student/StudentPages/StudentComplaints.jsx';
import StudentProfile from './pages/Student/StudentPages/StudentProfile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-report" element={<CreateReport />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/complain" element={<StudentComplaints />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/all-tickets" element={<AllTickets />} />
        <Route path="/manage-workers" element={<ManageWorkers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/complaints" element={<ComplaintManagement />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;