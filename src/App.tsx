
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentPapers } from './pages/student/StudentPapers';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentFeedback } from './pages/student/StudentFeedback';
import { StudentDownloads } from './pages/student/StudentDownloads';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminMarks } from './pages/admin/AdminMarks';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminPapers } from './pages/admin/AdminPapers';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminFeedback } from './pages/admin/AdminFeedback';
import { AdminDownloads } from './pages/admin/AdminDownloads';
import { AdminSettings } from './pages/admin/AdminSettings';
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
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="marks" element={<StudentMarks />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="papers" element={<StudentPapers />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="feedback" element={<StudentFeedback />} />
                <Route path="downloads" element={<StudentDownloads />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <ProtectedRoute userType="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="marks" element={<AdminMarks />} />
                <Route path="timetable" element={<AdminTimetable />} />
                <Route path="papers" element={<AdminPapers />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="downloads" element={<AdminDownloads />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
