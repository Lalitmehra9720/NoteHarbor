// import BackButton from "../components/ui/BackButton";

// const AuthLayout = ({ children }) => {
//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4"
//       style={{
//         background: "var(--gradient)",
//         color: "var(--text)",
//       }}
//     >
     
//       <div
//         className="
//           w-full max-w-md 
//           p-8 
//           rounded-2xl 
//           shadow-xl 
//           transition
//         "
//         style={{
//           background: "var(--card)",
//           border: "1px solid var(--border)",
//         }}
//       >
//          <BackButton />
//         {children}
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;
import BackButton from "../components/ui/BackButton";

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--gradient)",
        color: "var(--text)",
      }}
    >
      <div
        className="
          w-full max-w-md 
          p-8 
          rounded-2xl 
          shadow-xl 
          transition
          relative
        "
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Positioned Back Button */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;