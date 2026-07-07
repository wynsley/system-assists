import { useState, useEffect } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useAdminDashboard() {
  const [summaryToday, setSummaryToday] = useState(null);
  const [summaryByGrade, setSummaryByGrade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const [resToday, resGrade] = await Promise.all([
        apiFetch("/attendance/summary/today", "GET"),
        apiFetch("/attendance/summary/grade", "GET"),
      ]);

      if (!resToday.ok || !resToday.data?.success) {
        setError(resToday.data?.message || "Error al cargar resumen de hoy");
        setLoading(false);
        return;
      }

      setSummaryToday(resToday.data.data);
      setSummaryByGrade(resGrade.data?.data ?? []);
      setLoading(false);
    };

    fetch();
  }, []);

  // Calcula el % de asistencia promedio
  const attendanceRate = summaryToday
    ? Math.round(
        ((summaryToday.present ?? 0) /
          Math.max(
            (summaryToday.present ?? 0) +
            (summaryToday.late ?? 0) +
            (summaryToday.justified ?? 0) +
            (summaryToday.absent ?? 0),
            1
          )) * 100
      )
    : 0;

  return {
    summaryToday,
    summaryByGrade,
    attendanceRate,
    loading,
    error,
  };
}

export { useAdminDashboard };