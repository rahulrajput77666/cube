import {BrowserRouter,Routes,Route,} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import UploadPage from "./pages/UploadPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import HomePage from "./pages/HomePage";
import GrantPermissionPage from "./pages/GrantPermissionPage";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import SmsPage from "./pages/SmsPage";
import ProjectPlanningPage from "./pages/ProjectPlanningPage";
import IssueTrackingPage from "./pages/IssueTrackingPage";
import ReviewPage from "./pages/ReviewPage";
import EmployeeUploadPage from "./pages/EmployeeUploadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route path="/sms" element={<SmsPage />} />
        <Route path="/project-planning" element={<ProjectPlanningPage />} />
        <Route path="/issue-tracking" element={<IssueTrackingPage />} />
        <Route path="/review" element={<ReviewPage />} />

        <Route
          path="/upload"
          element={
            <AdminLayout>
              <UploadPage />
            </AdminLayout>
          }
        />

        <Route
          path="/grant-permission"
          element={
            <AdminLayout>
              <GrantPermissionPage />
            </AdminLayout>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/users"
          element={
            <AdminLayout>
              <UserManagementPage />
            </AdminLayout>
          }
        />
        <Route
  path="/employee-upload"
  element={<EmployeeUploadPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;