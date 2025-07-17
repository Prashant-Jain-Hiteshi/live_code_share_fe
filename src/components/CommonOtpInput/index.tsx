"use client";

import { OtpInputProps } from "@/utils/common/Interface/CommonOtpInput";
import React, { useRef } from "react";

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onChange,
  containerClassName,
  className,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");

    if (inputRefs.current[index]) {
      inputRefs.current[index]!.value = digit;
    }

    const otpValues = inputRefs.current.map(input => input?.value || "");
    otpValues[index] = digit;
    onChange(otpValues.join(""));

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    pastedData.split("").forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = char;
        handleChange(idx, char);
      }
    });
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const isDigitOrAllowedKey =
      /^\d$/.test(e.key) || ["Backspace", "Tab", "Enter"].includes(e.key);

    if (!isDigitOrAllowedKey) {
      e.preventDefault();
    }

    if (
      e.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      className={`flex gap-2 justify-center  sm:gap-4 md:gap-2 2xl:gap-3 flex-wrap ${containerClassName}`}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          ref={el => {
            inputRefs.current[i] = el;
          }}
          disabled={disabled}
          autoFocus={i === 0}
          onChange={e => handleChange(i, e.target.value)}
          onPaste={handlePaste}
          onKeyDown={e => handleKeyDown(e, i)}
          className={` w-[13.5%] h-12 sm:w-[14%] sm:h-14 md:w-[13%] md:h-12 xl:w-[14%]  border border-gray-300 rounded-md sm:rounded-lg text-center text-lg sm:text-xl focus:outline-none focus:ring-2 focus:border-none  focus:ring-green-500 transition-all ${className}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
