"use client";

import { useState } from "react";
import axios from "axios";
// import { apiServices } from "@/services/apiServices";
import InputField from "@/components/CommonInput";
import CommonButton from "@/components/CommonButtton";
import OtpInput from "@/components/CommonOtpInput";
import Login from "@/components/auth/Login";

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}

//  <div className="">
//       <div className="p-6 space-y-4">
//         <p className="font-sans ">This is Inter font</p>
//         <p className="font-">This is Poppins font</p>
//         <p className="font-primary">This is Plus Jakarta Sans</p>
//         <p className="font-zakarta bg-secondary shadow-card">
//           This is Zakarta (if installed)
//         </p>
//       </div>
//       <InputField
//         type="email"
//         name="email"
//         label="Email Adddress"
//         value="fff"
//         onChange={handleChange}
//         required
//       />
//       <CommonButton
//         type="submit"
//         // isLoading={true}
//         label="Register"
//         // disabled={}
//         // className="w-full "
//       />
//       <OtpInput onChange={handleChange} />
//     </div>
