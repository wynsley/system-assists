import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useBehavior({
  page = 1,
  limit = 30,
  search,
  sortBy,
  sortOrder,
  grade,
  section,
  idPeriod,
  fetchBehavior = false
} = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [period, setPeriod] = useState(null);
  const [behaviorSummary, setBehaviorSummary] = useState(null);
  const [message, setMessage] = useState(null); // ej. "Aún no hay un bimestre activo configurado."
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Roster de comportamiento (nota + escala por estudiante) ─────────────
  const fetchRoster = useCallback(async () => {
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
        setRows([]);
        setTotal(0);
        setPeriod(null);
        setMessage(null);
        return;
      }

      setRows(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPeriod(data.period ?? null);
      setMessage(data.message ?? null);

    } catch (error) {
      console.error("Error fetchRoster:", err);
      setError(err.message || "Error al obtener el listado de comportamiento");
      setRows([]);
      setTotal(0);
    }
  }, [page, limit, search, sortBy, sortOrder, grade, section, idPeriod]);


  // ── Comportamiento AD/A/B/C ────────────────────────────────────────────
  const fetchBehaviorSummary = useCallback(async () => {
    if (!fetchBehavior) return;
    const params = new URLSearchParams();

    if (grade) params.set("grade", grade);
    if (section) params.set("section", section);
    if (idPeriod != null) params.set("idPeriod", idPeriod);

    const { ok, data } = await apiFetch(
      `/behavior/summary?${params.toString()}`,
      "GET"
    );
    if (!ok || !data?.success) {
      setBehaviorSummary(null);
      return;
    }
    setBehaviorSummary(data.data);
  }, [fetchBehavior, grade, section, idPeriod]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchRoster(),
      fetchBehaviorSummary(),
    ])

  }, [fetchRoster, fetchBehaviorSummary]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await refreshData();
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar comportamiento");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refreshData]);

  // ── Calificar comportamiento (nota manual del auxiliar) ─────────────────
  const calificar = useCallback(async ({ idStudent, score, description = "" }) => {
    const body = { idStudent, score };
    if (description?.trim()) body.description = description.trim();

    const { ok, data } = await apiFetch("/behavior/calificar", "POST", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al calificar comportamiento");

    await refreshData();
    return data.data;
  }, [refreshData]);

  // ── Consolidado (sin paginación: todo el roster, ej. para exportar/reportes) ──
  const getConsolidado = useCallback(async ({ grade: g, section: s, search: q, idPeriod: p } = {}) => {
    const params = new URLSearchParams();
    if (g) params.set("grade", g);
    if (s) params.set("section", s);
    if (q) params.set("search", q);
    if (p) params.set("idPeriod", p);

    const { ok, data } = await apiFetch(`/behavior/consolidado?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      throw new Error(data?.message || "Error al obtener el consolidado de comportamiento");
    }

    return {
      students: data.data ?? [],
      period: data.period ?? null,
      message: data.message ?? null,
    };
  }, []);

  return {
    rows,
    total,
    period,
    message,
    loading,
    behaviorSummary,
    error,
    refetch: refreshData,
    calificar,
    getConsolidado,
  };
}

export { useBehavior };