import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, EmployeeForm } from "./Pages";
import { employeeFormAction } from "./Utils/Actions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <EmployeeForm />,
    action: employeeFormAction,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
