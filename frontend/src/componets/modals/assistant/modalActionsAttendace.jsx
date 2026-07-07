import { FiX } from "react-icons/fi";
import { Title } from "../../atoms/title";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";

function ModalActionsAttendance({ closeModal, attendance, updateAttendance }) {
  const modalRef = useClickOutside(closeModal);
  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();

  const handleChangeStatus = async (status) => {
    startLoading();
    try {
      await updateAttendance(attendance.idAttendance, { status });
      showToast("Estado actualizado correctamente", "success");
      closeModal();
    } catch (err) {
      showToast(err.message || "Error al actualizar estado", "error");
    } finally {
      stopLoading();
    }
  };

  const statusActions = [
    { text: "Presente",   status: "PRESENTE",   className: "bg-green-100 text-green-700" },
    { text: "Tardanza",   status: "TARDANZA",   className: "bg-yellow-100 text-yellow-700" },
    { text: "Justificada",status: "JUSTIFICADA",className: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div
      ref={modalRef}
      className="absolute flex flex-col gap-4 p-2 rounded-md bg-blue z-10 right-2"
    >
      <div className="relative">
        <Title level="h4" weight="bold" variant="primary" text="Selecciona el estado" />
        <FiX onClick={closeModal} className="text-lg text-white absolute top-0 right-0" />
      </div>
      <div className="flex items-start gap-2">
        {statusActions.map((action) => (
          <button
            key={action.status}
            onClick={() => handleChangeStatus(action.status)}
            disabled={loading || attendance.status === action.status}
            className={`
              ${action.className}
              px-2 py-1 cursor-pointer rounded-md
              transition-all duration-300 hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? "..." : action.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export { ModalActionsAttendance };