import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Title } from "../../atoms/title";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { Paragraph } from "../../atoms/paragraph";
import { Small } from "../../atoms/small";

function ModalActionsAttendance({ closeModal, attendance, saveAttendance }) {
  const modalRef = useClickOutside(closeModal);
  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState(
    attendance.status && attendance.status !== "FALTA" ? attendance.status : null
  );
  const [note, setNote] = useState(attendance.note ?? "");

  const statusActions = [
    { text: "Presente",    status: "PRESENTE",    className: "bg-green-100 text-green-700 hover:bg-green-200" },
    { text: "Tardanza",    status: "TARDANZA",    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { text: "Justificada", status: "JUSTIFICADA", className: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  ];

  const handleSave = async () => {
    if (!selectedStatus) {
      showToast("Selecciona un estado", "error");
      return;
    }
    startLoading();
    try {
      await saveAttendance(attendance, { status: selectedStatus, note });
      showToast("Asistencia actualizada correctamente", "success");
      closeModal();
    } catch (err) {
      showToast(err.message || "Error al guardar asistencia", "error");
    } finally {
      stopLoading();
    }
  };

  const classroomStudent = `${attendance.grade}° ${attendance.section} — DNI: ${attendance.dni}`
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 border border-gray-200"
      >
        <div className="relative flex flex-col border-b border-gray-200 pb-4">
          <Title 
            level="h3" 
            weight="bold" 
            text="EDITAR ASISTENCIA" 
          />
            
          <Paragraph 
            text = {attendance.fullname}
            variant="primary"
            weight="bold"
            align="center"
            size="small"
          />
          <Small 
            text={classroomStudent}
            align="center"
          />
            
          <FiX
            size={20}
            onClick={closeModal}
            className="absolute right-0 top-0 cursor-pointer text-gray-400 hover:text-gray-700"
          />
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {statusActions.map((action) => (
            <button
              key={action.status}
              onClick={() => setSelectedStatus(action.status)}
              disabled={loading}
              className={`
                ${action.className}
                ${selectedStatus === action.status ? "ring-2 ring-offset-1 ring-blue-500" : ""}
                flex-1 py-2 rounded-lg font-semibold text-sm
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {action.text}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Motivo o justificación (opcional)"
          rows={3}
          maxLength={100}
          className="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          onClick={handleSave}
          disabled={loading || !selectedStatus}
          className="
            bg-blue text-white font-semibold rounded-lg py-2.5 text-sm
            hover:opacity-90 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

export { ModalActionsAttendance };