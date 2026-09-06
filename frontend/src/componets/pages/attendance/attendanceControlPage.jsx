import { useState } from "react";
import { BannerAttendanceAssitant } from "../../organims/attendanceAssitant/banerAttendance";
import { MyTemplate } from "../../templates/myTemplate";
import { StatsCardControl } from "../../organims/attendanceAssitant/starsCard";
import { AttendanceTable } from "../../organims/attendanceAssitant/attendanceTable";
import { useAttendance } from "../../../hooks/hooksAssistant/useAttendance";
import { getLocalDateString } from "../../../utils/date";


function AttendanceControlPage() {
  const [lastScannedDni, setLastScannedDni] = useState(null);
  const [date, setDate] = useState(getLocalDateString());

  const today = getLocalDateString();
  const isToday = date === today;

  const {
    rows,
    stats,
    loading,
    error,
    createAttendance,
    saveAttendance,
    findStudentByDni,
  } = useAttendance({ date });

  return (
    <MyTemplate>
      <BannerAttendanceAssitant
        findStudentByDni={findStudentByDni}
        createAttendance={createAttendance}
        onScanSuccess={(dni) => setLastScannedDni(dni)}
        disabled={!isToday}   
      />

      <section className="w-[96%] max-w-7xl mx-auto">
        <StatsCardControl stats={stats} loading={loading} />

        {error && <span className="text-sm text-red-600">{error}</span>}

        <AttendanceTable
          rows={rows}
          date={date}
          setDate={setDate}
          isToday={isToday}   
          lastScannedDni={lastScannedDni}
          saveAttendance={saveAttendance}
          getLocalDateString ={getLocalDateString}
        />
      </section>
    </MyTemplate>
  );
}

export { AttendanceControlPage };