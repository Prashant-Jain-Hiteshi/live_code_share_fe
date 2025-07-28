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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const updatedErrors = { ...prev };

      if (name === "firstName" || name === "lastName") {
        updatedErrors[name] =
          value.trim() === ""
            ? `${name === "firstName" ? "First" : "Last"} name is required`
            : "";
      }

      if (name === "email") {
        if (value.trim() === "") {
          updatedErrors.email = "Email is required";
        } else if (!emailValidator.test(value)) {
          updatedErrors.email = "Enter a valid email";
        } else {
          updatedErrors.email = "";
        }
      }

      return updatedErrors;
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const result = await signupApi(formData);

      toast.success(result?.message);

      setIsOtpVerifyModelshow(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const isSubmitDisabled = () => {
    const hasError = Object.values(errors).some(error => error.trim() !== "");
    const isEmpty = Object.values(formData).some(value => value.trim() === "");
    return hasError || isEmpty || isLoading;
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

            <form className="" onSubmit={handleSubmit}>
              <InputField
                type="text"
                label=""
                name="firstName"
                value={formData.firstName}
                onChange={handlechange}
                placeholder="First Name"
                className=""
                errorSpace={true}
                externalError={errors.firstName || ""}
              />
              <InputField
                type="text"
                label=""
                name="lastName"
                value={formData.lastName}
                onChange={handlechange}
                placeholder="Last Name"
                className=""
                errorSpace={true}
                externalError={errors.lastName || ""}
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
                externalError={errors.email || ""}
                errorSpace={true}
              />

              <CommonButton
                label="Register"
                type="submit"
                isLoading={isLoading}
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition duration-300  "
                disabled={isSubmitDisabled()}
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
