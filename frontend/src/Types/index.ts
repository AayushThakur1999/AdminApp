export interface FormInputProps<T extends string | boolean> {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "checkbox" | "number";
  value?: T;
  handleInputChange?: (value: T) => void;
}

export type FormGroupProps = {
  value: string;
  id: string;
  label: string;
  defaultChecked?: boolean;
};

export type EmployeeData = {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phoneNumber: number;
  designation: string;
  avatar: string;
  courses: Array<string>;
  createdAt: string;
};

export interface EditEmployeeModalProps {
  employee: EmployeeData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEmployee: EmployeeData, file: File | null) => void;
}

export interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
}
