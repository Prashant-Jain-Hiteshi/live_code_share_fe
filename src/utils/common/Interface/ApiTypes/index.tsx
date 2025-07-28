export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginFormData {
  email: string;
}
export interface OtpFormData {
  email: string;
  otp: string;
}
export interface CreateFilePayload {
  title: string;
  content: string;
}

export interface GetFileByIdResponse {
  content: string;
  title: string;
}

export interface UpdateFileContentPayload {
  content: string;
}

export interface ShareFilePayload {
  email: string;
  fileLink: string;
}
