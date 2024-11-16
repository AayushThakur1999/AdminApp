import { useState } from "react";
import { EditEmployeeModalProps, EmployeeData } from "../../Types/index"; // Adjust the import path as needed

const EditEmployeeModal = ({
  employee,
  isOpen,
  onClose,
  onSave,
}: EditEmployeeModalProps) => {
  const [formData, setFormData] = useState(employee);

  const handleChange = (
    field: keyof EmployeeData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">Edit Employee Information</h3>

          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Designation</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="select select-bordered"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Courses</span>
              </label>
              <input
                type="text"
                value={formData.courses.join(", ")}
                onChange={(e) =>
                  handleChange("courses", e.target.value.split(", "))
                }
                className="input input-bordered"
                placeholder="Separate courses with commas"
              />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral opacity-50"
        onClick={onClose}
      ></div>
    </dialog>
  );
};

export default EditEmployeeModal;
