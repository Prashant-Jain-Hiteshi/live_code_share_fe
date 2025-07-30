export interface Invitation {
  invitationContent: string;
  room: {
    id: number;
    title: string;
  };
}
export interface NotificationProps {
  invitations: Invitation[];
}
export interface UserInfo {
  name: string;
  email: string;
  profileImage?: string;
}
