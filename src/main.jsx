import { React, StrictMode } from "react";
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

// Create the root element and render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/list" element={<ViewUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route
            path="/categories"
            element={
              <div className="p-8 text-center">
                Categories page coming soon...
              </div>
            }
          />
          <Route
            path="/orders"
            element={
              <div className="p-8 text-center">Orders page coming soon...</div>
            }
          />
          <Route
            path="/customers"
            element={
              <div className="p-8 text-center">
                Customers page coming soon...
              </div>
            }
          />
          <Route
            path="/analytics"
            element={
              <div className="p-8 text-center">
                Analytics page coming soon...
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="p-8 text-center">
                Settings page coming soon...
              </div>
            }
          />
          <Route
            path="*"
            element={<div className="p-8 text-center">Page not found</div>}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);
