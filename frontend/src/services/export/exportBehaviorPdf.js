import { exportPdf } from "../../utils/exports/exportPdf";

export function exportBehaviorPdf(
  students,
  grade = "",
  section = ""
) {
  let title = 'Consolidado de Comportaminetos del Día'
  if (grade && section) {
    title += ` - ${grade} "${section}"`;
  }
  else if (grade) {
    title += ` - ${grade}`;
  }
  else if (section) {
    title += ` - Sección ${section}`;
  }

  exportPdf({

    title,
    fileName: 'CONSOLIDADO_COMPORTAMIENTO',
    headers: [
      "Estudiante",
      "Grado",
      "Sección",
      "Nota",
      "Escala",
    ],

    body: students.map((student) => [
      `${student.student.firstname ?? ""} ${student.student.lastname ?? ""}`.trim() || "—",
      student.grade ? `${student.grade}°` : "—",
      student.section ?? "—",
      student.score ?? "—",
      student.scale ?? "—",
    ]),

    totalRecords: students.length,

    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
    },

    didParseCell(data) {

      if (
        data.section === "body" &&
        data.column.index === 4
      ) {

        const estado = data.cell.raw;

        if (estado === "present") {

          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = "bold";
        }

        if (estado === "late") {

          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = "bold";
        }

        if (estado === "absent") {

          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      }
    }

  });
}