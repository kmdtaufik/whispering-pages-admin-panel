import React from "react";
import { createBrowserRouter } from "react-router";
import CreateProduct from "../pages/CreateProduct/CreateProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <createProduct />
      </React.Suspense>
    ),
  },
  {
    path: "/create-product",
    element: <CreateProduct />,
  },
]);

export default router;
