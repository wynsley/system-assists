import { CardRecentNotifications } from "../../molecules/dashboardStudent/cardLeftRecentNotis";
import { AttendanceClassCard } from "./attendanceCardLeft";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { TitleIconLink } from "../../molecules/titleIconLink";
import { useSelectedStudent } from "../../../hooks/hooksParent/useSelectedStudent";
import { useParentAttendance } from "../../../hooks/hooksParent/useParentAttendance";
import { ATTENDANCE_WEEK_PARENT } from "../../../utils/attendenceWeekParent";

function LeftOverview() {
  const title = 'MIS NOTIFICACIONES RECIENTES'
  const title2 = 'ASISTENCIAS DE ESTA SEMANA'

  const RecentNotifications = [
    {
      title: 'TARDANZA REGISTRADA',
      status: 'TARDANZA',
      message: 'El estudiante Wynsley llego tarde a clases',
      dateTime: '12 de mayo de 2026 09:30 AM'
    },
    {
      title: 'FALTA REGISTRADA',
      status: 'FALTÓ',
      message: 'El estudiante Wynsley no llego a la institución',
      dateTime: '12 de mayo de 2026 09:30 AM'
    },
    {
      title: 'COMPORTAMIENTO INDEBIDO',
      status: 'COMPORTAMIENTO',
      message: 'El estudiante Wynsley falto el respeto',
      dateTime: '12 de mayo de 2026 09:30 AM'
    },
  ]

  const { selectedStudent } = useSelectedStudent();

  const { rows, loading } = useParentAttendance({
    idStudent: selectedStudent,
    period: "WEEK",
    limit: 7,
  });

  const AttendancesClasses = rows.map((row) => {
    const dateObj = new Date(row.date);
    const config = ATTENDANCE_WEEK_PARENT[row.status] ?? ATTENDANCE_WEEK_PARENT.FALTA;

    return {
      day: dateObj.toLocaleDateString("es-PE", { weekday: "short" }), // "vie."
      date: dateObj.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), // "11 may."
      hour: row.time ?? "—",
      icon: config.icon,
      stats: config.label,
    };
  });

  return (
    <section className="flex flex-col gap-6 font-poppins">

      {/*NOTIFICAIONES RECIENTES*/}
      <div className="flex flex-col gap-2 bg-white rounded-md border border-borderC p-6 shadow-sm">
        <TitleIconLink
          title={title}
          icon={IoNotificationsSharp}
          text={'Ver Todo'}
          href='/notifications-student'
        />
        <CardRecentNotifications
          RecentNotifications={RecentNotifications}
        />
      </div>
      <div className="bg-white rounded-md border border-borderC p-6 shadow-sm">
        <TitleIconLink
          title={title2}
          icon={MdDateRange}
          text={'Ver Todo'}
          href='/attendance-student'
        />
        {loading ? (
          <p className="text-sm text-gray-400 py-4">Cargando asistencias...</p>
        ) : AttendancesClasses.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Sin registros esta semana.</p>
        ) : (
          <AttendanceClassCard
            AttendancesClasses={AttendancesClasses}
          />
        )}
      </div>
    </section>
  )
}

export { LeftOverview }