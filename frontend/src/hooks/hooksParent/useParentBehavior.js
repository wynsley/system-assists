import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useParentBehavior({ idStudent, period, page = 1, limit = 20 } = {}) {
  const [current, setCurrent] = useState({ score: 0, scale: "C", percentage: 0, period: null });
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!idStudent) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("idStudent", idStudent);
    params.set("page", page);
    params.set("limit", limit);
    if (period) params.set("period", period);

    const { ok, data } = await apiFetch(`/behavior/parent-summary?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
      return;
    }

    if (!ok || !data.success) {
      setError(data.errors?.[0]?.message || data.message || "Error al obtener el comportamiento");
      setLoading(false);
      return;
    }

    setCurrent(data.current ?? { score: 0, scale: "C", percentage: 0, period: null });
    setHistory(data.history ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [idStudent, period, page, limit]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    current,
    history,
    total,
    loading,
    error,
    refetch: fetchSummary,
  };
}

export { useParentBehavior };