"use client";
import Header from "@/components/pageLayout/Header";
import Sidebar from "@/components/pageLayout/Sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      router.push("/login", { scroll: false });
    }
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="bg-darkBg  overflow-hidden">
      <div className="flex h-screen md:pl-3">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleDrawer} />
        <div
          className={`flex flex-1 flex-col flex-grow  ${
            isOpen ? "opacity-10 md:opacity-100" : ""
          }`}
        >
          <Header toggleSidebar={toggleDrawer} />
          <div className="h-full overflow-y-scroll overflow-x-hidden">
            <main className="flex-grow p-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
