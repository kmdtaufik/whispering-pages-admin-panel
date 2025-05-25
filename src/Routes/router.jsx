import React from "react";
import { createBrowserRouter } from "react-router";
import CreateProduct from "../pages/CreateProduct/CreateProduct";

const router = createBrowserRouter([
  {
    path: "/",
  },
  {
    path: "/create-product",
    element: <CreateProduct />,
  },
]);

export default router;
