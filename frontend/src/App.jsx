import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/welcome.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard.jsx';
import CreateReport from './pages/CreateReport/CreateReport.jsx';
import MyReports from './pages/MyReports/MyReports.jsx';
import Notifications from './pages/Notifications/Notifications.jsx';
import RoleSelection from './pages/RoleSelection/RoleSelection.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import WorkerDashboard from './pages/WorkerDashboard/WorkerDashboard.jsx';

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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;