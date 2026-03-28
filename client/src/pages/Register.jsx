

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(form);

      login(data.token);

      toast.success("Registration successful 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.log("FULL ERROR:", error);
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--text)" }}
      >
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
