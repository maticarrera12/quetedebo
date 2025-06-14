interface CustomButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton = ({
  onClick,
  text,
  className = "",
  type = "button",
  disabled = false,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 shadow-md
        ${
          disabled
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-violet-600 text-white hover:bg-violet-700 active:scale-95 cursor-pointer"
        }
        ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
