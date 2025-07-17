import Image from "next/image";
import React, { useState } from "react";
import LogoImage from "../../../assets/code-sync.png";
import CommonButton from "@/components/CommonButtton";
import OtpInput from "@/components/CommonOtpInput";
import { EmailVerifyPops } from "@/utils/common/Interface/SignUp";
import { verifyOtp } from "@/services/apiServices";
import { toast } from "react-toastify";

const OtpVerify: React.FC<EmailVerifyPops> = ({ email }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const handleChange = (value: string) => {
    setOtp(value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const paylod = {
        email: email,
        otp: otp,
      };

      const response = await verifyOtp(paylod);
      toast.success(response?.message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-darkBg h-screen flex justify-center items-center">
      <div className="text-background bg-[#1C2023] w-[30%] p-10 rounded-lg">
        <div className="flex justify-center mb-4">
          <Image src={LogoImage} alt="Logo" width={160} height={40} />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8">
          OTP Verification
        </h2>

        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <OtpInput
                length={4}
                onChange={handleChange}
                disabled={isLoading}
              />

              <CommonButton
                type="submit"
                label="Verify"
                disabled={otp.length !== 4 || isLoading}
                className={`w-full ${
                  otp.length !== 4 || isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-semibold py-3 rounded-md transition duration-300`}
              />

              <p className="text-sm text-center mt-4 text-gray-300">
                Back to{" "}
                <span className="text-blue-500 cursor-pointer hover:underline">
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
