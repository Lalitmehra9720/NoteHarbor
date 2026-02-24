// import { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import toast from "react-hot-toast";
// import Button from "../components/ui/Button";

// const Register = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.email || !form.password) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//       const { data } = await axiosInstance.post("/auth/register", form);
//       login(data.token);
//       toast.success("Registration successful 🎉");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error("Registration failed");
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg"
//         />

//         <Button >
//           Create Account
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Register;

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
    console.log(form);

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(form);

      // save token
      login(data.token);

      toast.success("Registration successful 🎉");

      navigate("/dashboard");
    } 
    // catch (error) {
    //   console.log(error.response?.data);
    //   toast.error(error.response?.data?.message || "Registration failed");
    // }
    catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);
  console.log("DATA:", error.response?.data);
  toast.error(
    error.response?.data?.message || "Registration failed"
  );
}
     finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
