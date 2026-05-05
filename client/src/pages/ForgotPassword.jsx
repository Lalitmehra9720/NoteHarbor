import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  resetPassword,
  sendForgotPasswordOtp,
  verifyResetOtp,
} from "../services/authService";

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!form.email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);
      const data = await sendForgotPasswordOtp({ email: form.email });

      setForm((current) => ({ ...current, email: data.email || current.email }));
      setStep("otp");
      toast.success(data.message || "OTP sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!form.email || !form.otp) {
      return toast.error("Email and OTP are required");
    }

    try {
      setLoading(true);
      const data = await verifyResetOtp({
        email: form.email,
        otp: form.otp,
      });

      setResetToken(data.resetToken);
      setStep("password");
      toast.success("OTP verified");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();

    if (!form.password) {
      return toast.error("New password is required");
    }

    try {
      setLoading(true);
      await resetPassword({
        email: form.email,
        resetToken,
        password: form.password,
      });

      toast.success("Password reset successful");
      setStep("done");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

      {step === "email" && (
        <form onSubmit={sendOtp} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="space-y-4">
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
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={submitNewPassword} className="space-y-4">
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="New password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Reset Password"}
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="text-center space-y-4">
          <p className="opacity-80">Your password has been reset.</p>
          <Link to="/login" className="text-indigo-500 hover:underline">
            Go to login
          </Link>
        </div>
      )}

      {step !== "done" && (
        <p className="text-center mt-4 text-sm opacity-70">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
