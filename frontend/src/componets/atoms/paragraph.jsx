function Paragraph ({ 
  children,
  text, 
  className = '',
  size = 'medium',
  variant = 'default',
  align = 'left',
  weight = 'normal',
  ...props 
}) {

  const variants ={
    base: 'text-white',
    default: 'text-black',
    primary: 'text-cyan-700',
    secondary: 'text-white/70  ',
    danger: 'text-blueT',
    ternary: 'text-gray-500'
  };

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const sizes = {
    base : "text-base",
    small:  "text-[0.8em] sm:text-[.9em] md:text-[1em]",
    medium: "text-[.8em] sm:text-[.9em] md:text-[1em] lg:text-[1.1em]" ,
    large:  "text-[.9em] lg:text-[1.2em] xl:text-[1.2em]",
    slogan : " text-[1.2em] lg:text-[1.2em] xl:text-[1.5em]",
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    semi: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <p 
      className={`
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.medium}
        ${alignments[align] || alignments.left}
        ${weights[weight] || weights.normal}
        ${className}
      `}
      {...props}
    >
      {children || text}
    </p>
  );
};

export { Paragraph };