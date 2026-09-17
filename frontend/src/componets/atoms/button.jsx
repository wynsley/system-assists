function Button({
  text,
  onClick,
  className = '',
  type,
  disabled = false, 
  children,
  variant = 'default'
}) {

  const variants = {
    base: ' bg-blueT text-white font-bold rounded-md px-3 transition-all duration-300 hover:-translate-y-1',
    default: ` text-white px-3`,
    primary: `
    md:right-9 lg:right-9  xl:right-8 bottom-[-2em]
    bg-blue h-10 px-3 rounded-[10px]
    text-[.8em] lg:text-[.9em] xl:text-[1em]
    font-semibold text-white border-none
    shadow-blue
    hover:bg-blueT hover:shadow-md
    transition-all duration-300 cursor-pointer
    `,
    secondary: `
    w-full bg-blue text-white font-bold text-[1.1em]
    py-1 transition-all duration-300 ease-in-out
    hover:bg-blueT
    hover:shadow-lg
    hover:-translate-y-0.5
    active:scale-95
    `,
    ternary: `
    px-3 py-2 rounded-md font-semibold transition duration-300
    bg-gray-300 
    hover:bg-gray-300 cursor-pointer
    `,
    danger: `my-auto bg-blueT p-3 rounded-md text-white
      transition-all duration-300 hover:-translate-y-[1px] 
      hover:shadow-lg hover:shadow-blue
    `,
  }

  return (
    <button
      className={`
        ${className}
        ${variants[variant] || variants.default}
      `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text || children}
    </button>
  )
}

export { Button }