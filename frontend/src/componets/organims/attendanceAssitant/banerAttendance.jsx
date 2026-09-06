import { Button } from "../../atoms/button"
import { TitleAndDescaription } from "../../molecules/titleandDescription"
import { MdOutlineQrCode2 } from "react-icons/md";
import { useModal } from "../../../hooks/hookModal/useModal";
import { ModalScanner } from "../../modals/assistant/modalScanner";

function BannerAttendanceAssitant ({findStudentByDni, createAttendance, onScanSuccess, disabled = false}) {

  const {
    isOpen,
    openModal,
    closeModal,
  } = useModal()

  const handleCreateAttendance = async (params) => {
    await createAttendance(params);
    onScanSuccess?.(params.idStudent); // notifica al padre
  };

  const title = 'Registro de Asistencias'
  const description = 'Registra la asistencia diaria de los estudiantes'

  return(
    <section className="
      flex items-center justify-between
      mt-6 md:mt-0
      py-8 
      w-[96%]
      md:w-[90%]
      md:max-w-7xl
      mx-auto
    ">
      <TitleAndDescaription
        title={title}
        description={description}
        level='h2'
        weight='bold'
      />
      <Button
        variant="danger"
        className="flex items-center gap-2"
        onClick={openModal}
        disabled = {disabled}
        title={disabled ? "Solo puedes escanear en la fecha actual" : undefined} 
      > 
        <span>Esacaner QR</span>
        <MdOutlineQrCode2 size={30} className=""/>
      </Button>
      {
        isOpen && (
            <ModalScanner
              closeModal={closeModal}
              findStudentByDni={findStudentByDni}
              createAttendance={handleCreateAttendance}
            /> 
    )
      }
    </section>
  ) 
}

export {BannerAttendanceAssitant}