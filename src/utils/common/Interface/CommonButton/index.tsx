export interface CommonButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  varient?: "solid" | "outlined" | "text";
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}
