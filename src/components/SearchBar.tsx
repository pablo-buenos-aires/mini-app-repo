type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  return (
    <label className="search-bar">
      <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79l5 5 1.5-1.5-5-5zm-5.5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
        />
      </svg>
      <input
        className="search-input"
        type="text"
        placeholder={placeholder ?? 'Search'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};

export default SearchBar;
