import { exportExcel } from "../../utils/exports/exportExcel";

export async function exportAttendanceExcel(attendances = []) {
  // Mapeamos un objeto de diccionario para traducir los estados visualmente en las celdas del Excel
  const statusTranslations = {
    present: "Presente",
    late: "Tarde",
    absent: "Falta",
    justified: "Justificado"
  };

  await exportExcel({
    title: "Consolidado de Asistencias del Día",
    fileName: "Consolidado_Asistencia",

    // Encabezados de la tabla a exportar
    headers: [
      "Estudiante",
      "DNI",
      "Grado",
      "Sección",
      "Estado",
      "Hora",
    ],

    columnsWidth: [35, 15, 12, 12, 15, 15],

    // CORRECCIÓN 1: Mapeo correcto extrayendo los datos desde la estructura de asistencia
    data: attendances.map((item) => {

      return [
        item.fullname ?? "—",
        item.dni ?? "—",
        item.grade ? `${item.grade}°` : "—",
        item.section ?? "—",
        statusTranslations[item.status] ?? item.status ?? "—",
        item.time ?? "—",
      ];

    }),

    getCellStyle: ({ item, colNumber }) => {
      if (colNumber === 5) {
        const estadoTexto = item?.[4];

        if (estadoTexto === "Presente") {
          return {
            font: {
              color: { argb: "FF008000" },
              bold: true,
            },
          };
        }

        if (estadoTexto === "Tarde") {
          return {
            font: {
              color: { argb: "FFD97706" },
              bold: true,
            },
          };
        }

        if (estadoTexto === "Falta") {
          return {
            font: {
              color: { argb: "FFDC2626" },
              bold: true,
            },
          };
        }

        if (estadoTexto === "Justificado") {
          return {
            font: {
              color: { argb: "FF2563EB" },
              bold: true,
            },
          };
        }
      }
    },
  });
}