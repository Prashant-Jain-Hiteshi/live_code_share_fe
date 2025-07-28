"use client";
import { HeaderProps } from "@/utils/common/Interface/SideBar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Hamburger from "../../assets/Humburger.png";
interface UserInfo {
  name: string;
  email: string;
  profileImage?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        name: parsedUser.firstName || "Guest User",
        email: parsedUser.email || "Not Availabel",
        profileImage: "",
      });
    }
  }, []);
  return (
    <div className="flex  items-center justify-end  text-white bg-card p-4">
      <div className="md:hidden  h-fit    flex justify-center items-center hover:bg-gray-400 rounded-full w-9 p-1">
        <button onClick={toggleSidebar} className="hover:cursor-pointer ">
          <Image src={Hamburger} alt="hamburger-icon" className="w-7" />
        </button>
      </div>
      <div className="flex-1 md:hidden" />
      {userInfo && (
        <div className="flex items-center gap-3 bg-card text-white px-4 py-2 rounded-xl shadow-sm shadow-gray-600">
          {userInfo.profileImage ? (
            <img
              src={userInfo.profileImage}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full font-semibold uppercase">
              {userInfo.name.charAt(0)}
            </div>
          )}
          <div className=" flex-col sm:block hidden">
            <p className="font-semibold text-sm">{userInfo.name}</p>
            <p className="text-xs text-gray-200">{userInfo.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
