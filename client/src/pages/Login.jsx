import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/login", form);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <Button
          type="submit"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;