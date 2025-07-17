export interface InputFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "number" | "password" | "time";
  value: string;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  extraValidation?: (value: string) => string | null;
  length?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  externalError?: string;
  disabled?: boolean;
  placeholder?: string;
  errorSpace?: boolean;
}
