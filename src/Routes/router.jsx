import React from "react";
import { createBrowserRouter } from "react-router";
import CreateProduct from "../pages/CreateProduct/CreateProduct";
import Products from "../pages/Products/Products";
import Home from "../pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create-product",
    element: <CreateProduct />,
  },
  {
    path: "/products",
    element: <Products />,
  },
]);

export default router;
