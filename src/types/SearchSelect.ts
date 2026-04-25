export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
}