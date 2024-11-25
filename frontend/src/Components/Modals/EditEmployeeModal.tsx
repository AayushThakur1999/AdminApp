import { useEffect, useState } from "react";
import { EditEmployeeModalProps, EmployeeData } from "../../Types/index";

const EditEmployeeModal = ({
  employee,
  isOpen,
  onClose,
  onSave,
}: EditEmployeeModalProps) => {
  const [formData, setFormData] = useState(employee);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Used to preview which file is already there or which file (image) will be sent as the new avatar
  const [previewUrl, setPreviewUrl] = useState<string>(employee.avatar);

  /* 
     This useEffect is used so that the edit form which is auto-filled pre-fills the data 
     of the selected employee instead of prefilling the form for every employee with the data 
     of the first employee for whom we tried to edit data.
  */
  useEffect(() => {
    setFormData(employee);
    setPreviewUrl(employee.avatar);
    setSelectedFile(null);
  }, [employee]);

  const handleChange = (
    field: keyof EmployeeData,
    value: string | string[] | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, selectedFile);
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
            <div className="form-control gap-4">
              <h3 className="text-lg font-semibold">Upload Avatar</h3>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="mask mask-squircle h-16 w-16 ring-2 ring-primary ring-offset-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover"
                    />
                  </div>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-info w-full max-w-xs"
                  accept="image/jpg, image/png"
                  name="avatar"
                  onChange={handleFileChange}
                />
              </div>
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
