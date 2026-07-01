import { FiX } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi2";
import { MdClass, MdMeetingRoom } from "react-icons/md";
//hoks
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useModalAnimation } from "../../../hooks/hookModal/useModalAnimation";

import { Title } from "../../atoms/title";
import { Button } from "../../atoms/button";

function ModalMangAcademic({
  closeModal,
  openGrade,
  openSection,
  openClassroom,
}) {
  const { isClosing, handleClose } = useModalAnimation(closeModal);

  const modalRef = useClickOutside(handleClose);

  const options = [
    {
      icon: HiAcademicCap,
      text: "Crear Grado",
      onClick: openGrade,
    },
    {
      icon: MdClass,
      text: "Crear Sección",
      onClick: openSection,
    },
    {
      icon: MdMeetingRoom,
      text: "Crear Aula",
      onClick: openClassroom,
    },
  ];

  return (
    <div
      ref={modalRef}
      className={`absolute right-0 top-15 w-72 rounded-lg bg-blue
        text-white shadow-xl z-100 transition-all duration-300
        animate-[slideDown_0.3s_ease-out]
        ${
          isClosing
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }
      `}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/20">
        <Title
          text="Gestión Académica"
          variant="primary"
          level="h4"
          weight="bold"
        />

        <FiX
          className="size-5 cursor-pointer"
          onClick={handleClose}
        />
      </div>

      <div className="flex flex-col">
        {options.map(({ icon: Icon, text, onClick }) => (
          <Button
            key={text}
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 text-left
              transition-all duration-300
              hover:bg-blueT
            "
          >
            <Icon size={22} />

            <Title
              text={text}
              variant="primary"
              level="h5"
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

export { ModalMangAcademic };