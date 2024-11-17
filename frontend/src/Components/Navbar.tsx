import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const name = localStorage.getItem("adminName");
  const navigate = useNavigate();

  const logoutAdmin = async () => {
    try {
      const response = await axios.post("/admins/logout-admin", {});
      console.log("response:", response.data);

      toast.success(`${name} logged-out successfully`);
      localStorage.removeItem("adminName");
      return navigate("/login");
    } catch (error) {
      console.error("Error:->", error);
      throw new Error("Something went wrong while trying to logout admin");
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-md px-8">
        <div className="flex-1">
          <Link to="home" className="btn btn-outline">
            My App
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
              <h2 className="font-mono font-semibold">{name}</h2>
            </li>
            <li>
              <button
                className="btn btn-error text-white"
                onClick={logoutAdmin}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Navbar;
