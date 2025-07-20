"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FileType = {
  id: number;
  title: string;
  updatedAt: string;
};

export default function MyFilesPage() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null; // Store after login

  // ✅ Fetch user files
  useEffect(() => {
    if (!token || !userId) return;

    const fetchFiles = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/files?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading your files...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Files</h1>

      {files.length === 0 ? (
        <p className="text-gray-500">You have no files yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => router.push(`/editor/${file.id}`)}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h3 className="text-lg font-semibold text-primary-black">
                {file.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(file.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
