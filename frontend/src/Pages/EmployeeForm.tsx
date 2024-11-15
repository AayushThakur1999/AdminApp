import { Form, Link } from "react-router-dom";
import {
  FormCheckBoxGroup,
  FormInput,
  FormRadioGroup,
  FormSelect,
  SubmitBtn,
} from "../Components";

const designationOptions = [
  "HR",
  "Manager",
  "Sales",
  "Software Development Engineer",
];

const EmployeeForm = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        encType="multipart/form-data"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput type="text" label="name" name="name" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="number" label="phoneNumber" name="phoneNumber" />
        <FormSelect
          label="Designation"
          name="designation"
          options={designationOptions}
        />
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold"> Gender</h3>
          <FormRadioGroup
            value="male"
            id="gender1"
            label="Male"
            defaultChecked
          />
          <FormRadioGroup value="female" id="gender2" label="Female" />
        </div>
        <div className="form-control gap-2">
          <h3 className="text-lg font-semibold">Courses</h3>
          <div className="cursor-pointer flex flex-wrap items-center gap-4">
            <FormCheckBoxGroup value="BCA" id="bca" label="BCA" />
            <FormCheckBoxGroup value="BCA" id="bsc" label="B.Sc" />
            <FormCheckBoxGroup value="MCA" id="mca" label="MCA" />
            <FormCheckBoxGroup value="B.E" id="be" label="B.E" />
            <FormCheckBoxGroup value="B.TECH" id="b.tech" label="B.Tech" />
            <FormCheckBoxGroup value="MBA" id="mba" label="MBA" />
          </div>
        </div>
        <div className="form-control gap-4">
          <h3 className="text-lg font-semibold">Upload Avatar</h3>
          <input
            type="file"
            className="file-input file-input-bordered file-input-info w-full max-w-xs"
            accept=".jpg, .png"
            name="avatar"
          />
        </div>
        <div className="mt-4">
          <SubmitBtn text="register" />
        </div>
        <p className="text-center">
          Already a member?
          <Link to="/login" className="ml-2 link link-hover link-primary">
            Login
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default EmployeeForm;
