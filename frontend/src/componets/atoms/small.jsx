function Small ({
  text,
  children,
  variant = 'default',
  size = 'small',
  align = 'left',
  className = '',
  ...props
}) {

  const variants = {
    default : `text-gray-500`,
    primary: `text-blueT`,
    secondary: `text-black`,
    ternary: `text-blue`
  }

  const sices = {
    xsmall: 'text-[.7em]',
    small: 'text-[.8em]',
    medium: 'text-sm',
    large: 'text-[.9em] ',
    xlarge: 'text-[1em]'
  }

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  return(
    <small
      className={`
        ${className}
        ${variants[variant] || variants.default}
        ${sices[size] || sices.medium}
        ${alignments[align] || alignments.left}
      `}
    >
      {children || text}
    </small>
  )
}

export {Small}