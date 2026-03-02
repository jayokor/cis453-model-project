import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import RequireAuth from "../auth/RequireAuth";
import RequireRole from "../auth/RequireRole";

import RestaurantsPage from "../features/restaurants/RestaurantsPage";
import RestaurantPage from "../features/restaurants/RestaurantPage";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";

import CartPage from "../features/cart/CartPage";
import OrdersPage from "../features/orders/OrdersPage";

import AdminPage from "../features/admin/AdminPage";
import RestaurantDashboard from "../features/restaurant/RestaurantDashboard";
import NotFound from "../features/misc/NotFound";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // public routes
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // protected routes
      {
        element: <RequireAuth />,
        children: [
          // customer only pages
          {
            element: <RequireRole allowed={["CUSTOMER"]} />,
            children: [
              { path: "/", element: <RestaurantsPage /> },
              { path: "/restaurants/:id", element: <RestaurantPage /> },
              { path: "/cart", element: <CartPage /> },
              { path: "/orders", element: <OrdersPage /> },
            ],
          },

          // restaurant only pages
          {
            element: <RequireRole allowed={["RESTAURANT"]} />,
            children: [{ path: "/restaurant", element: <RestaurantDashboard /> }],
          },

          // admin only pages
          {
            element: <RequireRole allowed={["ADMIN"]} />,
            children: [{ path: "/admin", element: <AdminPage /> }],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);