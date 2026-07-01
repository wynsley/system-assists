import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { API_LIMITS } from "../../config/apiLimits";

function useClassrooms({ page = 1, limit = API_LIMITS.classroom, search } = {}) {
  const [classrooms, setClassrooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      //  límite 
      const safeLimit = Math.min(limit, API_LIMITS.classroom);

      params.set("page", page);
      params.set("limit", safeLimit);

      if (search) params.set("search", search);

      const { ok, data } = await apiFetch(
        `/classroom?${params.toString()}`,
        "GET"
      );

      if (!data || !ok || !data.success) {
        setError(data?.message || "Error al obtener aulas");
        setClassrooms([]);
        return;
      }

      setClassrooms(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch (err) {
      setError(err.message || "Error inesperado");
      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const deleteClassroom = useCallback(async (id) => {
    const { ok, data } = await apiFetch(`/classroom/${id}`, "DELETE");

    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo eliminar el aula");
    }

    await fetchClassrooms();
    return data;
  }, [fetchClassrooms]);

  return {
    classrooms,
    total,
    loading,
    error,
    refetch: fetchClassrooms,
    deleteClassroom,
  };
}

export { useClassrooms };