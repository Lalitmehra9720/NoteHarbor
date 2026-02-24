

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateNote from "../pages/CreateNote";
import EditNote from "../pages/EditNote";

import ProtectedRoute from "../utils/ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <Routes>

      {/* Main Layout Pages */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreateNote />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditNote />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Auth Layout Pages */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

    </Routes>
  );
}

export default AppRoutes;