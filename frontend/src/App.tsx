import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, EmployeeForm } from "./Pages";
import { employeeFormAction, loginAction } from "./Utils/Actions";
import EmployeesTable from "./Pages/EmployeesTable";
import { employeesTableLoader } from "./Utils/Loaders";
import Error from "./Pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/register",
    element: <EmployeeForm />,
    action: employeeFormAction,
  },
  {
    path: "/tableOfEmployees",
    element: <EmployeesTable />,
    errorElement: <Error />,
    loader: employeesTableLoader,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
