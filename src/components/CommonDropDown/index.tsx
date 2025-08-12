import React from "react";

export interface SelectDropdownProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number }[];
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  externalError?: string;
  errorSpace?: boolean;
  placeholder?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  className,
  labelClassName,
  selectClassName,
  disabled = false,
  readOnly = false,
  required = false,
  externalError,
  errorSpace = false,
  placeholder = "Select Language",
}) => {
  return (
    <div>
      <div
        className={`flex flex-col justify-center w-full ${
          readOnly ? "cursor-not-allowed" : ""
        } ${className || ""}`}
      >
        {label && (
          <label
            htmlFor={name}
            className={`text-xs text-white w-full ${labelClassName || ""}`}
          >
            {label}
          </label>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled || readOnly}
          className={`w-full px-4 py-2 bg-[#2A2E33] text-white rounded-md 
            focus:outline-none focus:ring-2
            placeholder:text-gray-400 text-sm
            ${readOnly ? "cursor-not-allowed" : ""}
            ${selectClassName || ""}
          `}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {errorSpace && (
        <span
          className={`text-xs font-normal px-3 ${
            externalError ? "text-primary" : "invisible"
          }`}
        >
          {externalError}
        </span>
      )}
    </div>
  );
};

export default SelectDropdown;
