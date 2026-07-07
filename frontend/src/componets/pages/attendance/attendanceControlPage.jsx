import { useState } from "react";
import { BannerAttendanceAssitant } from "../../organims/attendanceAssitant/banerAttendance";
import { MyTemplate } from "../../templates/myTemplate";
import { StatsCardControl } from "../../organims/attendanceAssitant/starsCard";
import { AttendanceTable } from "../../organims/attendanceAssitant/attendanceTable";
import { ModalScanResult } from "../../modals/assistant/ModalScanResult";
import { useAttendance } from "../../../hooks/hooksAssistant/useAttendance";
import { useModal } from "../../../hooks/hookModal/useModal";
import { useToast } from "../../../hooks/hookGlobals/useToast";

function AttendanceControlPage() {
  const [lastScannedDni, setLastScannedDni] = useState(null);

  const { showToast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  const {
    attendances,
    total,
    summaryToday,
    loading,
    createAttendance,
    updateAttendance,
    findStudentByDni,
  } = useAttendance({
    page: 1,
    limit: 20,
    date: today,
    fetchSummary: true,
  });

  // Stats para las 4 cards superiores
  const stats = summaryToday
    ? {
        total:   (summaryToday.present ?? 0) + (summaryToday.late ?? 0) + (summaryToday.justified ?? 0) + (summaryToday.absent ?? 0),
        present: summaryToday.present   ?? 0,
        late:    summaryToday.late      ?? 0,
        absent:  summaryToday.absent    ?? 0,
      }
    : { total: 0, present: 0, late: 0, absent: 0 };

    console.log("summaryToday:", summaryToday);
    console.log("attendances:", attendances);

  return (
    <MyTemplate>
      <BannerAttendanceAssitant 
        findStudentByDni={findStudentByDni}
        createAttendance={createAttendance}
      />

      <section className="w-[96%] max-w-7xl mx-auto">
        <StatsCardControl stats={stats} loading={loading} />

        <AttendanceTable
          attendances={attendances}
          lastScannedDni={lastScannedDni}
          updateAttendance={updateAttendance}
        />
      </section>

    </MyTemplate>
  );
}

export { AttendanceControlPage };