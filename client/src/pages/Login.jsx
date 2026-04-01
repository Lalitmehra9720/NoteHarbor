
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/auth/login", form);

      login(data.token);

      toast.success("Welcome back 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 pr-10 rounded-lg focus:ring-2 focus:ring-indigo-500"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Switch Auth */}
      <p className="text-center mt-4 text-sm opacity-70">
        New user?{" "}
        <Link to="/register" className="text-indigo-500 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default Login;
