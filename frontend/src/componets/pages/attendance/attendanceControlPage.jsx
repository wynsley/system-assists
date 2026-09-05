import { useState } from "react";
import { BannerAttendanceAssitant } from "../../organims/attendanceAssitant/banerAttendance";
import { MyTemplate } from "../../templates/myTemplate";
import { StatsCardControl } from "../../organims/attendanceAssitant/starsCard";
import { AttendanceTable } from "../../organims/attendanceAssitant/attendanceTable";
import { useAttendance } from "../../../hooks/hooksAssistant/useAttendance";

function AttendanceControlPage() {
  const [lastScannedDni, setLastScannedDni] = useState(null);

  const {
    rows,
    stats,
    loading,
    error,
    createAttendance,
    saveAttendance,
    findStudentByDni,
  } = useAttendance();

  console.log("STATS: ", stats)
  return (
    <MyTemplate>
      <BannerAttendanceAssitant
        findStudentByDni={findStudentByDni}
        createAttendance={createAttendance}
        onScanSuccess={(dni) => setLastScannedDni(dni)}
      />

      <section className="w-[96%] max-w-7xl mx-auto">
        <StatsCardControl
          stats={stats}
          loading={loading}
        />

        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}

        <AttendanceTable
          rows={rows}
          lastScannedDni={lastScannedDni}
          saveAttendance={saveAttendance}
        />
      </section>
    </MyTemplate>
  );
}

export { AttendanceControlPage };