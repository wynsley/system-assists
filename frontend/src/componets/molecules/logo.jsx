import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/hookGlobals/useAuth";
import { ROLE_ROUTES } from "../../config/dashboardRutes";

function Logo({ variant = 'default' }) {

  const navigate = useNavigate()
  
  const {userData} = useAuth()

  const handleNavigate = () => {
    if (!userData) return;
    const path = ROLE_ROUTES[userData.role];
    console.log("Path:", path);
    if (path) {
      navigate(path);
    }
  };

  const variants = {
    default: `relative w-[7em] h-[7em] rounded-full overflow-hidden mt-13`,
    primary: `relative w-[10em] h-[10em] rounded-full overflow-hidden`
  }

  return (
    <div
      onClick={handleNavigate}
      className={`
        ${variants[variant] || variants.default}
        group cursor-pointer
      `}
    >

      {/* Shine effect */}
      <span
        className="
          pointer-events-none absolute top-0 left-[-75%]
          w-[50%] h-full
          bg-linear-to-r from-transparent via-amber-400/40 to-transparent
          skew-x-[-25deg]
          group-hover:animate-[shine_0.9s_ease-in-out]
        "
      />

      <div
        className="
          relative z-10 flex items-center justify-center
          w-full h-full
          bg-brown-700 text-beige
          transition-colors duration-300
        "
      >
        <img
          src="/LOGO.png"
          alt="Logo Institucional"
          className="w-[88%] h-[88%] object-contain transition-transform duration-300"
        />
      </div>
    </div>
  );
}

export { Logo };