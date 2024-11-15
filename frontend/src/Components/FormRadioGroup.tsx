import { FormGroupProps } from "../Types";

const FormRadioGroup = ({ value, id, label }: FormGroupProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="radio"
        name="gender"
        value={value}
        className="radio radio-accent"
        id={id}
        defaultChecked
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default FormRadioGroup;
