import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Policies from "./pages/Policies";
import Approvals from "./pages/Approvals";
import Compliances from "./pages/Compliance";
import Notifications from "./pages/Notifications";
import Audit from "./pages/Audit";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>

            <Routes>

              {/* Login */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />


              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/employees"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                    <Layout>
                      <Employees />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/policies"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                    <Layout>
                      <Policies />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/compliance"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                    <Layout>
                      <Compliances />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/approvals"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                    <Layout>
                      <Approvals />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/notifications"
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              <Route
                path="/audit"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <Layout>
                      <Audit />
                    </Layout>
                  </ProtectedRoute>
                }
              />

            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />

          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
