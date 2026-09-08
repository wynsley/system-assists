import { BannerDashboardAssistant } from "../../organims/dashdoardAssistant/bannerAssistant";
import { MyTemplate } from "../../templates/myTemplate";
import { CardStatsAssitant } from "../../organims/dashdoardAssistant/cardStatsAssitant";
import { MainDashboard } from "../../organims/dashdoardAssistant/mainDashboard";
import { useAttendance } from "../../../hooks/hooksAssistant/useAttendance";
import { useBehavior } from "../../../hooks/hooksAssistant/useBehavior";


function DashboardAssitantPage() {
  // DashboardAssistantPage.jsx
const {
  stats,
  rows: recentActivity,
  loading,
} = useAttendance({
  limit: 10,
  fetchSummary: true,   // trae resumen del día
});

const {behaviorSummary} = useBehavior({
  fetchBehavior :  true
})

  // Transforma { AD, A, B, C } al formato que espera BehaviorPorcentage
  const behaviorGradePorcentage = behaviorSummary ? [
    { name: "AD", description: "Logro Destacado", progress: behaviorSummary.AD ?? 0 },
    { name: "A",  description: "Logro Esperado",  progress: behaviorSummary.A  ?? 0 },
    { name: "B",  description: "En Proceso",      progress: behaviorSummary.B  ?? 0 },
    { name: "C",  description: "En Inicio",       progress: behaviorSummary.C  ?? 0 },
  ] : [];

  return (
    <MyTemplate>
      <BannerDashboardAssistant />

      <CardStatsAssitant
        stats={stats}
        loading={loading}
      />

      <MainDashboard
        loading={loading}
        recentActivity={recentActivity}
        behaviorGradePorcentage={behaviorGradePorcentage}
      />
    </MyTemplate>
  );
}

export { DashboardAssitantPage };