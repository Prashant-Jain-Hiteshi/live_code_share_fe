import { SidebarProps } from "@/utils/common/Interface/SideBar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import LogoImage from "../../assets/code-sync.png";
import FolderImage from "../../assets/folder.png";
import LiveCodeImage from "../../assets/live_code.png";
import LogoutIcon from "../../assets/Logout.png";
import CommonDialog from "../CommonDialog/page";
import CommonButton from "../CommonButtton";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const user = [
    {
      href: "/folder",
      src: FolderImage,
      label: "All Folders",
      alt: "Dashboard",
      className: "w-4",
    },
    {
      href: "/liveEditor",
      src: LiveCodeImage,
      label: "Live Code Editor",
      alt: "Dashboard",
      className: "w-4",
    },
  ];
  const normalizedPathname =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const defaultRoute = "/folder";

  const handleNavigate = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
    setIsOpenDialog(!isOpenDialog);
  };
  const openDialog = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const navItem = user;

  return (
    <>
      {isOpen && (
        <div
          className="fixed w-full h-full z-20 md:hidden  bg-white/10 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`bg-card  min-w-40 h-[100vh] sm:h-[97vh ] lg:w-48 top-[10px] left-[10px] fixed z-30 md:z-10 md:translate-x-0 rounded-2xl flex flex-col items-center justify-between md:pt-6 ${
          isOpen ? "translate-x-0" : "-translate-x-[110%]"
        }  transition-transform duration-300 ease-in-out md:transform-none md:static  `}
        style={{
          background: " ",
        }}
      >
        <div className="">
          <div
            className="md:hidden  ml-32 mt-2 text-white"
            onClick={toggleSidebar}
          >
            X
          </div>
          <div className="text-white ">
            <Image src={LogoImage} alt="Logo" width={100} height={100} />
          </div>

          <div className="mt-10 gap-3 flex flex-col text-white ">
            {user.map((item, index) => (
              <div
                className={`flex gap-2 p-2 rounded-xl cursor-pointer ${
                  pathname === item.href
                    ? "bg-[#20ee5a75] font-bold"
                    : "bg-transparent hover:bg-[#bfc5dd75]"
                }`}
                key={index}
                onClick={() => handleNavigate(item.href)}
              >
                <Image src={item.src} alt={item.alt} className="w-4 2xl:w-6" />
                <span className="text-[16px] 2xl:text-[16px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-12 px-4 rounded-xl cursor-pointer text-white bg-transparent hover:bg-[#bfc5dd75]">
          <button onClick={openDialog}>
            <div className="flex gap-2 p-2 ">
              <Image src={LogoutIcon} alt="LogOut" className="w-4 2xl:w-6" />
              <span className="text-[16px] 2xl:text-[16px] ">Logout</span>
            </div>
          </button>
        </div>
      </div>

      <CommonDialog title="" onClose={openDialog} isOpen={isOpenDialog}>
        <div className="flex justify-center ">
          <div className="flex gap-6 flex-col items-center">
            <Image src={LogoutIcon} alt="LogOut" className="w-6 2xl:w-6" />
            <div className="text-center">Logout Account</div>
            <div>
              <p>Are you sure want to logout?</p>
            </div>
            <div className="flex gap-3">
              <CommonButton
                label="Cancel"
                onClick={openDialog}
                className=" bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 w-[130px]"
              ></CommonButton>
              <CommonButton
                label="Yes Logout!"
                onClick={handleLogout}
                className="bg-red-500 font-semibold py-2 rounded-md hover:bg-red-600 transition duration-300  w-[130px]"
              ></CommonButton>
            </div>
          </div>
        </div>
      </CommonDialog>
    </>
  );
};

export default Sidebar;
