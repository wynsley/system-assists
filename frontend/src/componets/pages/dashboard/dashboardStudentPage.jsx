import { MyTemplate } from "../../templates/myTemplate";
import { Banner } from "../../organims/dashboardStudent/banner";
import { CardStats } from "../../organims/dashboardStudent/cardStats";
import { Overview } from "../../organims/dashboardStudent/homeOverview";
import { useSelectedStudent } from "../../../context/selectStudentContext";
import { useParentAttendance } from "../../../hooks/hooksParent/useParentAttendance";
import { useParentBehavior } from "../../../hooks/hooksParent/useParentBehavior";

function DashboardStudentPage() {
  const {
    studentsOptions,
    selectedStudent,
    setSelectedStudent,
    selectedStudentData: selected,
    loadingStudents,
  } = useSelectedStudent();

  const { 
    stats: attendanceStats, 
    loading: loadingAttendance 
  } = useParentAttendance({
    idStudent: selectedStudent,
    limit: 1,
  });

  const { 
    current: behaviorCurrent, 
    loading: loadingBehavior 
  } = useParentBehavior({
    idStudent: selectedStudent,
    limit: 1,
  });

  const stats = [
    { label: "Asistió el día de hoy", attended: selected?.attendanceToday !== "FALTA" },
    { label: "Tardanzas", value: String(selected?.totalDelaysYear ?? 0) },
    { label: "Comportamiento", value: behaviorCurrent.scale ?? "-" },
    {
      label: "Días presentes",
      value: `${attendanceStats.attendances ?? 0}/${attendanceStats.schoolDaysRegistered ?? 0}`,
    },
  ];

  const averageAttendances = [
    { 
      name: "PROMEDIO SEMANAL", 
      description: "Asistencia de la semana", 
      progress: selected?.averageAttendanceWeek ?? 0 
    },
    { 
      name: "PROMEDIO BIMESTRAL", 
      description: "Asistencia del bimestre", 
      progress: selected?.averageAttendanceBimester ?? 0 
    },
    { 
      name: "PROMEDIO ANUAL", 
      description: "Asistencia del año", 
      progress: selected?.averageAttendanceYear ?? 0 
    },
    { 
      name: "COMPORTAMIENTO", 
      description: "Nivel de conducta", 
      progress: behaviorCurrent.percentage ?? 0 
    },
  ];

  const isLoading = loadingStudents || loadingAttendance || loadingBehavior;

  return (
    <MyTemplate>
      <Banner
        studentsOptions={studentsOptions}
        selectedStudent={selected}
        setSelectedStudent={setSelectedStudent}
      />

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <CardStats stats={stats} />
          <Overview averageAttendances={averageAttendances} />
        </>
      )}
    </MyTemplate>
  );
}

export { DashboardStudentPage };