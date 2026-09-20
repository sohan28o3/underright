import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";

import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";
import AssessmentResultPage from "./pages/AssessmentResultPage";
import CopilotPage from "./pages/CopilotPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import NewAssessmentPage from "./pages/NewAssessmentPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/assessments/new"
          element={
            <NewAssessmentPage />
          }
        />

        <Route
          path="/applications"
          element={<HistoryPage />}
        />

        <Route
          path="/applications/:id"
          element={
            <ApplicationDetailsPage />
          }
        />

        <Route
          path="/applications/:id/result"
          element={
            <AssessmentResultPage />
          }
        />

        <Route
          path="/applications/:id/copilot"
          element={<CopilotPage />}
        />
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;