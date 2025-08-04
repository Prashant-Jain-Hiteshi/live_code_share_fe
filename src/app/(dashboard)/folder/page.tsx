"use client";
import AllFiles from "@/components/AllFiles/Index";
import { getMyFiles } from "@/services/apiServices";
import React, { useEffect, useState } from "react";

const page = () => {
  const [aceptedFiles, setAcceptedFiles] = useState();

  useEffect(() => {
    const FetchgetMyFiles = async () => {
      try {
        const data = await getMyFiles();
        setAcceptedFiles(data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    FetchgetMyFiles();
  }, []);
  return (
    <AllFiles
      headerContent="All My Files"
      isButtonshow={false}
      filesData={aceptedFiles}
    />
  );
};

export default page;
