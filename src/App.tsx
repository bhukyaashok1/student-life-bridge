
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import { Index } from './pages/Index';
import { NotFound } from './pages/NotFound';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentFeedback } from './pages/student/StudentFeedback';
import { StudentDownloads } from './pages/student/StudentDownloads';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentPapers } from './pages/student/StudentPapers';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminMarks } from './pages/admin/AdminMarks';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminFeedback } from './pages/admin/AdminFeedback';
import { AdminDownloads } from './pages/admin/AdminDownloads';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminPapers } from './pages/admin/AdminPapers';
import { AdminSettings } from './pages/admin/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<LoginForm />} />
              
              {/* Student routes */}
              <Route path="/student/*" element={
                <ProtectedRoute requiredRole="student">
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="profile" element={<StudentProfile />} />
                      <Route path="attendance" element={<StudentAttendance />} />
                      <Route path="marks" entity={<StudentMarks />} />
                      <Route path="timetable" element={<StudentTimetable />} />
                      <Route path="feedback" element={<StudentFeedback />} />
                      <Route path="downloads" element={<StudentDownloads />} />
                      <Route path="notifications" element={<StudentNotifications />} />
                      <Route path="papers" element={<StudentPapers />} />
                      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="attendance" element={<AdminAttendance />} />
                      <Route path="marks" element={<AdminMarks />} />
                      <Route path="timetable" element={<AdminTimetable />} />
                      <Route path="feedback" element={<AdminFeedback />} />
                      <Route path="downloads" element={<AdminDownloads />} />
                      <Route path="notifications" element={<AdminNotifications />} />
                      <Route path="papers" element={<AdminPapers />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
