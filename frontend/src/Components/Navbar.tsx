import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LogoutAdminModal from "./Modals/LogoutAdminModal";
import { useState } from "react";

const Navbar = () => {
  const name = localStorage.getItem("adminName");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();

  const logoutAdmin = async () => {
    try {
      const response = await axios.post("/admins/logout-admin", {});
      console.log("response:", response.data);

      toast.success(`${name} logged-out successfully`);
      localStorage.removeItem("adminName");
      return navigate("/");
    } catch (error) {
      console.error("Error:->", error);
      throw new Error("Something went wrong while trying to logout admin");
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-md px-8 mb-4">
        <div className="flex-1">
          <Link to="home" className="text-primary text-xl font-bold">
            Admin's App
          </Link>
        </div>
        <div className="flex-1">
          <ul className="flex p-1 space-x-4 justify-around items-center w-full">
            <li>
              <Link to="tableOfEmployees" className="btn btn-outline">
                EmployeesList
              </Link>
            </li>
            <li>
              <Link to="register" className="btn btn-outline">
                Create Employee
              </Link>
            </li>
            <li>
              <h2 className="font-mono font-semibold">{name}</h2>
            </li>
            <li>
              <button
                className="btn btn-error text-white"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
      <LogoutAdminModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logoutAdmin}
      />
    </div>
  );
};

export default Navbar;
