"use client";
import { HeaderProps } from "@/utils/common/Interface/SideBar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Hamburger from "../../assets/Humburger.png";
import { BellIcon } from "@heroicons/react/24/outline";
import { myPendingInvites } from "@/services/apiServices";
import { toast } from "react-toastify";
import { Invitation, UserInfo } from "@/utils/common/Interface/Heder";
import Notification from "../Notification";

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [openNotif, setOpenNotif] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const notifRef = useRef(null);
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
    const fetchInvites = async () => {
      try {
        const res = await myPendingInvites();

        setInvitations(res.invitations || []);
      } catch (error) {
        console.error("Error fetching invites:", error);
      } finally {
      }
    };
    fetchInvites();
  }, []);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !(notifRef.current as any).contains(e.target)) {
        setOpenNotif(false);
      }
    };
    if (openNotif) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openNotif]);

  return (
    <div className="flex  items-center justify-end  text-white bg-card p-4">
      <div className="md:hidden  h-fit    flex justify-center items-center hover:bg-gray-400 rounded-full w-9 p-1">
        <button onClick={toggleSidebar} className="hover:cursor-pointer ">
          <Image src={Hamburger} alt="hamburger-icon" className="w-7" />
        </button>
      </div>
      <div className="flex-1 md:hidden" />
      <div className="relative mx-4 " ref={notifRef}>
        <BellIcon
          className="w-6 h-6 text-white cursor-pointer"
          onClick={() => setOpenNotif(prev => !prev)}
        />
        {invitations.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {invitations.length}
          </span>
        )}
        {openNotif && <Notification invitations={invitations} />}
      </div>
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
