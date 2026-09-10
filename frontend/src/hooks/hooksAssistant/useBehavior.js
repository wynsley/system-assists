import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useBehavior({
  page = 1, limit = 30, search, sortBy, sortOrder, grade, section, idPeriod,
  fetchRoster: shouldFetchRoster = true, fetchBehavior = false
} = {}) {
  const [rows, setRows] = useState([]);
  const [behavior, setBehavior] = useState(0);
  const [period, setPeriod] = useState(null);
  const [behaviorSummary, setBehaviorSummary] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);     // solo carga inicial
  const [isFetching, setIsFetching] = useState(false); // cualquier fetch, incluidos refetch
  const [error, setError] = useState(null);

  const fetchRoster = useCallback(async () => {
    if (!shouldFetchRoster) return;
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      if (grade) params.set("grade", grade);
      if (section) params.set("section", section);
      if (idPeriod) params.set("idPeriod", idPeriod);

      const { ok, data } = await apiFetch(`/behavior/roster?${params.toString()}`, "GET");

      if (!ok || !data?.success) {
        setError("Error al obtener el listado de comportamiento");
        return; // 👈 ya NO vacía rows/behavior/period — se quedan con el valor anterior
      }

      setRows(data.data ?? []);
      setBehavior(data.pagination?.behavior ?? 0);
      setPeriod(data.period ?? null);
      setMessage(data.message ?? null);
    } catch (error) {
      console.error("Error fetchRoster:", error);
      setError(error.message || "Error al obtener el listado de comportamiento");
    }
  }, [shouldFetchRoster, page, limit, search, sortBy, sortOrder, grade, section, idPeriod]);

  const fetchBehaviorSummary = useCallback(async () => {
    if (!fetchBehavior) return;
    const params = new URLSearchParams();
    if (grade) params.set("grade", grade);
    if (section) params.set("section", section);
    if (idPeriod != null) params.set("idPeriod", idPeriod);

    const { ok, data } = await apiFetch(`/behavior/sumary?${params.toString()}`, "GET");
    if (!ok || !data?.success) return; // 👈 tampoco vacía behaviorSummary en error
    setBehaviorSummary(data.data);
  }, [fetchBehavior, grade, section, idPeriod]);

  const refreshData = useCallback(async () => {
    setIsFetching(true);
    try {
      await Promise.all([fetchRoster(), fetchBehaviorSummary()]);
    } finally {
      setIsFetching(false);
    }
  }, [fetchRoster, fetchBehaviorSummary]);

  useEffect(() => {
    const load = async () => {
      setError(null);
      await refreshData();
      setLoading(false); // 👈 solo se apaga UNA vez, tras la primera carga
    };
    load();
  }, [refreshData]);

  const calificar = useCallback(async ({ idStudent, score, description = "" }) => {
    const body = { idStudent, score };
    if (description?.trim()) body.description = description.trim();

    const { ok, data } = await apiFetch("/behavior/calificar", "POST", body);
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al calificar comportamiento");

    await refreshData();
    return data.data;
  }, [refreshData]);

  const getConsolidado = useCallback(async ({ grade: g, section: s, search: q, idPeriod: p } = {}) => {
    const params = new URLSearchParams();
    if (g) params.set("grade", g);
    if (s) params.set("section", s);
    if (q) params.set("search", q);
    if (p) params.set("idPeriod", p);

    const { ok, data } = await apiFetch(`/behavior/consolidado?${params.toString()}`, "GET");
    if (!ok || !data?.success) throw new Error(data?.message || "Error al obtener el consolidado de comportamiento");

    return { students: data.data ?? [], period: data.period ?? null, message: data.message ?? null };
  }, []);

  return {
    rows, behavior, period, message, loading, isFetching, behaviorSummary, error,
    refetch: refreshData, calificar, getConsolidado,
  };
}

export { useBehavior };