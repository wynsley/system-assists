function Link({
  href, 
  onClick, 
  className = '', 
  variant = 'default',
  text,
  target, 
  children,
  size = 'medium'
}) {

  const variants = {
    default: `
      text-left text-cyan-700 hover:text-cyan-900 hover:underline
      transition-colors duration-300
      cursor-pointer
    `,
    primary: ` `,
    secondary: ` `, 
    danger: `flex gap-1 items-end-safe justify-center `,
    varFlex : ` `,
  
  }

  const sices = {
    small : `md:text-[.7em]`,
    medium : `text-[1em] `,
    large : `md:text-[1em]`
  }
  return (
    <a
    target={target}
      href={href}
      onClick={onClick}
      className={`
        ${className}
        ${variants[variant] || variants.default}
        ${sices[size] || sices.medium}
      `}
    >
      {children || text}
    </a>
  );
}

export { Link };