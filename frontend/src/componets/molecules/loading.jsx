function Loading({
  logo = null,
  background = "bg-white",
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${background}`}
    >
      <div className="relative flex h-30 w-30 items-center justify-center">

        <div className="loader-ring absolute inset-0 rounded-full"></div>

        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="relative z-10 h-20 w-20 rounded-full object-contain"
          />
        )}

      </div>
    </div>
  );
}

export { Loading };