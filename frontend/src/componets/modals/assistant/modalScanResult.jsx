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
      await createAttendance({ idStudent: student.idStudent, status });
      showToast(`Asistencia de ${student.firstname} registrada`, "success");
      closeModal();
    } catch (err) {
      showToast(err.message || "Error al registrar asistencia", "error");
    } finally {
      stopLoading();
    }
  };

  const statusActions = [
    { text: "Presente",    status: "PRESENTE",    className: "bg-green-100 text-green-700" },
    { text: "Tardanza",    status: "TARDANZA",    className: "bg-yellow-100 text-yellow-700" },
    { text: "Justificada", status: "JUSTIFICADA", className: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div className="  absolute
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/40
    backdrop-blur-sm
  ">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm flex flex-col gap-4"
      >
        <div className="relative flex flex-col items-center border-b border-gray-200 pb-4">
          <Title level="h3" weight="bold" text="Estudiante encontrado" />
          <FiX
            size={20}
            className="absolute right-0 top-0 cursor-pointer text-gray-400"
            onClick={closeModal}
          />
        </div>

        {/* Info del estudiante */}
        <div className="flex flex-col gap-1 bg-gray-50 rounded-md p-4">
          <p className="font-bold text-gray-800">
            {student.firstname} {student.lastname}
          </p>
          <p className="text-sm text-gray-500">DNI: {student.dni}</p>
          {student.classroom && (
            <p className="text-sm text-gray-500">
              {student.classroom.grade}° {student.classroom.section} — {student.classroom.year}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 text-center">
          Selecciona el estado de asistencia:
        </p>

        <div className="flex gap-3 justify-center">
          {statusActions.map((action) => (
            <button
              key={action.status}
              onClick={() => handleSelect(action.status)}
              disabled={loading}
              className={`
                ${action.className}
                px-4 py-2 rounded-md font-medium text-sm
                transition-all duration-300 hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {loading ? "..." : action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ModalScanResult };