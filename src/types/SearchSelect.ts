export interface SearchableSelectOption {
	value: string;
	label: string;
}

export interface SearchableSelectProps {
	options: SearchableSelectOption[];
	value: string;
	onChange: (value: string) => void;
	onSearch?: (query: string) => void;
	placeholder?: string;
	error?: string;
	loading?: boolean;
	disabled?: boolean;
	onSearchChange?: (query: string) => void;
}
