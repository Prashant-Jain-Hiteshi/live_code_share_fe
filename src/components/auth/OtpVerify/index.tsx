import Image from "next/image";
import React, { useState } from "react";
import LogoImage from "../../../assets/code-sync.png";
import CommonButton from "@/components/CommonButtton";
import OtpInput from "@/components/CommonOtpInput";
import { EmailVerifyPops } from "@/utils/common/Interface/SignUp";
import { verifyOtp } from "@/services/apiServices";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CommonOtp from "@/components/CommonOtpInput";

const OtpVerify: React.FC<EmailVerifyPops> = ({ email }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const handleOtpChange = (value: string) => {
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
      if (response?.token && response?.user) {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      toast.success(response?.message);
      router.push("liveEditor");
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-darkBg h-screen flex justify-center items-center">
      <div className="text-background bg-[#1C2023] p-10 rounded-lg md:w-[30%] sm-[50%] w-[80%]">
        <div className="flex justify-center mb-4">
          <Image src={LogoImage} alt="Logo" width={160} height={40} />
        </div>

        <h2 className="sM;text-2xl font-semibold text-center mb-8 ">
          OTP Verification
        </h2>

        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 items-center">
              <CommonOtp value={otp} onChange={handleOtpChange} />

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
                <a href="/login" className="text-green-400 hover:underline">
                  login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
