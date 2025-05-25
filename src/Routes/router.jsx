import React from "react";
import { createBrowserRouter } from "react-router";
import CreateProduct from "../pages/CreateProduct/CreateProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateProduct></CreateProduct>,
  },
  {
    path: "/create-product",
    element: <CreateProduct />,
  },
]);

export default router;
