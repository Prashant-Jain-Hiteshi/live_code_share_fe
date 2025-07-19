import { SidebarProps } from "@/utils/common/Interface/SideBar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import LogoImage from "../../assets/code-sync.png";
import FolderImage from "../../assets/folder.png";
import dashboardImage from "../../assets/dashboard.png";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const user = [
    {
      href: "/dashboard",
      src: dashboardImage,
      label: "Dashboard",
      alt: "Dashboard",
      className: "w-4",
    },
    {
      href: "/folder",
      src: FolderImage,
      label: "All Folders",
      alt: "Dashboard",
      className: "w-4",
    },
  ];
  const normalizedPathname =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const defaultRoute = "/dashboard";

  const handleNavigate = (href: string) => {
    router.replace(href);
  };

  const navItem = user;

  return (
    <>
      {isOpen && (
        <div
          className="fixed w-full h-full z-20 md:hidden  bg-gray-500/75 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`bg-card  min-w-40 h-[100vh] sm:h-[97vh ] lg:w-48 top-[10px] left-[10px] fixed z-30 md:z-10 md:translate-x-0 rounded-2xl flex flex-col items-center md:pt-6 ${
          isOpen ? "translate-x-0" : "-translate-x-[110%]"
        }  transition-transform duration-300 ease-in-out md:transform-none md:static  `}
        style={{
          background: " ",
        }}
      >
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
              <span className="text-[16px] 2xl:text-[16px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
