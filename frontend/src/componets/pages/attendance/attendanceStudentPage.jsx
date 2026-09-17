import { useEffect, useState } from "react";
import { MyTemplate } from "../../templates/myTemplate";
import { BannerAttendances } from "../../organims/attendanceStudent/banner";
import { FiltersAttendancesSection } from "../../organims/attendanceStudent/filterAttendancesSection.jsx";
import { useParentAttendance } from "../../../hooks/hooksParent/useParentAttendance.js";
import { useSelectedStudent } from "../../../hooks/hooksParent/useSelectedStudent.js";

const LIMIT = 20;

function AttendanceStudentPage() {
  const { selectedStudent, selectedStudentData } = useSelectedStudent();

  const [status, setStatus] = useState(null);
  const [period, setPeriod] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [selectedStudent, status, period]);

  const { stats, counts, rows, total, loading, error } = useParentAttendance({
    idStudent: selectedStudent,
    status,
    period,
    page,
    limit: LIMIT,
  });

  return (
    <MyTemplate>
      <BannerAttendances selectedStudentData={selectedStudentData} stats={stats} />

      <FiltersAttendancesSection
        rows={rows}
        counts={counts}
        total={total}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        status={status}
        setStatus={setStatus}
        period={period}
        setPeriod={setPeriod}
        loading={loading}
      />

      {error && <p className="text-red-500 text-center">{error}</p>}
    </MyTemplate>
  );
}

export { AttendanceStudentPage };