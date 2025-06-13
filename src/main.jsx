import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import Products from "./pages/Products/Products";
import EditProduct from "./pages/EditProduct/EditProduct";

// Create the root element and render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route
          path="/analytics"
          element={
            <div className="p-8 text-center">Analytics page coming soon...</div>
          }
        />
        <Route
          path="*"
          element={<div className="p-8 text-center">Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
