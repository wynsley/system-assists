import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { API_LIMITS } from "../../config/apiLimits";

function useGrades({ page = 1, limit = API_LIMITS.grade } = {}) {
  const [grades, setGrades] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    //Limite
    const safeLimit = Math.min(limit, API_LIMITS.grade);

    params.set("page", page);
    params.set("limit", safeLimit);

    const { ok, data } = await apiFetch(
      `/grade?${params.toString()}`,
      "GET"
    );

    if (!data || !ok || !data.success) {
      setError(data?.message || "Error al obtener grados");
      setGrades([]);
      setLoading(false);
      return;
    }

    setGrades(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    setLoading(false);
  }, [page, limit]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const deleteGrade = useCallback(async (id) => {
    const { ok, data } = await apiFetch(`/grade/${id}`, "DELETE");

    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo eliminar el grado");
    }

    await fetchGrades();
    return data;
  }, [fetchGrades]);

  return {
    grades,
    total,
    loading,
    error,
    refetch: fetchGrades,
    deleteGrade,
  };
}

export { useGrades };