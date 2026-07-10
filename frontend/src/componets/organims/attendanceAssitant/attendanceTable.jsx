import { FaEdit } from "react-icons/fa";
import { Table } from "../tableReusable";
import { FiltersSearchDownload } from "./filtersSerchDowldAttendance";
import { ModalActionsAttendance } from "../../modals/assistant/modalActionsAttendace";
import { statusBadge } from "../../../config/assistant/attendanceBadges";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { useStudentFilters } from "../../../hooks/hooksAssistant/useStudentFilters";

function AttendanceTable({ rows = [], lastScannedDni, saveAttendance }) {

  const {
    search,
    setSearch,
    grade,
    setGrade,
    section,
    setSection,
    filtered,
  } = useStudentFilters(rows);

  const { openRowId, openRow, closeRow } = useRowToggle();

  // Fila que está siendo editada (para renderizar el modal UNA sola vez, fuera de la tabla)
  const activeRow = filtered.find((r) => r.idStudent === openRowId) ?? null;

  const isEditable = (row) => Boolean(row.status) && row.status !== "FALTA";

  const handleEdit = (row) => {
    if (!isEditable(row)) return; // sin escaneo no se puede editar
    openRow(row.idStudent);
  };

  const headers = ["Estudiante", "DNI", "Grado", "Sección", "Estado", "Hora", "Acciones"];

  return (
    <div className="w-full lg:flex-1 mt-8">
      <FiltersSearchDownload
        search={search}
        setSearch={setSearch}
        grade={grade}
        setGrade={setGrade}
        section={section}
        setSection={setSection}
        students={rows}
        filtered={filtered}
      />

      <Table
        headers={headers}
        data={filtered}
        emptyMessage="No se encontraron registros de asistencia"
        renderRow={(row) => {
          const badge = statusBadge[row.status] ?? statusBadge.FALTA;
          const Icon = badge.icon;
          const isActive = openRowId === row.idStudent;
          const isJustScanned = lastScannedDni === row.dni;
          const editable = isEditable(row);

          return (
            <tr
              key={row.idStudent}
              className={`
                border-b border-gray-100 transition-colors
                ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}
              `}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 font-medium">
                  {isJustScanned && (
                    <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
                  )}
                  {row.fullname ?? "—"}
                </div>
              </td>
              <td className="px-6 py-4">{row.dni ?? "—"}</td>
              <td className="px-6 py-4">
                {row.grade ? `${row.grade}°` : "—"}
              </td>
              <td className="px-6 py-4">{row.section ?? "—"}</td>
              <td className="px-6 py-4">
                <span className={`
                  inline-flex items-center gap-1
                  px-3 py-1 rounded-full text-xs
                  ${badge.className}
                `}>
                  <Icon size={14} />
                  {badge.label}
                </span>
              </td>
              <td className="px-6 py-4">{row.time ?? "—"}</td>
              <td className="px-6 py-4">
                {editable ? (
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-700 hover:underline"
                  >
                    <FaEdit size={20} />
                  </button>
                ) : (
                  <span
                    title="Debe escanear al estudiante para registrar su asistencia"
                    className="relative inline-flex text-gray-300 cursor-not-allowed"
                  >
                    <FaEdit size={20} />
                    <span className="absolute inset-0 flex items-center">
                      <span className="w-full h-0.5 bg-gray-400 rotate-45" />
                    </span>
                  </span>
                )}
              </td>
            </tr>
          );
        }}
      />

      {/* Modal único, flotando sobre toda la tabla, no por fila */}
      {activeRow && (
        <ModalActionsAttendance
          closeModal={closeRow}
          attendance={activeRow}
          saveAttendance={saveAttendance}
        />
      )}
    </div>
  );
}

export { AttendanceTable };