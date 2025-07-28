import React from "react";
import OTPInput from "react-otp-input";

interface CommonOtpProps {
  value: string;
  onChange: (otp: string) => void;
  numInputs?: number;
  disabled?: boolean;
}

const CommonOtp: React.FC<CommonOtpProps> = ({
  value,
  onChange,
  numInputs = 4,
  disabled = false,
}) => {
  return (
    <div className="flex gap-2 justify-center sm:gap-4 md:gap-2 2xl:gap-3 flex-wrap ">
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        shouldAutoFocus
        inputType="tel"
        renderInput={props => (
          <input
            {...props}
            disabled={disabled}
            className="w-[13.5%] h-12 sm:w-[14%] sm:h-14 md:w-[13%] md:h-12 xl:w-[14%] border border-gray-300 rounded-md sm:rounded-lg text-center text-lg sm:text-xl focus:outline-none focus:ring-2 focus:border-none focus:ring-green-500 transition-all mx-2"
          />
        )}
      />
    </div>
  );
};

export default CommonOtp;
