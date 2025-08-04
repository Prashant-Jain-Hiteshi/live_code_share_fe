"use client";
import AllFiles from "@/components/AllFiles/Index";
import { myInvites } from "@/services/apiServices";
import React, { useEffect, useState } from "react";
type Invitation = {
  room: {
    id: number;
    title: string;
    updatedAt: string;
  };
};
type MyInvitesResponse = {
  invitations: Invitation[];
  success: boolean;
  message: string;
};
type Room = {
  id: number;
  title: string;
  updatedAt: string;
};

const page = () => {
  const [aceptedFiles, setAcceptedFiles] = useState<Room[]>([]);
  useEffect(() => {
    const fetachAcceptedFiles = async () => {
      try {
        const res: MyInvitesResponse = await myInvites("accepted");
        const allRooms = res.invitations.map(invite => invite.room);

        const uniqueRooms = allRooms.filter(
          (room, index, self) => index === self.findIndex(r => r.id === room.id)
        );

        setAcceptedFiles(uniqueRooms);
      } catch (error) {
        console.log(error, "error in fetach data");
      }
    };
    fetachAcceptedFiles();
  }, []);
  return (
    <AllFiles
      headerContent="Shared Files"
      isButtonshow={true}
      filesData={aceptedFiles}
    />
  );
};

export default page;
