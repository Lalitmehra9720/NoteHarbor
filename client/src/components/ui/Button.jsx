const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | theme
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-5 py-2.5 rounded-md cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-sky-600 hover:bg-sky-700 text-white",

    theme:
      "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;