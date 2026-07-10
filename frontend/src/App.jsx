import { Route, Routes, Navigate } from "react-router-dom";
// Layout
import { MainLayout } from "./componets/layouts/mainlayout";
//loaging
import { Loading } from "./componets/molecules/loading";
// Auth
import { useAuth } from "./hooks/hookGlobals/useAuth";
import { LoginPage } from "./componets/pages/auth/loginPage";
// Pages
import { Profils } from "./componets/pages/profils/profiles";
import { InstitutionPage } from "./componets/pages/institution/institutionPage";
// Student/Father
import { DashboardStudentPage } from "./componets/pages/dashboard/dashboardStudentPage";
import { AttendanceStudentPage } from "./componets/pages/attendance/attendanceStudentPage";
import { BehaviorStudentPage } from "./componets/pages/behavior/behaviorStudentPage";
import { NotificationsStudentPage } from "./componets/pages/notifiacitons/notificationStudentPage";
// Assistant
import { DashboardAssitantPage } from "./componets/pages/dashboard/dashboardAssistant";
import { AttendanceControlPage } from "./componets/pages/attendance/attendanceControlPage";
import { BehaviorControlPage } from "./componets/pages/behavior/behaviorControlPage";
import { NotificationsAssistantPage } from "./componets/pages/notifiacitons/notificationsAssistantPage";
// Admin
import { DashboardAdminPage } from "./componets/pages/dashboard/dashboardAdmin";
import { RegisterUser } from "./componets/pages/admin/registerUserPage";
import { RegisterStudent } from "./componets/pages/admin/registerStudentPage";
import { AcademicManagement } from "./componets/pages/admin/academicManagement";
// Utils
import { ProtectedRoute } from "./routes/protectedRoute";
import { ROLE_ROUTES } from "./config/dashboardRutes";

function App() {
  const { isAuthenticated, userData, login, loading } = useAuth();

  // Esperar a que el AuthProvider termine de verificar la sesión
  if (loading) {
    return (
      <Loading logo={'/LOGO.png'}/>
    );
  }

  // Si no hay sesión mostrar login
  if (!isAuthenticated || !userData?.role) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Redirección inicial según el rol */}
        <Route
          path="/"
          element={
            <Navigate
              to={ROLE_ROUTES[userData.role]}
              replace
            />
          }
        />

        {/* ===================== PARENT ===================== */}

        <Route
          path="/father"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["PARENT"]}
            >
              <DashboardStudentPage userData={userData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-student"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["PARENT"]}
            >
              <AttendanceStudentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/behavior-student"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["PARENT"]}
            >
              <BehaviorStudentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications-student"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["PARENT"]}
            >
              <NotificationsStudentPage />
            </ProtectedRoute>
          }
        />

        {/* ===================== AUXILIAR ===================== */}

        <Route
          path="/assistant"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["AUXILIAR"]}
            >
              <DashboardAssitantPage userData={userData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-control"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["AUXILIAR"]}
            >
              <AttendanceControlPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/behavior-control"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["AUXILIAR"]}
            >
              <BehaviorControlPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications-assistant"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["AUXILIAR"]}
            >
              <NotificationsAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* ===================== ADMIN ===================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["ADMIN"]}
            >
              <DashboardAdminPage userData={userData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/register-user"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["ADMIN"]}
            >
              <RegisterUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/register-student"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["ADMIN"]}
            >
              <RegisterStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/academic-management"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userData.role}
              allowedRoles={["ADMIN"]}
            >
              <AcademicManagement />
            </ProtectedRoute>
          }
        />

        {/* ===================== GENERALES ===================== */}

        <Route path="/institution" element={<InstitutionPage />} />

        <Route path="/profile" element={<Profils />} />
      </Route>
    </Routes>
  );
}

export default App;