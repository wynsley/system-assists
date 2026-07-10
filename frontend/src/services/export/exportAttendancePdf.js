import { exportPdf } from "../../utils/exports/exportPdf";

export function exportAttendancePdf(
  attendances = [],
  grade = "",
  section = ""
) {

  let title = "Consolidado de Asistencias del Día";

  if (grade && section) {
    title += ` - ${grade}° "${section}"`;
  }
  else if (grade) {
    title += ` - ${grade}°`;
  }
  else if (section) {
    title += ` - Sección ${section}`;
  }

  exportPdf({
    title,
    fileName: "Consolidado_Asistencia",

    headers: [
      "Estudiante",
      "DNI",
      "Grado",
      "Sección",
      "Estado",
      "Hora",
    ],

    //  Mapeo extrayendo los datos desde la asistencia (item)
    body: attendances.map(item => {

      return [
        item.fullname ?? "—",
        item.dni ?? "—",
        item.grade ? `${item.grade}°` : "—",
        item.section ?? "—",
        item.status ?? "—",
        item.time ?? "—"
      ];

    }),

    totalRecords: attendances.length,

    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
    },

    didParseCell(data) {
      if (
        data.section === "body" &&
        data.column.index === 4
      ) {
        const estado = data.cell.raw; // Esto captura lo que pusimos en item.status

        if (estado === "present") {
          data.cell.styles.textColor = [34, 197, 94]; // Verde
          data.cell.styles.fontStyle = "bold";
          data.cell.text = "Presente"; // (Opcional) Traduce el texto visual en el PDF
        }

        if (estado === "late") {
          data.cell.styles.textColor = [217, 119, 6]; // Ámbar
          data.cell.styles.fontStyle = "bold";
          data.cell.text = "Tarde"; // (Opcional) Traduce el texto visual en el PDF
        }

        if (estado === "absent") {
          data.cell.styles.textColor = [220, 38, 38]; // Rojo
          data.cell.styles.fontStyle = "bold";
          data.cell.text = "Falta"; // (Opcional) Traduce el texto visual en el PDF
        }

        if (estado === "justified") {
          data.cell.styles.textColor = [59, 130, 246]; // Azul por si manejas justificados
          data.cell.styles.fontStyle = "bold";
          data.cell.text = "Justificado";
        }
      }
    }
  });
}