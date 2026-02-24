// // import { createContext, useState, useEffect } from "react";
// // import axiosInstance from "../utils/axiosInstance";

// // // ✅ MUST export this
// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);

// // useEffect(() => {
// //   const verifyUser = async () => {
// //     const token = localStorage.getItem("token");

// //     if (!token) return;

// //     try {
// //       const { data } = await axiosInstance.get("/auth/me");
// //       setUser(data);
// //     } catch (error) {
// //       localStorage.removeItem("token");
// //       setUser(null);
// //     }
// //   };

// //   verifyUser();
// // }, []);
  

// //   return (
// //     <AuthContext.Provider value={{ user, setUser }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };
// import { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Verify token on refresh
//   useEffect(() => {
//     const verifyUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const { data } = await axiosInstance.get("/auth/me");
//         setUser(data);
//       } catch (error) {
//         localStorage.removeItem("token");
//         setUser(null);
//       }
//     };

//     verifyUser();
//   }, []);

 
// const login = async (token) => {
//   localStorage.setItem("token", token);

//   const { data } = await axiosInstance.get("/auth/me");
//   setUser(data);
// };

//   const logout = () => {
//   localStorage.removeItem("token");
//   setUser(null);
// };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,   // ✅ MUST include this
//         logout,  // ✅ MUST include this
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get("/auth/me");
        setUser(data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    const { data } = await axiosInstance.get("/auth/me");
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};