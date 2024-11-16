const FormSelect = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) => (
  <div className="my-2">
    <select
      className="select select-primary w-full max-w-xs"
      name={name}
      defaultValue=""
    >
      <option disabled value="">
        {label}
      </option>
      {options.map((option) => (
        <option key={option} value={option.toLowerCase()}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
