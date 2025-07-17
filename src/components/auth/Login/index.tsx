import Image from "next/image";
import React from "react";
import LogoImage from "../../../assets/code-sync.png";
import InputField from "@/components/CommonInput";
import CommonButton from "@/components/CommonButtton";

const Login = () => {
  const handlechange = () => {};
  return (
    <div className="bg-darkBg h-screen flex justify-center items-center px-4">
      <div className="bg-[#1C2023] text-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Image src={LogoImage} alt="Logo" width={150} height={50} />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form className="space-y-4">
          <InputField
            label=""
            name="email"
            value=""
            onChange={handlechange}
            placeholder="Email"
            className="py-2"
          />

          <CommonButton
            label="Login"
            // onClick={handleSubmit}
            isLoading={false}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 "
          />
        </form>

        <p className="text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signIn" className="text-green-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
