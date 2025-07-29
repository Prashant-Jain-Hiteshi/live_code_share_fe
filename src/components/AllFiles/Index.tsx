"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommonButton from "../CommonButtton";
import CommonDialog from "../CommonDialog/page";
import { createFileApi, getMyFiles } from "@/services/apiServices";
import { toast } from "react-toastify";

type FileType = {
  id: number;
  title: string;
  updatedAt: string;
};
interface AllFilesProps {
  headerContent?: string;
  isButtonshow?: boolean;
}

const AllFiles: React.FC<AllFilesProps> = ({ headerContent, isButtonshow }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");

  const router = useRouter();

  useEffect(() => {
    const FetchgetMyFiles = async () => {
      try {
        const data = await getMyFiles();
        setFiles(data);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    FetchgetMyFiles();
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setTitle("");
  };
  const createFile = async () => {
    setLoading(true);

    try {
      const data = await createFileApi(title.trim());
      toast.success(data?.message || "File Created Succcessfully");

      router.push(`/editor/${data.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Error in Creating File");
    } finally {
      setLoading(false);
    }
  };
  const openDialogbox = () => {
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading your files...
      </div>
    );
  }

  return (
    <div className="p-6  min-h-screen">
      <div className=" flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">{headerContent}</h1>
        {isButtonshow ? (
          <div className="   font-bold mb-6">
            <CommonButton
              label="+ Create File"
              type="submit"
              isLoading={false}
              className="  bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300  whitespace-nowrap "
              onClick={openDialogbox}
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-white">You have no files yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => router.push(`/editor/${file.id}`)}
              className="bg-card p-8 rounded-xl shadow hover:shadow-lg cursor-pointer transition border border-gray-700 hover:border-green-400 "
            >
              <h3 className="text-lg font-semibold text-white">{file.title}</h3>
              <p className="text-sm text-gray-300 mt-2">
                Last updated: {new Date(file.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <CommonDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="Create New File"
      >
        <input
          type="text"
          placeholder="Enter file name"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <CommonButton
          label="Create File"
          type="submit"
          isLoading={loading}
          className=" w-[30%] bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 whitespace-nowrap"
          onClick={createFile}
          disabled={title.trim() === ""}
        />
      </CommonDialog>
    </div>
  );
};
export default AllFiles;
