"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LogoImage from "../../../assets/code-sync.png";
import InputField from "@/components/CommonInput";
import { emailValidator } from "@/helper/Validator";
import { signupApi } from "@/services/apiServices";
import { toast } from "react-toastify";
import CommonButton from "@/components/CommonButtton";

import OtpVerify from "../OtpVerify";
import { useRouter } from "next/navigation";

const SignUp = () => {
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
    firstName: null as string | null,
    lastName: null as string | null,
    email: null as string | null,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // toast.success("Submit clicked");

    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const trimmedEmail = formData.email.trim();
    const newErrors = {
      firstName: null as string | null,
      lastName: null as string | null,
      email: null as string | null,
    };

    let hasError = false;
    if (!trimmedFirstName) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }
    if (!trimmedLastName) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }
    if (!emailValidator.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    setErrors(newErrors);
    if (!hasError) {
      try {
        setIsLoading(true);
        const result = await signupApi(formData);

        toast.success(result?.message);
        // router.push("");
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

            <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                type="text"
                label=""
                name="firstName"
                value={formData.firstName}
                onChange={handlechange}
                placeholder="First Name"
                className=""
              />
              <InputField
                type="text"
                label=""
                name="lastName"
                value={formData.lastName}
                onChange={handlechange}
                placeholder="Last Name"
                className=""
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
                label="Register"
                type="submit"
                isLoading={isLoading}
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition duration-300  "
              />
            </form>

            <p className="text-sm text-center mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-green-400 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
