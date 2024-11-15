import { Form, Link } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
const Login = () => {
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const loginData = Object.fromEntries(formData);
    console.log("loginData", loginData);
  };
  return (
    <section className="h-screen grid place-items-center">
      <Form
        // method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4 hover:shadow-2xl transition-shadow duration-300"
        onSubmit={handleLogin}
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput type="text" label="username" name="username" />
        <FormInput type="password" label="password" name="userPassword" />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>
        <p className="text-center">
          Not registered yet?
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary font-semibold transition-all hover:underline"
          >
            Register
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Login;