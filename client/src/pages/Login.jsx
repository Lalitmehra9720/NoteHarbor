
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--text)" }}
      >
        Login
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="
            w-full p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          style={{
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="
            w-full p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          style={{
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;