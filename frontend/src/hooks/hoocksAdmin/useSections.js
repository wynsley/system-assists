import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { API_LIMITS } from "../../config/apiLimits";

function useSections({ page = 1, limit = API_LIMITS.section, idGrade } = {}) {
  const [sections, setSections] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    // límite 
    const safeLimit = Math.min(limit, API_LIMITS.section);

    params.set("page", page);
    params.set("limit", safeLimit);
    params.set("sortBy", "name");   //Orden Alfabetico
    params.set("sortOrder", "asc"); //A - Z

    if (idGrade) params.set("idGrade", idGrade);

    const { ok, data } = await apiFetch(
      `/section?${params.toString()}`,
      "GET"
    );

    if (!data || !ok || !data.success) {
      setError(data?.message || "Error al obtener secciones");
      setSections([]);
      setLoading(false);
      return;
    }

    setSections(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    setLoading(false);
  }, [page, limit, idGrade]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const deleteSection = useCallback(async (id) => {
    const { ok, data } = await apiFetch(`/section/${id}`, "DELETE");

    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo eliminar la sección");
    }

    await fetchSections();
    return data;
  }, [fetchSections]);

  return {
    sections,
    total,
    loading,
    error,
    refetch: fetchSections,
    deleteSection,
  };
}

export { useSections };