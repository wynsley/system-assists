import { useState, useEffect } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useAuxiliarDashboard() {
  const [summaryToday, setSummaryToday] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [behaviorSummary, setBehaviorSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const [resActivity, resBehavior] = await Promise.all([
        // Trae las asistencias de hoy para el auxiliar
        apiFetch("/attendance?limit=10&sortOrder=desc", "GET"),
        apiFetch("/attendance/summary/behavior", "GET"),
      ]);

      if (resActivity.ok && resActivity.data?.success) {
        const attendances = resActivity.data.data ?? [];

        // Calcula el resumen desde la lista de actividades
        const present = attendances.filter(a => a.status === "PRESENTE").length;
        const late = attendances.filter(a => a.status === "TARDANZA").length;
        const justified = attendances.filter(a => a.status === "JUSTIFICADA").length;
        const total = attendances.length;
        const absent = total - present - late - justified;

        setSummaryToday({ total, present, late, justified, absent });
        setRecentActivity(attendances);
      }

      if (resBehavior.ok && resBehavior.data?.success) {
        setBehaviorSummary(resBehavior.data.data);
      }

      setLoading(false);
    };

    fetch();
  }, []);

  return {
    summaryToday,
    recentActivity,
    behaviorSummary,
    loading,
    error,
  };
}

export { useAuxiliarDashboard };