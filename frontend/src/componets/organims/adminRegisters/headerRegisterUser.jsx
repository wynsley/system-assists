import { FaUserPlus } from "react-icons/fa6"
import { Button } from "../../atoms/button"
import { HiPlus } from "react-icons/hi";
import { TitleAndDescaription } from "../../molecules/titleandDescription"
import { ModalRegisterUser } from "../../modals/adminRegisters/modalReegisterUsers"
//hooks
import { useModal } from "../../../hooks/hookModal/useModal"

function HeaderRegisterUser  () {
  // hook de modal
  const modalOpenRegisterUser = useModal()

  //abrir el modal de registrar usuario
  const handleOpenRegisterUser = () => {
    modalOpenRegisterUser.openModal()
  }

  return(
    <section className="mt-8 flex items-center justify-between
      w-[96%] md:w-[90%] md:max-w-7xl mx-auto relative"
    >
      <TitleAndDescaription
        title= 'Registrar Usuarios'
        description= 'Gestiona los usuarios del sistema'
        level='h2'
        weight='bold'  
      />
        <Button
        onClick={handleOpenRegisterUser}
        variant="primary"
        className="flex items-center gap-2"
      >
        <FaUserPlus className="size-5"/>
        <span className="hidden sm:block">Nuevo</span> Usuario
      </Button>

      {
        modalOpenRegisterUser.isOpen && (
          <ModalRegisterUser
            closeModal={modalOpenRegisterUser.closeModal}
          />
        )
      }
      
    </section>
  )
}

export {HeaderRegisterUser}