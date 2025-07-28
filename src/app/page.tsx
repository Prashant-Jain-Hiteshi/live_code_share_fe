"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      router.push("/folder", { scroll: false });
    } else {
      router.push("/login", { scroll: false });
    }
  });

  return <div className="text-white text-center mt-10">Redirecting...</div>;
}
