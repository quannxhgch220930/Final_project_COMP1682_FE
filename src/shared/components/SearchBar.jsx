import { Input } from 'antd'

function SearchBar({
  className = '',
  value,
  onChange,
  placeholder = 'Search...',
}) {
  return (
    <div className={`flex min-w-[220px] flex-1 ${className}`.trim()}>
      <Input
        size="large"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
