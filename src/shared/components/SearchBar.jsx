import Input from '../ui/Input'

function SearchBar({
  className = '',
  inputClassName = '',
  value,
  onChange,
  placeholder = 'Search...',
}) {
  return (
    <div className={`flex min-w-[220px] flex-1 ${className}`.trim()}>
      <Input
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
