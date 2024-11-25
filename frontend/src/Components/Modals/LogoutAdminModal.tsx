import { LogoutAdminModalProps } from "../../Types";

const LogoutAdminModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutAdminModalProps) => {
  const adminName = localStorage.getItem("adminName");

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Logout</h3>
        <p className="py-4">Are you sure you want to logout {adminName}?</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Logout
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

export default LogoutAdminModal;
