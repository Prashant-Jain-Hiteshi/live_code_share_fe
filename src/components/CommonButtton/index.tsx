import { CommonButtonProps } from "@/utils/common/Interface/CommonButton";
import React from "react";
import { IconLoader2 } from "@tabler/icons-react";

const CommonButton: React.FC<CommonButtonProps> = ({
  onClick = () => {},
  label,
  className = "",
  type = "button",
  isLoading = false,
  icon,
  varient = "solid",
  disabled = false,
}) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "outlined":
        return `bg-transparent border border-black text-black ${disabled ? "" : "cursor-pointer "} hover:bg-black hover:text-white transition `;
      case "text":
        return `bg-transparent text-black  ${disabled ? "" : "cursor-pointer "}`;

      default:
        return `bg-black text-white hover:bg-opacity-9 ${disabled ? "disabled:bg-[#9f9f9f]" : "cursor-pointer"}`;
    }
  };

  const variantClass = getVariantClasses(varient);

  return (
    <button
      type={type}
      className={` rounded-[12px] text-[14px] font-medium px-5 ${disabled ? " " : "cursor-pointer"}  py-2 px-3 select-none ${variantClass} ${className} `}
      onClick={isLoading ? () => {} : onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <div className="flex justify-center">
          <IconLoader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </div>
      )}
    </button>
  );
};

export default CommonButton;
