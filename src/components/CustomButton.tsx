

interface CustomButtonProps {
    onClick?: ()=> void;
    text: string;
    className?:string;
    type?: "button" | "submit" | "reset"
}
const CustomButton = ({
  onClick,
  text,
  className = "",
  type = "button",
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200
        bg-violet-600 text-white hover:bg-violet-700 active:scale-95 shadow-md
        ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;