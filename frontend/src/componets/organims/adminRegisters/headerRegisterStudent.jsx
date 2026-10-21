import { FaUserPlus } from "react-icons/fa6";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { Button } from "../../atoms/button";
//hooks
import { useModal } from "../../../hooks/hookModal/useModal";
// modales
import { ModalOptionsRegister } from "../../modals/adminRegisters/modalOptionsRegister";
import { ModalRegisterStudent } from "../../modals/adminRegisters/modalRegisterStudents";
import { ModalImportStudents } from "../../modals/adminRegisters/modalImportStudents";

function HeaderRegisterStudent() {

  const modalOptionsRegister = useModal();
  const modalRegisterStudents = useModal();
  const modalImportStudents = useModal();

  //Abrir el modal de opciones de registro
  const handleOpenOptions = () => {
    modalOptionsRegister.openModal();
  };

  //Abril modal de registro manual
  const handleOpenRegisterStudent = () => {
    modalOptionsRegister.closeModal();
    modalRegisterStudents.openModal();
  };

  //Abrir el modal de importar estudiantes
  const handleImportStudents = () => {
    modalOptionsRegister.closeModal();
    modalImportStudents.openModal()
  }
  
  return (
    <section className="mt-8 flex items-center justify-between
      w-[96%] md:w-[90%] md:max-w-7xl mx-auto relative"
    >
      <TitleAndDescaription
        title="Registro de Estudiantes"
        level="h2"
        weight="bold"
        description="Gestiona los estudiantes de la institución"
      />
        <Button
        onClick={handleOpenOptions}
        variant="primary"
        className="flex items-center gap-2  "
      >
        <FaUserPlus className="size-5" />
        Nuevo Estudiante
      </Button>
          {modalOptionsRegister.isOpen && (
              <ModalOptionsRegister
                closeModal={modalOptionsRegister.closeModal}
                onRegisterStudent={handleOpenRegisterStudent}
                onImportStudents={handleImportStudents}
              />
          )}

          {modalRegisterStudents.isOpen && (
              <ModalRegisterStudent
                closeModal={modalRegisterStudents.closeModal}
              />
          )}

          {
            modalImportStudents.isOpen && (
              <ModalImportStudents
              closeModal={modalImportStudents.closeModal}
            />
            )
          }

    </section>
  );
}

export { HeaderRegisterStudent };