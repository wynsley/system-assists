import { HiPlus } from "react-icons/hi2";
import { Button } from "../../atoms/button";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
//modals
import { ModalMangAcademic } from "../../modals/adminRegisters/modalMangAcademic";
import { ModalCreateGrade } from "../../modals/adminRegisters/ModalCreateGrade";
import { ModalCreateSection } from "../../modals/adminRegisters/modalCreateSection";
import { ModalCreateClassroom } from "../../modals/adminRegisters/ModalCreateClassroom";

import { useModal } from "../../../hooks/hookModal/useModal";

function HeaderAcademic({
  refetchGrades,
  refethcSections,
  refetchClassroom
}) {
  //hooks modals
  const modalMangAcademy = useModal();
  const modalGrade = useModal();
  const modalSection = useModal();
  const modalClassroom = useModal();

  return (
    <section
      className="
        mt-8 flex items-center justify-between
        w-[96%] md:w-[90%] md:max-w-7xl
        mx-auto relative
      "
    >
      <TitleAndDescaription
        weight="bold"
        level="h2"
        title="Gestión Académica"
        description="Administra la estructura académica de la institución"
      />

      <Button
        onClick={modalMangAcademy.openModal}
        variant="primary"
        className="flex items-center gap-1"
      >
        <HiPlus className="size-5" />
        Gestión{" "}
        <span className="block sm:hidden">.A</span>
        <span className="hidden sm:block">Académica</span>
      </Button>

      {modalMangAcademy.isOpen && (
        <ModalMangAcademic
          closeModal={modalMangAcademy.closeModal}
          openGrade={() => {
            modalMangAcademy.closeModal();
            modalGrade.openModal();
          }}
          openSection={() => {
            modalMangAcademy.closeModal();
            modalSection.openModal();
          }}
          openClassroom={() => {
            modalMangAcademy.closeModal();
            modalClassroom.openModal();
          }}
        />
      )}
      
      {modalGrade.isOpen && (
        <ModalCreateGrade 
          closeModal={modalGrade.closeModal}
          onSuccess={refetchGrades}
        />
      )}

      {modalSection.isOpen && (
        <ModalCreateSection 
          closeModal={modalSection.closeModal}
          onSuccess={refethcSections}
        />
      )}

      {modalClassroom.isOpen && (
        <ModalCreateClassroom 
          closeModal={modalClassroom.closeModal}
          onSuccess={refetchClassroom}
        />
      )}
    </section>
  );
}

export { HeaderAcademic };