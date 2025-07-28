import { InputFieldProps } from "@/utils/common/Interface/CommonInput/Index";

import React from "react";

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly = false,
  required = false,
  extraValidation,
  length,
  className,
  labelClassName,
  inputClassName,
  externalError,
  placeholder = "",
  disabled,
  errorSpace = false,
}) => {
  return (
    <div>
      <div
        className={`flex flex-col space-y-1 w-full ${readOnly ? "cursor-not-allowed" : ""} ${className || ""}`}
      >
        {label && (
          <label
            htmlFor={name}
            className={`text-xs text-white w-full ${labelClassName || ""}`}
          >
            {label}
          </label>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={length}
          className={`
          w-full px-4 py-2 bg-[#2A2E33] text-white rounded-md 
          focus:outline-none focus:ring-2 focus:ring-green-500
          placeholder:text-gray-400 text-sm
          ${readOnly ? "cursor-not-allowed" : ""}
          ${inputClassName || ""}
        `}
        />
      </div>
      {errorSpace && (
        <span
          className={`text-xs font-normal px-3 ${externalError ? "text-primary" : "invisible"}`}
        >
          {externalError}
        </span>
      )}
    </div>
  );
};

export default InputField;
