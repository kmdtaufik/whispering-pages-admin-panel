import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import Products from "./pages/Products/Products";
import EditProduct from "./pages/EditProduct/EditProduct";
import Layout from "./components/Layout/Layout";
import Users from "./pages/Users/users";
import CreateUser from "./pages/CreateUser/CreateUser";
import ViewUser from "./pages/ViewUser/ViewUser";
import EditUser from "./pages/EditUser/EditUser";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // If no user is found, redirect to login
  if (!user) {
    return <Login />;
  }

  // If user exists, render the protected content
  return children;
};

// Public Route Component (for login/register)
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // If user is already logged in, redirect to home
  if (user) {
    return (
      <ProtectedRoute>
        <Layout>
          <Home />
        </Layout>
      </ProtectedRoute>
    );
  }

  // If no user, show public content (login/register)
  return children;
};

// Create the root element and render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes - NO Layout */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes - WITH Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-product"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateProduct />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditProduct />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/list"
          element={
            <ProtectedRoute>
              <Layout>
                <ViewUser />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditUser />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">
                  Categories page coming soon...
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">
                  Orders page coming soon...
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">
                  Customers page coming soon...
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">
                  Analytics page coming soon...
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">
                  Settings page coming soon...
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8 text-center">Page not found</div>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
