
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginForm />} />
          
          {/* Student Routes */}
          <Route path="student/*" element={
            <ProtectedRoute userType="student">
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="attendance" element={<div>Student Attendance Page</div>} />
                <Route path="marks" element={<div>Student Marks Page</div>} />
                <Route path="timetable" element={<div>Student Timetable Page</div>} />
                <Route path="papers" element={<div>Question Papers Page</div>} />
                <Route path="notifications" element={<div>Notifications Page</div>} />
                <Route path="feedback" element={<div>Feedback Page</div>} />
                <Route path="downloads" element={<div>Downloads Page</div>} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <ProtectedRoute userType="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<div>Admin Students Page</div>} />
                <Route path="attendance" element={<div>Admin Attendance Page</div>} />
                <Route path="marks" element={<div>Admin Marks Page</div>} />
                <Route path="timetable" element={<div>Admin Timetable Page</div>} />
                <Route path="papers" element={<div>Admin Question Papers Page</div>} />
                <Route path="notifications" element={<div>Admin Notifications Page</div>} />
                <Route path="feedback" element={<div>Admin Feedback Page</div>} />
                <Route path="downloads" element={<div>Admin Downloads Page</div>} />
                <Route path="settings" element={<div>Admin Settings Page</div>} />
              </Routes>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
