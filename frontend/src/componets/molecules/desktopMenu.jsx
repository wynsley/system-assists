import { useRef, useEffect } from "react";
import { HiBars3, HiXMark, HiChevronDown } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import { NavbarLink } from "../atoms/navbarLink";
import { MobileMenu } from "./mobileMenu";
import { menuByRole } from "../../config/sidebarLinks";
import { useAuth } from "../../hooks/hookGlobals/useAuth";
import { useNavbar } from "../../context/navbarContext";

function NavbarMenu() {
  const {
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
  } = useNavbar();

  const menuRef = useRef(null);
  const location = useLocation();
  const { role } = useAuth();

  const menu = menuByRole[role] || [];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setMobileOpen((prev) => !prev);
  };

  // Cierra el menú al cambiar de ruta (fix principal del bug)
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Cierra al hacer click fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isItemActive = (item) => {
    if (item.submenu) {
      return item.submenu.some((subitem) =>
        location.pathname.startsWith(subitem.href)
      );
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <div ref={menuRef}>
      {/* HAMBURGER */}
      <button
        className="md:hidden text-white z-50 relative"
        onClick={handleToggle}
      >
        {mobileOpen ? <HiXMark size={28} /> : <HiBars3 size={28} />}
      </button>

      {/* DESKTOP MENU */}
      <ul
        className="
          hidden md:flex
          top-0 h-full
          list-none m-0 p-0
          absolute left-1/2 -translate-x-1/2
        "
      >
        {menu.map((item, index) => (
          <li
            key={index}
            className={`
              ${isItemActive(item) ? "bg-blueT" : ""}
              h-[4em] px-5 xl:px-8
              flex items-center relative
              transition-colors duration-300
              hover:bg-blueT
            `}
          >
            {item.submenu ? (
              <div className="relative h-full flex items-center ">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center gap-1 h-full text-white font-poppins text-[.9em]"
                >
                  {item.text}
                  <HiChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openDropdown === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === index && (
                  <ul
                    className="
                      absolute top-full left-0
                      shadow-lg py-2 bg-blue
                      min-w-[230px] z-50
                      list-none overflow-hidden
                    "
                  >
                    {item.submenu.map((subitem, subindex) => (
                      <NavbarLink
                        key={subindex}
                        href={subitem.href}
                        text={subitem.text}
                        onClick={() => setOpenDropdown(null)}
                        variant="submenu"
                        className="
                          block px-5 py-3
                          text-white text-[.85em]
                          hover:bg-blueT/80 hover:pl-6
                          transition-all duration-200
                        "
                      />
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavbarLink
                href={item.href}
                text={item.text}
                className="text-white text-[.9em]"
              />
            )}
          </li>
        ))}
      </ul>

      {/* MOBILE MENU */}
      <MobileMenu
        menu={menu}
        mobileOpen={mobileOpen}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        setOpenDropdown={setOpenDropdown}
        setMobileOpen={setMobileOpen}
      />
    </div>
  );
}

export { NavbarMenu };