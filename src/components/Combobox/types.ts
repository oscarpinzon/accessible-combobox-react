export interface ComboboxProps {
  id: string;
  label: string;
  value: string;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  maxDisplayed?: number;
  className?: string;
  isValid?: (value: string) => boolean;
  minCharsForSuggestions?: number;
  helperText?: string;
  errorText?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ComboboxOption {
  value: string;
  label: string;
}
