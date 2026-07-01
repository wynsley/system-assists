function Label({
  children,
  className,
  htmlFor,
  text,
  size = 'small',
  align = 'left',
  ...props }) {
  
    const sizeClass = {
    small : 'text-[.9em]',
    medium : 'text-[1em]',
    large : 'text-[1.5em]'
  }
  const alignClass = {
    left : 'text-left',
    center : 'text-center',
    right : 'text-right',
  }

  return (
    <label
      htmlFor={htmlFor}
      className={`
        ${className || ""}
        ${sizeClass[size] || sizeClass.medium}
        ${alignClass[align] || alignClass.left}
        `}
      {...props}
    >
      {children || text}
    </label>
  )
}

export { Label }