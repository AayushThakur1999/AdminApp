import { FormGroupProps } from "../Types";

const FormCheckBoxGroup = ({ value, id, label }: FormGroupProps) => {
  return (
    <>
      <input
        type="checkbox"
        name="course"
        value={value}
        id={id}
        className="checkbox checkbox-accent"
      />
      <label className="label-text" htmlFor={id}>
        {label}
      </label>
    </>
  );
};

export default FormCheckBoxGroup;
