import { BannerDhasboardAdmin } from "../../organims/dashboardAdmin/bannerDashboardAdmin";
import { MainContentAdmin } from "../../organims/dashboardAdmin/mainContentAdmin";
import { CardsStatsAdmin } from "../../organims/dashboardAdmin/statsDashboardAdmin";
import { MyTemplate } from "../../templates/myTemplate";
import { useStudents } from "../../../hooks/hoocksAdmin/useStudents";
import { useAdminDashboard } from "../../../hooks/hoocksAdmin/useAdminDashboard";



function DashboardAdminPage() {
  const { total: totalStudents, loading: loadingStudents } = useStudents({
    page: 1,
    limit: 1,
    status: "ACTIVO",
  });

  const {
    summaryToday,
    summaryByGrade,
    attendanceRate,
    loading: loadingDashboard,
  } = useAdminDashboard();

  const loading = loadingStudents || loadingDashboard;

  return (
    <MyTemplate>
      <BannerDhasboardAdmin />

      <CardsStatsAdmin
        loading={loading}
        totalStudents={totalStudents}
        presentStudents={summaryToday?.present ?? 0}   
        lateStudents={summaryToday?.late ?? 0}          
        averageAttendance={attendanceRate}              
      />

      <MainContentAdmin
        loading={loading}
        summaryByGrade={summaryByGrade}
      />
    </MyTemplate>
  );
}

export { DashboardAdminPage }