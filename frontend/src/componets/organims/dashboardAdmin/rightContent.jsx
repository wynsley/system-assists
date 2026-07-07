import { TitleIconLink } from "../../molecules/titleIconLink"
import { FaUsers } from "react-icons/fa6";
import { AttendanceByGrade } from "./attendanceByGrade";

const GRADE_LABELS = {
  1: "1er Grado",
  2: "2do Grado",
  3: "3er Grado",
  4: "4to Grado",
  5: "5to Grado",
};

const GRADE_COLORS = {
  present: '#00d26a',
  late: '#f5c211',
  absent: '#ff4040',
};

function RightContent({ loading = false, summaryByGrade = [] }) {
  const title = 'ASISTENCIA POR GRADO'

  // Transforma la respuesta del backend al formato que espera AttendanceByGrade
  const attendanceByGrade = summaryByGrade.map((grade) => ({
    text: GRADE_LABELS[grade.level] ?? `${grade.level}° Grado`,
    present: grade.present ?? 0,
    late: grade.late ?? 0,
    absent: grade.absent ?? 0,
    totalStudents: grade.total ?? 0,
    colors: GRADE_COLORS,
  }));

  return (
    <section className="flex flex-col border border-borderC p-5 rounded-md">
      <TitleIconLink
        title={title}
        icon={FaUsers}
        text='Ver Todo'
        href='/attendace-control'
        weight='bold'
        siseSmall='xlarge'
      />

      {loading ? (
        <p className="text-gray-400 text-sm py-4">Cargando asistencia...</p>
      ) : attendanceByGrade.length === 0 ? (
        <p className="text-gray-400 text-sm py-4">Sin registros de asistencia hoy.</p>
      ) : (
        <AttendanceByGrade attendanceByGrade={attendanceByGrade} />
      )}
    </section>
  );
}

export { RightContent }