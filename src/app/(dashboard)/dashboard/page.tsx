"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createFile = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    console.log(token);
    // const token = "<PUT_YOUR_TOKEN_HERE>"; // Replace with real token or from auth state

    try {
      const res = await fetch("http://localhost:4000/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "indexNew123.js",
          content: "console.log('Hello World');",
        }),
      });

      if (!res.ok) throw new Error("Failed to create file");

      const data = await res.json();
      router.push(`/editor/${data.id}`); // Redirect to editor with fileId
    } catch (err) {
      console.error(err);
      alert("Error creating file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }} className="bg-white">
      <h1>Real-Time Docs</h1>
      <button onClick={createFile} disabled={loading}>
        {loading ? "Creating..." : "Create New File"}
      </button>
    </div>
  );
}
