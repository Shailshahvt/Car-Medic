import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Spinner, Center } from "@chakra-ui/react";
import LocalStorage from './utils/LocalStorage';
import MainLayout from "./layouts/main_layout/index.jsx";
import AuthenticatedLayout from "./layouts/authenticated_layout/index.jsx";
import ServiceMechanics from './pages/ServiceMechanics/index.jsx'
import Confirmation from './pages/confirmation';


// Auth pages
import LogIn from "./pages/login/index.jsx";
import Register from "./pages/register/index.jsx";
import ForgotPassword from "./pages/forgot-password/index.jsx";
import ResetPassword from "./pages/reset-password/index.jsx";

// Mechanic pages
import FindAvailableSlots from './pages/find-available-slots/index.jsx';

// Protected pages (will be wrapped in AuthenticatedLayout)
// TODO: For whoever is working on this, please update the import path
import Profile from "./pages/profile/index.jsx";
import Home from "./pages/home/index.jsx";
// import PeriodicServices from "./pages/periodic-services/index.jsx";
// import ValueAddedServices from "./pages/value-services/index.jsx";
// import Mechanical from "./pages/mechanical/index.jsx";

import EmergencyService from "./pages/emergency/index.jsx";

import Sidebar from "./components/sidebar";

// Sidebar should be hidden on these routes
const hideSidebarRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password"
];

function ErrorFallback({ error }) {
  return (
    <div role="alert" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ff0000',
      borderRadius: '4px'
    }}>
      <h2>Something went wrong:</h2>
      <pre style={{ color: '#ff0000' }}>{error.message}</pre>
    </div>
  );
}

// Check if user is authenticated
const isAuthenticated = () => {
  return LocalStorage.isAuthenticated();
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    LocalStorage.rehydrateTokenIfNeeded();
    LocalStorage.ensureTokenAvailability();
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="orange.400" />
      </Center>
    ); 
  }
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <MainContent />
      </Router>
    </ErrorBoundary>
  );
}

const MainContent = () => {
  const location = useLocation();
  
  // Determine if Sidebar should be displayed
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <Box display="flex">
      {showSidebar && <Sidebar />}
      
      <Box ml={showSidebar ? "240px" : "0"} w="100%">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          
          {/* Public routes with MainLayout */}
          <Route path="/auth/login" element={
            <MainLayout>
              <LogIn />
            </MainLayout>
          } />
          <Route path="/auth/register" element={
            <MainLayout>
              <Register />
            </MainLayout>
          } />
          <Route path="/auth/forgot-password" element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          } />
          <Route path="/auth/reset-password" element={
            <MainLayout>
              <ResetPassword />
            </MainLayout>
          } />
          
          <Route path="/home" element={<Home />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/mechanic/find-available-slots" element={
            <MainLayout>
              <FindAvailableSlots />
            </MainLayout>
          } />

          <Route path="/emergency" element={
            <MainLayout>
            <EmergencyService />
            </MainLayout>
          } />

          <Route path="/services/:serviceName" element={<ServiceMechanics />} />
          <Route path="/confirmation" element={<Confirmation />} />



          {/* Protected routes with AuthenticatedLayout */}
          {/* TODO: For whoever is working on these layouts, please uncomment these cods lines as they are only placeholders. Ahmed Aredah */}
          {/* <Route path="/periodic-services" element={
            <ProtectedRoute>
              <PeriodicServices />
            </ProtectedRoute>
          } />
          <Route path="/value-services" element={
            <ProtectedRoute>
              <ValueAddedServices />
            </ProtectedRoute>
          } /> */}
          {/* <Route path="/mechanical" element={
            <ProtectedRoute>
              <Mechanical />
            </ProtectedRoute>
          } />  */}
          
          
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
