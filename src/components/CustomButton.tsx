interface CustomButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ReactNode;
}

const CustomButton = ({
  onClick,
  text,
  className = "",
  type = "button",
  disabled = false,
  icon,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-5 py-3 min-h-11 text-base flex justify-center items-center gap-2 sm:gap-4 font-medium transition-all duration-300
        ${
          disabled
            ? "bg-white/2 text-foreground/40 cursor-not-allowed border border-white/5"
            : "bg-primary/5 border border-primary/40 text-foreground hover:text-primary hover:border-primary/70 hover:shadow-[0_0_15px_hsl(262_100%_65%_/_0.35),inset_0_0_10px_hsl(262_100%_65%_/_0.05)] active:scale-95 cursor-pointer"
        }
        ${className}`}
    >
     {icon && icon} {text}
    </button>
  );
};

export default CustomButton;
