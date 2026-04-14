import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

// Main App Layout Component (INSIDE AuthProvider)
const AppLayout = () => {
  const { token } = useContext(AuthContext);

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Show Navbar and Sidebar only if user is logged in */}
      {token && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

      <Routes>
        {/* Public Routes - NO Sidebar/Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              {/* Main content area with proper spacing for sidebar */}
              <main className="hidden md:block pt-24 md:ml-64 p-8 min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>

              {/* Mobile layout */}
              <main className="md:hidden pt-24 p-4 pb-20 min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
