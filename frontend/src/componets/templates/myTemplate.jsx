function MyTemplate({ children, className = '' }) {
  return (
    <div className={`
      bg-[#f9fafb] pt-[4em]  flex flex-col justify-center
      ${className}
    `}>
      {children}
    </div>
  )
}

export { MyTemplate }