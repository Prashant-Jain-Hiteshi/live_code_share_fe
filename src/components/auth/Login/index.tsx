"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LogoImage from "../../../assets/code-sync.png";
import InputField from "@/components/CommonInput";
import CommonButton from "@/components/CommonButtton";
import { emailValidator } from "@/helper/Validator";
import { toast } from "react-toastify";
import OtpVerify from "../OtpVerify";
import { LoginApi } from "@/services/apiServices";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      router.push("/dashboard", { scroll: false });
    }
  }, [router]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtpVerifyModelShow, setIsOtpVerifyModelshow] =
    useState<boolean>(false);
  const [errors, setErrors] = useState({
    email: null as string | null,
  });
  const [formData, setFormData] = useState({
    email: "",
  });
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = formData.email.trim();
    const newErrors = {
      email: null as string | null,
    };
    let hasError = false;
    if (!emailValidator.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    setErrors(newErrors);
    if (!hasError) {
      try {
        setIsLoading(true);
        const result = await LoginApi(formData);

        toast.success(result?.message);

        setIsOtpVerifyModelshow(true);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <>
      {isOtpVerifyModelShow ? (
        <OtpVerify email={formData?.email} />
      ) : (
        <div className="bg-darkBg h-screen flex justify-center items-center px-4">
          <div className="bg-[#1C2023] text-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <Image src={LogoImage} alt="Logo" width={150} height={50} />
            </div>

            <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                type="email"
                label=""
                name="email"
                value={formData.email}
                onChange={handlechange}
                placeholder="Email"
                className=""
                required
                extraValidation={() => errors.email}
              />
              <InputField
                type="email"
                label=""
                name="email"
                value={formData.email}
                onChange={handlechange}
                placeholder="Email"
                className=""
                required
                extraValidation={() => errors.email}
              />

              <CommonButton
                label="Login"
                type="submit"
                isLoading={isLoading}
                className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 "
              />
            </form>

            <p className="text-sm text-center mt-6">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-green-400 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
