import { FiX } from "react-icons/fi";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { Title } from "../../atoms/title";

function ModalScanResult({ student, createAttendance, closeModal }) {
  const modalRef = useClickOutside(closeModal);
  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();

  const handleSelect = async (status) => {
    startLoading();
    try {
      await createAttendance({
        idStudent: student.idStudent,
        status,
      });
      showToast(
        ` ${student.firstname} ${student.lastname} — ${status}`,
        "success"
      );
      closeModal(); // cierra solo este modal, el scanner sigue abierto
    } catch (err) {
      showToast(err.message || "Error al registrar asistencia", "error");
    } finally {
      stopLoading();
    }
  };

  const statusActions = [
    { text: "Presente",    status: "PRESENTE",    className: "bg-green-100 text-green-700 hover:bg-green-200" },
    { text: "Tardanza",    status: "TARDANZA",    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { text: "Justificada", status: "JUSTIFICADA", className: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  ];

  return (
    // z-[200] > z-[100] del ModalScanner — flota encima
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm flex flex-col gap-4 border border-gray-200"
      >
        {/* Header */}
        <div className="relative flex flex-col items-center border-b border-gray-200 pb-4">
          <Title level="h3" weight="bold" text="Registrar asistencia" />
          <p className="text-xs text-gray-400 mt-1">
            Selecciona el estado para continuar
          </p>
          <FiX
            size={20}
            className="absolute right-0 top-0 cursor-pointer text-gray-400 hover:text-gray-700"
            onClick={closeModal}
          />
        </div>

        {/* Datos del estudiante */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
          <p className="font-bold text-gray-800 text-lg">
            {student.firstname} {student.lastname}
          </p>
          <p className="text-sm text-gray-500">DNI: {student.dni}</p>
          {student.classroom && (
            <p className="text-sm text-gray-500">
              {student.classroom.grade}° {student.classroom.section}
              {student.classroom.year ? ` — ${student.classroom.year}` : ""}
            </p>
          )}
          <span className={`
            mt-1 self-start text-xs px-2 py-1 rounded-full font-medium
            ${student.status === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
          `}>
            {student.status}
          </span>
        </div>

        {/* Botones de estado */}
        <div className="flex gap-3 justify-center">
          {statusActions.map((action) => (
            <button
              key={action.status}
              onClick={() => handleSelect(action.status)}
              disabled={loading}
              className={`
                ${action.className}
                flex-1 py-3 rounded-lg font-semibold text-sm
                transition-all duration-200 hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ...
                </span>
              ) : action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ModalScanResult };