import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useParentSummary() {
  const [studentsSummary, setStudentsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { ok, data } = await apiFetch("/attendance/summary/parent", "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
      return;
    }

    if (!ok || !data.success) {
      setError(data.errors?.[0]?.message || data.message || "Error al obtener el resumen");
      setLoading(false);
      return;
    }

    setStudentsSummary(data.data?.studentsSummary ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { studentsSummary, loading, error, refetch: fetchSummary };
}

export { useParentSummary };