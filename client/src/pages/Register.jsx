import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔐 Password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }

    if (!validatePassword(form.password)) {
      return toast.error(
        "Password must contain uppercase, lowercase, special char & 6+ length",
      );
    }

    try {
      setLoading(true);

      const data = await registerUser(form);

      login(data.token);

      toast.success("Account created 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

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

        {/* 🔥 Password Hint */}
        <p className="text-xs opacity-60">
          Must include uppercase, lowercase, special character & 6+ length
        </p>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>

      {/* 🔥 Switch Auth */}
      <p className="text-center mt-4 text-sm opacity-70">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
