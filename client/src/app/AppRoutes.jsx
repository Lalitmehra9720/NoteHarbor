import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ViewNote from "../pages/ViewNote";
import About from "../pages/About";
import NotesPage from "../pages/NotesPage";
import ProtectedRoute from "../utils/ProtectedRoute";
import HelpCenter from "../pages/docs/HelpCenter";
import TermsOfService from "../pages/docs/TermsOfService";
import PrivacyPolicy from "../pages/docs/PrivacyPolicy";
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
      {/* <Route path="/about" element={<About />} /> */}
       <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />
      <Route
        path="/help"
        element={
          <MainLayout>
            <HelpCenter />
          </MainLayout>
        }
      />
       <Route
        path="/privacy"
        element={
          <MainLayout>
            <PrivacyPolicy />
          </MainLayout>
        }
      />

       <Route
        path="/terms"
        element={
          <MainLayout>
            <TermsOfService />
          </MainLayout>
        }
      />
      <Route
  path="/notes"
  element={
    <ProtectedRoute>
      <MainLayout>
        <NotesPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>
      <Route
        path="/note/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ViewNote />
            </MainLayout>
          </ProtectedRoute>
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
