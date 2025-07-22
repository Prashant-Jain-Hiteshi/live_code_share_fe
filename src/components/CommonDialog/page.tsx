// components/CommonDialog.tsx
"use client";

import { DialogdProps } from "@/utils/common/Interface/CommonDialog";
import React from "react";

const CommonDialog: React.FC<DialogdProps> = ({
  isOpen,
  title,
  description,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 transition-opacity  flex justify-center items-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 relative text-white  border border-gray-700 ">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        <div className="flex flex-col gap-4">{children}</div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white  hover:cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CommonDialog;
