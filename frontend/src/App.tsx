import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Login,
  EmployeeForm,
  WelcomePage,
  EmployeesTable,
  Error,
} from "./Pages";
import { employeeFormAction, loginAction } from "./Utils/Actions";
import { employeesTableLoader } from "./Utils/Loaders";
import { Navbar } from "./Components";

const router = createBrowserRouter([
  {
    path: "/n",
    element: <Navbar />,
    children: [
      {
        path: "register",
        element: <EmployeeForm />,
        action: employeeFormAction,
      },
      {
        path: "home",
        element: <WelcomePage />,
      },
      {
        path: "tableOfEmployees",
        element: <EmployeesTable />,
        errorElement: <Error />,
        loader: employeesTableLoader,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
    action: loginAction,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
