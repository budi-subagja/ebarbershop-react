import React from "react";
import App from "../app.jsx";

import Dashboard from "../pages/home/dashboard-v3.js";
import Login from "../pages/home/login.js";
import Error from "../pages/error/error.js";
import PosCustomerOrder from "../pages/pos/customer-order.js";
import CustomerPayment from "../pages/pos/customer-payment.js";

import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";

console.log(Dashboard);
console.log(Login);
console.log(Error);
console.log(PosCustomerOrder);

console.log("App:", App);
console.log("ProtectedRoute:", ProtectedRoute);
console.log("PublicRoute:", PublicRoute);

const AppRoute = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,   // ✅ ini yang benar
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "pos/customer-order",
        element: (
          <ProtectedRoute>
            <PosCustomerOrder />
          </ProtectedRoute>
        )
      },
      {
        path: "pos/customer-payment",
        element: (
          <ProtectedRoute>
            <CustomerPayment />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <Error />
      }
    ]
  }
];

export default AppRoute;
