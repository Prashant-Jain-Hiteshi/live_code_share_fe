"use client";

import { useState } from "react";
import axios from "axios";
import { apiServices } from "@/services/apiServices";

export default function Home() {
  return (
    <div className="">
      <div className="p-6 space-y-4">
        <p className="font-sans ">This is Inter font</p>
        <p className="font-">This is Poppins font</p>
        <p className="font-primary">This is Plus Jakarta Sans</p>
        <p className="font-zakarta bg-secondary shadow-card">
          This is Zakarta (if installed)
        </p>
      </div>
    </div>
  );
}
