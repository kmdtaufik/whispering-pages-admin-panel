import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import CreateProduct from "./pages/CreateProduct/CreateProduct";

// Create the root element and render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {" "}
        {/* Paths under the root path */}
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
