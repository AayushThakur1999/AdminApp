import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { EmployeeData } from "../Types";
import { DeleteEmployeeModal, EditEmployeeModal } from "../Components";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const EmployeesTable = () => {
  const employeeData = useLoaderData() as Array<EmployeeData>;
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const filteredEmployeeData = employeeData.filter((employee) =>
    `${employee.name.toLowerCase()} ${employee.email.toLowerCase()}`.includes(
      searchQuery.toLowerCase()
    )
  );

  const revalidator = useRevalidator();

  const handleSaveEdit = async (
    updatedEmployee: EmployeeData,
    file: File | null
  ) => {
    // Implement your save logic here
    // console.log("Saving updated employee:", updatedEmployee);
    if (!selectedEmployee) return;

    // Find the original employee data
    const originalEmployee = employeeData.find(
      (emp) => emp._id === selectedEmployee._id
    );

    if (!originalEmployee) return;

    // Create a FormData instance to handle file upload
    const formData = new FormData();

    // Add the file if it exists
    if (file) {
      formData.append("avatar", file);
      console.log(
        "formdata till avatar inserton:",
        Object.fromEntries(formData)
      );
    }

    // Create updated fields object as before
    const updatedFields: Record<string, string | number | string[]> = {};
    type EmployeeKey = keyof EmployeeData;

    (Object.keys(updatedEmployee) as EmployeeKey[]).forEach(
      (key: EmployeeKey) => {
        if (key !== "_id" && key !== "createdAt" && key !== "avatar") {
          if (key === "courses") {
            if (
              updatedEmployee.courses.toString() !==
              originalEmployee.courses.toString()
            ) {
              updatedFields.courses = updatedEmployee.courses;
            }
          } else if (key === "phoneNumber") {
            if (updatedEmployee.phoneNumber !== originalEmployee.phoneNumber) {
              updatedFields.phoneNumber = updatedEmployee.phoneNumber;
            }
          } else if (updatedEmployee[key] !== originalEmployee[key]) {
            updatedFields[key] = updatedEmployee[key];
          }
        }
      }
    );

    // Add updated fields to FormData
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item as string);
        });
      } else {
        formData.append(key, String(value));
      }
    });

    // Add the ID
    formData.append("_id", updatedEmployee._id);
    // console.log("original employee:", originalEmployee);
    // console.log("updatedFields:", updatedFields);

    if (Object.keys(updatedFields).length === 0 && !file) {
      toast.info("No changes detected.");
      setIsEditModalOpen(false);
      return;
    }

    try {
      // Send the PATCH request with FormData
      const response = await axios.patch(
        "/employees/updateEmployeeDetails",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      revalidator.revalidate(); // Manually re-run the loader

      toast.success(`Employee ${selectedEmployee.name} updated successfully!`);
      console.log("Updated employee:", response.data);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      // Implement your delete logic here
      // console.log("Deleting employee:", selectedEmployee._id);
      try {
        const response = await axios.delete(
          `/employees/deleteEmployee/${selectedEmployee._id}`
        );
        console.log(response);
        revalidator.revalidate(); // Manually re-run the loader
        toast.success(
          `Employee ${selectedEmployee.name} deleted successfully!`
        );
      } catch (error) {
        console.error("Error::", error);
        if (error instanceof AxiosError) {
          throw new Error(error.message);
        }
        throw new Error(
          "Something went wrong while trying to delete the employee"
        );
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const [sortField, setSortField] = useState<"name" | "email" | "createdAt">(
    "name"
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // const sortedEmployeeData = [...filteredEmployeeData]; // Filtered data for sorting
  const sortedEmployeeData = [...filteredEmployeeData].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (sortField === "createdAt") {
      const dateA = new Date(fieldA as string).getTime();
      const dateB = new Date(fieldB as string).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  const handleSort = (field: "name" | "email" | "createdAt") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page

  // Pagination logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = sortedEmployeeData.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(sortedEmployeeData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFilteration = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.post(
        "/employees/filterEmployees",
        e.target.value
      );
      console.log("response of filteration:", response);
    } catch (error) {
      console.error(error);
      throw new Error("Some error occurred while filtering data");
    }
  };
  return (
    <div className="p-12">
      {/* Sorting Dropdown */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={handleFilteration}
        />
        {/* Sorting Dropdown */}
        <select
          className="select select-bordered"
          onChange={(e) =>
            handleSort(e.target.value as "name" | "email" | "createdAt")
          }
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="createdAt">Sort by Date</option>
        </select>
      </div>
      <div className="rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr className="text-base-content">
              <th className="text-sm font-semibold">Unique ID</th>
              <th className="text-sm font-semibold">Image</th>
              <th className="text-sm font-semibold">Name</th>
              <th className="text-sm font-semibold">Email</th>
              <th className="text-sm font-semibold">Mobile Number</th>
              <th className="text-sm font-semibold">Designation</th>
              <th className="text-sm font-semibold">Gender</th>
              <th className="text-sm font-semibold">Courses</th>
              <th className="text-sm font-semibold">Creation Date</th>
              <th colSpan={2} className="text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => {
              const {
                _id,
                gender,
                courses,
                designation,
                email,
                name,
                avatar,
                phoneNumber,
                createdAt,
              } = employee;
              const degrees = courses.join(", ");
              const creationDate = createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "";

              return (
                <tr
                  key={_id}
                  className="hover:bg-base-200 transition-colors duration-200"
                >
                  <th className="text-xs font-mono">{_id}</th>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12 ring-2 ring-primary ring-offset-2">
                        <img src={avatar} alt={name} className="object-cover" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-medium capitalize text-primary">
                      {name}
                    </div>
                  </td>
                  <td className="text-sm">{email}</td>
                  <td className="text-sm font-mono">{phoneNumber}</td>
                  <td className="capitalize text-sm">
                    <span className="font-mono text-base">{designation}</span>
                  </td>
                  <td className="capitalize text-sm">
                    <span className="badge badge-primary badge-outline">
                      {gender}
                    </span>
                  </td>
                  <td className="text-sm">
                    <div className="max-w-xs">{degrees}</div>
                  </td>
                  <td className="text-sm font-mono">{creationDate}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm text-warning-content hover:brightness-90 transition-all"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-sm text-error-content hover:brightness-90 transition-all"
                      onClick={() => handleDelete(employee)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`btn btn-sm mx-1 ${
                pageNumber === currentPage ? "btn-primary" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {selectedEmployee && (
        <>
          <EditEmployeeModal
            employee={selectedEmployee}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
          <DeleteEmployeeModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            employeeName={selectedEmployee.name}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesTable;
