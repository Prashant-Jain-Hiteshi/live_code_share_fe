export interface Invitation {
  id: number;
  invitationContent: string;
  room: {
    id: number;
    title: string;
  };
}
export interface NotificationProps {
  invitations: Invitation[];
  onAccept: (invitationId: number) => void;
  setOpenNotif: () => void;
}
export interface UserInfo {
  name: string;
  email: string;
  profileImage?: string;
}
