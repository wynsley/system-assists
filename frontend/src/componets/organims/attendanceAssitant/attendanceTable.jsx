import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Table } from "../tableReusable";
import { FiltersSearchDownload } from "./filtersSerchDowldAttendance";
import { ModalActionsAttendance } from "../../modals/assistant/modalActionsAttendace";
import { statusBadge } from "../../../config/assistant/attendanceBadges";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";

function AttendanceTable({ attendances = [], lastScannedDni, updateAttendance }) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");

  const { openRowId, openRow, closeRow } = useRowToggle();

  // Filtra en el frontend por nombre, DNI, grado o sección
  const filtered = attendances.filter((a) => {
    const term = search.toLowerCase();
    const matchSearch = !search
      || a.student?.fullname?.toLowerCase().includes(term)
      || a.student?.dni?.includes(term);
    const matchGrade = !grade || String(a.student?.classroom?.grade) === grade;
    const matchSection = !section || a.student?.classroom?.section === section;
    return matchSearch && matchGrade && matchSection;
  });

  const handleEdit = (attendance) => {
    openRow(attendance.idAttendance);
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
        students={attendances} // para poblar los selects de grado/sección
        filtered={filtered}
      />

      <Table
        headers={headers}
        data={filtered}
        emptyMessage="No se encontraron registros de asistencia"
        renderRow={(attendance) => {
          const badge = statusBadge[attendance.status] ?? statusBadge.absent;
          const Icon = badge.icon;
          const isActive = openRowId === attendance.idAttendance;

          // ¿Es el último escaneado?
          const isJustScanned = lastScannedDni === attendance.student?.dni;

          // Hora formateada
          const time = attendance.date
            ? new Date(attendance.date).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <tr
              key={attendance.idAttendance}
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
                  {attendance.student?.fullname ?? "—"}
                </div>
              </td>
              <td className="px-6 py-4">{attendance.student?.dni ?? "—"}</td>
              <td className="px-6 py-4">
                {attendance.student?.classroom?.grade
                  ? `${attendance.student.classroom.grade}°`
                  : "—"}
              </td>
              <td className="px-6 py-4">
                {attendance.student?.classroom?.section ?? "—"}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${badge.className}`}>
                  <Icon size={14} />
                  {badge.label}
                </span>
              </td>
              <td className="px-6 py-4">{time ?? "—"}</td>
              <td className="px-6 py-4 relative">
                <button
                  onClick={() => handleEdit(attendance)}
                  className="text-blue-700 hover:underline"
                >
                  <FaEdit size={20} />
                </button>
                {isActive && (
                  <ModalActionsAttendance
                    closeModal={closeRow}
                    attendance={attendance}
                    updateAttendance={updateAttendance}
                  />
                )}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}

export { AttendanceTable };