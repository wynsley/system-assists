import { FiAlertTriangle } from "react-icons/fi";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";

function ModalConfirm({
  closeModal,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  variant = "danger", // "danger" | "warning"
}) {
  const modalRef = useClickOutside(closeModal);
  const { loading, startLoading, stopLoading } = useLoading();

  const handleConfirm = async () => {
    startLoading();
    try {
      await onConfirm();
      closeModal();
    } catch {
      stopLoading();
    }
  };

  const colors = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: "bg-yellow-100 text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
  }[variant];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[200]">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm flex flex-col gap-5"
      >
        {/* Icono */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`p-3 rounded-full ${colors.icon}`}>
            <FiAlertTriangle size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 font-poppins">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="
              px-5 py-2 rounded-md border border-gray-300
              text-gray-700 text-sm font-medium
              hover:bg-gray-50 transition-colors
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`
              px-5 py-2 rounded-md text-sm font-medium
              transition-colors disabled:opacity-50
              ${colors.button}
            `}
          >
            {loading ? "Eliminando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ModalConfirm };