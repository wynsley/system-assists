import { useState, useEffect } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useParentDashboard() {
  const [studentsSummary, setStudentsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const { ok, data } = await apiFetch("/attendance/summary/parent", "GET");

      if (!ok || !data?.success) {
        setError(data?.message || "Error al cargar resumen");
        setLoading(false);
        return;
      }

      setStudentsSummary(data.data?.studentsSummary ?? []);
      setLoading(false);
    };

    fetch();
  }, []);

  return { studentsSummary, loading, error };
}

export { useParentDashboard };