import { DeleteEmployeeModalProps } from "../../Types";

const DeleteEmployeeModal = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: DeleteEmployeeModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete {employeeName}'s record? This action
          cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-neutral opacity-50"
        onClick={onClose}
      ></div>
    </dialog>
  );
};

export default DeleteEmployeeModal;
