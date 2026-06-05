

interface StatComponentProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    className?: string;
}

const StatComponent = ({ title, value, icon, className }: StatComponentProps) => {
    return (
        <div className={`p-3 sm:p-4 flex items-center justify-center gap-3 sm:gap-4 ${className ?? ""}`}>
            {icon && (
                <span className="neon-icon-wrap rounded-full w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center [&>svg]:size-7 sm:[&>svg]:size-8">
                    {icon}
                </span>
            )}
            <div className="min-w-0">
                <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">{title}</h3>
                <p className="text-2xl sm:text-3xl neon-text-cyan font-bold font-[family-name:var(--font-display)] truncate">
                    {title === "Amigos" ? "" : "$"} {value}
                </p>
            </div>
        </div>
    );
};

export default StatComponent;

// interface CustomButtonProps {
//     onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
//     text: string;
//     className?: string;
//     type?: "button" | "submit" | "reset";
//     disabled?: boolean;
//     icon?: React.ReactNode;
//   }
  
//   const CustomButton = ({
//     onClick,
//     text,
//     className = "",
//     type = "button",
//     disabled = false,
//     icon,
//   }: CustomButtonProps) => {
//     return (
//       <button
//         onClick={onClick}
//         type={type}
//         disabled={disabled}
//         className={`px-5 py-2 rounded-xl flex justify-center items-center gap-4 font-medium transition-all duration-200 shadow-md
//           ${
//             disabled
//               ? "bg-white/2 text-foreground/50 cursor-not-allowed"
//               : "bg-transparent border border-primary/10 text-foreground hover:bg-primary/10 hover:text-primary active:scale-95 cursor-pointer"
//           }
//           ${className}`}
//       >
//        {icon && icon} {text}
//       </button>
//     );
//   };
  
//   export default CustomButton;
  