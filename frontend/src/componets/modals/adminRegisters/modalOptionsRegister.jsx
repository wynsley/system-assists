import { useState } from "react"
import { FiX } from "react-icons/fi";
import { FaUserEdit, FaFileImport  } from "react-icons/fa";
import { Small } from "../../atoms/small"
import { Title } from "../../atoms/title"
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside"
import { Button } from "../../atoms/button";
import { useModalAnimation } from "../../../hooks/hookModal/useModalAnimation";

function ModalOptionsRegister({ closeModal, onRegisterStudent }) {
  const {isClosing, handleClose} = useModalAnimation(closeModal)

  //hook para cerrar modal al hacer click fuera
  const modalRef = useClickOutside(handleClose);

  //abrir modal de registro y cerrar el modal de opciones
    const handleClickRegister = () => {
    handleClose();
    setTimeout(() => onRegisterStudent(), 300);
  };

  return (
    <div
        ref={modalRef}
        className={`
          absolute right-0 top-15 bg-blue shadow-xl rounded-lg w-72 text-white
          transition-all duration-30 animate-[slideDown_0.3s_ease-out] z-1000
        ${isClosing
          ? "opacity-0 translate-y-2"
          : "opacity-100 translate-y-0"
        }
          `}

      >
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <Title
            text="¿Cómo deseas agregarlo?"
            variant="primary"
            level="h4"
            weight="bold"
          />

          <FiX
            className="size-5 cursor-pointer"
            onClick={handleClose}
          />
        </div>

        <div className=" flex flex-col items-start justify-center ">
          <Button
            onClick={handleClose}
            className="p-2 flex gap-2 items-center transition-all duration-300 hover:bg-blueT w-full text-left"
          >
            <FaFileImport/> Subir Archivo
          </Button>

          <Button
            onClick={handleClickRegister}
            className="p-2 flex gap-2 items-center transition-all duration-300 hover:bg-blueT w-full text-left"
          >
            <FaUserEdit  className="size-5"/> Registro Manual
          </Button>
        </div>

      </div>
  )
}

export{ModalOptionsRegister}