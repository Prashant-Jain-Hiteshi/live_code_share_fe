"use client";
import { HeaderProps } from "@/utils/common/Interface/SideBar";
import Image from "next/image";
import React from "react";
import Hamburger from "../../assets/Humburger.png";

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <div className="flex  items-center justify-between  text-black bg-green-50   ">
      <div className="md:hidden  h-fit pl-3">
        <button onClick={toggleSidebar} className="">
          <Image src={Hamburger} alt="hamburger-icon" className="w-7" />
        </button>
      </div>
      <div className="flex-1 md:hidden" />
      <div className="ml-auto  ">gfg</div>
    </div>
  );
};

export default Header;
