import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { EmployeeData } from "../Types";
import { DeleteEmployeeModal, EditEmployeeModal } from "../Components";

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

  const handleSaveEdit = (updatedEmployee: EmployeeData) => {
    // Implement your save logic here
    console.log("Saving updated employee:", updatedEmployee);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      // Implement your delete logic here
      console.log("Deleting employee:", selectedEmployee._id);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-12">
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
            {employeeData.map((employee) => {
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
                    <span className="badge badge-ghost">{designation}</span>
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
