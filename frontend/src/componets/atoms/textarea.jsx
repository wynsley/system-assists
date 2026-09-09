function Textarea({
  name,
  value,
  placeholder,
  onChange,
  required,
  rows = 4,
  className = '',
  size = 'medium',
  align = 'left',
  variant = 'default',
  ...props
}) {

  const variants = {
    default: `bg-gray-200 rounded-lg px-3 py-2
              border-none text-blak/50
              focus:border-blue-500 transition 
              focus:ring-1 focus:ring-blueT
              outline-none
              outline-none transition-all duration-200 resize-y`,
              
    primary: `w-full border-b border-[#a1a1a1] py-1 px-[1em] 
              bg-transparent resize-y`,
    secondary: `bg-transparent border-0 border-b border-blue
              px-2 pt-2 pb-0 w-full focus:outline-none 
              focus:border-[#FFBB00] transition resize-y`
  }

  const sizes = {
    small: 'text-[.9em]',
    medium: 'text-[1em]',
    large: 'text-[1.5em]'
  }

  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <textarea
      className={`
        ${className}
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.medium}
        ${aligns[align] || aligns.left}
      `}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      {...props}
    />
  )
}

export { Textarea }