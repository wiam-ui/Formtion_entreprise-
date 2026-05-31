import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard/dashboard";
import EmployeesList from "./pages/hr/employees-list";
import FormationsList from "./pages/hr/formations-list";
import SessionsList from "./pages/hr/sessions-list";
import InscriptionsList from "./pages/hr/inscriptions-list";
import { MyTrainingsPage } from "./pages/employee/my-trainings";
import { MySessionsPage } from "./pages/employee/my-sessions";
import { MyCertificatesPage } from "./pages/employee/my-certificates";
import { ProfilePage } from "./pages/employee/profile";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { MainLayout } from "./components/main-layout";
import { Role } from "./types";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to='/login' replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute allowedRoles={[Role.HR]}><EmployeesList /></ProtectedRoute>} />
          <Route path="/formations" element={<ProtectedRoute><FormationsList /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute allowedRoles={[Role.HR]}><SessionsList /></ProtectedRoute>} />
          <Route path="/inscriptions" element={<ProtectedRoute allowedRoles={[Role.HR]}><InscriptionsList /></ProtectedRoute>} />
      

          <Route path="/my-trainings" element={<ProtectedRoute allowedRoles={[Role.EMPLOYEE]}><MyTrainingsPage /></ProtectedRoute>} />
          <Route path="/my-sessions" element={<ProtectedRoute allowedRoles={[Role.EMPLOYEE]}><MySessionsPage /></ProtectedRoute>} />
          <Route path="/my-certificates" element={<ProtectedRoute allowedRoles={[Role.EMPLOYEE]}><MyCertificatesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={[Role.EMPLOYEE]}><ProfilePage /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;