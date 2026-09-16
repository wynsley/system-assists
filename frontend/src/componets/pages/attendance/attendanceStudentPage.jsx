import { useEffect, useState } from "react";
import { MyTemplate } from "../../templates/myTemplate";
import { BannerAttendances } from "../../organims/attendanceStudent/banner";
import { FiltersAttendancesSection } from "../../organims/attendanceStudent/filterAttendancesSection.jsx";
import { useParentAttendance } from "../../../hooks/hooksParent/useParentAttendance.js";
import { useSelectedStudent } from "../../../context/selectStudentContext.jsx";

function AttendanceStudentPage() {
  const { selectedStudent, selectedStudentData, studentsOptions } = useSelectedStudent();

  const [status, setStatus] = useState(null);
  const [period, setPeriod] = useState(null);
  const [page, setPage] = useState(1);

  // resetea la paginación al cambiar de hijo
  useEffect(() => { setPage(1); }, [selectedStudent]);

  const { stats, counts, rows, total, loading, error } = useParentAttendance({
    idStudent: selectedStudent,
    status,
    period,
    page,
  });

  return (
    <MyTemplate>
      <BannerAttendances
        selectedStudentData={selectedStudentData}
        stats={stats}
      />

      <FiltersAttendancesSection
        counts={counts}
        status={status}
        setStatus={setStatus}
        period={period}
        setPeriod={setPeriod}
      />

      {/* tabla con rows / total / loading / error */}
    </MyTemplate>
  );
}

export { AttendanceStudentPage };