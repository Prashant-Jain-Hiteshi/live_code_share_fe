import { NotificationProps } from "@/utils/common/Interface/Heder";
import { useRouter } from "next/navigation";
import React from "react";

const Notification: React.FC<NotificationProps> = ({ invitations }) => {
  const router = useRouter();
  const handleNavigate = (roomId: number) => {
    console.log(roomId, "roomId");
    router.push(`/editor/${roomId}`);
  };
  return (
    <div className="absolute right-0 top-10 mt-2 w-72 bg-card text-white shadow-lg rounded-md z-50">
      <div className="p-3 border-b border-gray-600 font-semibold">
        Notifications
      </div>
      <div className="max-h-64 overflow-y-auto">
        {invitations.length === 0 ? (
          <p className="text-sm text-center py-4 text-gray-400">
            No new invitations
          </p>
        ) : (
          invitations.map((invite, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(invite.room.id)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200"
            >
              <div className="text-sm text-white leading-snug">
                <p>
                  <span className="font-semibold text-green-500">
                    Invitation:
                  </span>{" "}
                  You’ve been invited to collaborate on{" "}
                  <span className="font-medium text-white">
                    {invite.room.title}
                  </span>
                  .
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
