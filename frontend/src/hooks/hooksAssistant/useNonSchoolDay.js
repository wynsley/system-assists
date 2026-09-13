import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useNonSchoolDays({ page = 1, limit = 10, year, sortBy, sortOrder } = {}) {
  const [nonSchoolDays, setNonSchoolDays] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNonSchoolDays = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (year) params.set("year", year);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const { ok, data } = await apiFetch(`/non-school-day?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setNonSchoolDays([]);
      setTotal(0);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    if (!ok || !data.success) {
      setError(data.message || "Error al obtener los días no lectivos");
      setNonSchoolDays([]);
      setTotal(0);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    setNonSchoolDays(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    setTotalPages(data.pagination?.totalPages ?? 0);
    setLoading(false);
  }, [page, limit, year, sortBy, sortOrder]);

  useEffect(() => {
    fetchNonSchoolDays();
  }, [fetchNonSchoolDays]);

  // ── Crear (fecha individual o rango: startDate === endDate para un solo día) ──
  const createNonSchoolDay = useCallback(async ({ startDate, endDate, reason }) => {
    const { ok, data } = await apiFetch("/non-school-day", "POST", {
      startDate,
      endDate: endDate ?? startDate,
      reason,
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) {
      throw new Error(data.errors?.[0]?.message || data.message || "Error al registrar el día no lectivo");
    }

    await fetchNonSchoolDays();
    return data.data;
  }, [fetchNonSchoolDays]);

  // ── Actualizar ──
  const updateNonSchoolDay = useCallback(async (idNonSchoolDay, payload) => {
    const { ok, data } = await apiFetch(`/non-school-day/${idNonSchoolDay}`, "PATCH", payload);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) {
      throw new Error(data.errors?.[0]?.message || data.message || "Error al actualizar el día no lectivo");
    }

    await fetchNonSchoolDays();
    return data.data;
  }, [fetchNonSchoolDays]);

  // ── Eliminar ──
  const deleteNonSchoolDay = useCallback(async (idNonSchoolDay) => {
    const { ok, data } = await apiFetch(`/non-school-day/${idNonSchoolDay}`, "DELETE");

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) {
      throw new Error(data.message || "Error al eliminar el día no lectivo");
    }

    await fetchNonSchoolDays();
    return data.data;
  }, [fetchNonSchoolDays]);

  return {
    nonSchoolDays,
    total,
    totalPages,
    loading,
    error,
    refetch: fetchNonSchoolDays,
    createNonSchoolDay,
    updateNonSchoolDay,
    deleteNonSchoolDay,
  };
}

export { useNonSchoolDays };