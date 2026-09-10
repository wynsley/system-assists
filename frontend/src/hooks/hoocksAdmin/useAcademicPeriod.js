import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useAcademicPeriod({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  year,
  fetchList = true,
} = {}) {
  const [periods, setPeriods] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Listado de bimestres (para la tabla en Admin) ────────────────────────
  const fetchPeriods = useCallback(async () => {
    if (!fetchList) return;
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (year) params.set("year", year);

    const { ok, data } = await apiFetch(`/academic-period?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      setError("Error al obtener los bimestres");
      setPeriods([]);
      setTotal(0);
      return;
    }

    setPeriods(data.data ?? []);
    setTotal(data.pagination?.total ?? data.data?.length ?? 0);
  }, [fetchList, page, limit, search, sortBy, sortOrder, year]);

  const refreshData = useCallback(async () => {
    await fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await refreshData();
      setLoading(false);
    };
    load();
  }, [refreshData]);

  // ── Crear bimestre ────────────────────────────────────────────────────
  const createPeriod = useCallback(async ({ year, bimester, startDate, endDate }) => {
    const body = { year, bimester, startDate, endDate };

    const { ok, data } = await apiFetch("/academic-period", "POST", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al crear el bimestre");

    await refreshData();
    return data.data;
  }, [refreshData]);

  // ── Editar bimestre ───────────────────────────────────────────────────
  const updatePeriod = useCallback(async (idPeriod, { year, bimester, startDate, endDate }) => {
    const body = {};
    if (year !== undefined) body.year = year;
    if (bimester !== undefined) body.bimester = bimester;
    if (startDate !== undefined) body.startDate = startDate;
    if (endDate !== undefined) body.endDate = endDate;

    const { ok, data } = await apiFetch(`/academic-period/${idPeriod}`, "PATCH", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar el bimestre");

    await refreshData();
    return data.data;
  }, [refreshData]);

  // ── Eliminar bimestre ─────────────────────────────────────────────────
  const deletePeriod = useCallback(async (idPeriod) => {
    const { ok, data } = await apiFetch(`/academic-period/${idPeriod}`, "DELETE");

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar el bimestre");

    await refreshData();
    return data.data;
  }, [refreshData]);

  // ── Bimestre activo según la fecha de hoy ────────────────────────────
  const fetchCurrentPeriod = useCallback(async () => {
    const { ok, data } = await apiFetch("/academic-period/current", "GET");

    if (!ok || !data?.success) {
      setCurrentPeriod(null);
      return null;
    }

    setCurrentPeriod(data.data);
    return data.data;
  }, []);

  return {
    periods,
    total,
    currentPeriod,
    loading,
    error,
    refetch: refreshData,
    createPeriod,
    updatePeriod,
    deletePeriod,
    fetchCurrentPeriod,
  };
}

export { useAcademicPeriod };