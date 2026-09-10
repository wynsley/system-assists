import { exportExcel } from "../../utils/exports/exportExcel";

export async function exportBehaviorExcel(students) {
  await exportExcel({
    title: 'Consolidado de Comportamientos del Día',
    fileName: 'Consolidado_Comportamientos',

    //Encabezados de la tabla a exportar
    headers: [
      "Estudiante",
      "Grado",
      "Sección",
      "Nota",
      "Escala",
    ],

    //Datos del estudiante a exportar

    columnsWidth: [40, 20, 12, 12, 12],

    data: students.map((student) => [
      `${student.student.firstname ?? ""} ${student.student.lastname ?? ""}`.trim() || "—",
      student.grade ? `${student.grade}°` : "—",
      student.section ?? "—",
      student.score ?? "—",
      student.scale ?? "—",
    ])
  })

  
}