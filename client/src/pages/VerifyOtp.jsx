import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import useAuth from "../hooks/useAuth";
import { verifyRegistrationOtp } from "../services/authService";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.otp) {
      return toast.error("Email and OTP are required");
    }

    try {
      setLoading(true);
      const data = await verifyRegistrationOtp(form);

      await login(data.token);
      toast.success("Account verified");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <input
          type="text"
          name="otp"
          value={form.otp}
          placeholder="6-digit OTP"
          onChange={handleChange}
          maxLength="6"
          inputMode="numeric"
          className="w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Account"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm opacity-70">
        Need a new code?{" "}
        <Link to="/register" className="text-indigo-500 hover:underline">
          Register again
        </Link>
      </p>
    </div>
  );
};

export default VerifyOtp;
