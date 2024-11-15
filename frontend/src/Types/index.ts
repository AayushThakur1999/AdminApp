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