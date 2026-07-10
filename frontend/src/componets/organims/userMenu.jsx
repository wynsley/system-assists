import { IoNotifications } from "react-icons/io5";
import { Button } from '../atoms/button';
import { UserNavbar } from '../molecules/userNavbar';
import { NavbarMenu } from '../molecules/desktopMenu';
import { Link } from 'react-router-dom';
//HOOKS
import { useModal } from "../../hooks/hookModal/useModal";
import { useAuth } from "../../hooks/hookGlobals/useAuth";
import { useNavbar } from "../../context/navbarContext";
//MODALES
import { UserMenuModal } from '../modals/modalsUser/userMenuModal';
import { ChangePasswordModal } from '../modals/modalsUser/userPasswordModal';
import { useNotifications } from "../../hooks/hooksAssistant/useNotifications";

function UserMenu({ mobile = false }) {

  //hook modal
  const userMenuModal = useModal()
  const passwordModal = useModal()

  //hook idenfiticar rol
  const { role, userData } = useAuth()

  //hook mobilOpen
  const { setMobileOpen } = useNavbar()

  //hook notificasiones no leidas 
  const { unreadCount } = useNotifications();

  //navegar a las notificaciones segun el rol
  const notificationsRutes = {
    ADMIN: '/notifications-assistant',
    AUXILIAR: '/notifications-assistant',
    PARENT: '/notifications-student',
  }
  const notificationRoute =
    notificationsRutes[role] || '/notifications-student';

  //información del usuario authendicado
  const user = {
  name: `${userData?.firstname} ${userData?.lastname}`,
  email: userData?.email,
  avatar: null, // mientras no tengas foto
};

  console.log(userData);
  return (
    <div className={`
        ${mobile
        ? "flex w-full mt-4 justify-end border-t border-white/10 pt-4"
        : `flex-col items-end hidden 
            md:flex  md:flex-row md:items-center md:relative ml-auto h-full`
      }
      
      `}
    >
      {/*icono notificaciones*/}
      <Link
        to={notificationRoute}
        onClick={() => setMobileOpen(false)}
        variant=''
        className="text-white p-[1em]  relative
        transition-colors duration-400 hover:bg-blueT border-r boder-white
      ">
        <IoNotifications size={23} className='text-white' />
        {
          unreadCount > 0 && (
            <span
              className="
        absolute
        top-1
        right-1
        min-w-5
        h-5
        px-1
        rounded-full
        bg-red-500
        text-white
        text-[10px]
        flex items-center justify-center
        font-bold
      "
            >
              {unreadCount}
            </span>
          )
        }
      </Link>

      {/*Usuario en el navbar */}
      <UserNavbar
        user={user}
        toggleModal={userMenuModal.toggleModal}
        isOpen={userMenuModal.isOpen}
      />

      {/*Renderizado de modales menu usuario y cambiar contraseña */}
      {
        userMenuModal.isOpen && (
          <UserMenuModal
            closeModal={userMenuModal.closeModal}
            openPasswordModal={passwordModal.openModal}
            user={user}
          />
        )
      }
      {
        passwordModal.isOpen && (
          <ChangePasswordModal
            closeModal={passwordModal.closeModal}
          />
        )
      }
    </div>
  );
}

export { UserMenu };