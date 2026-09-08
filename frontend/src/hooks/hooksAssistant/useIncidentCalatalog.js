import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useIncidentCatalog({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  forSelect = false, // true: trae todo el catálogo (sin paginación) para poblar el <select>
} = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Listado (admin: tabla paginada, o front: catálogo completo para el select) ──
  const fetchCatalog = useCallback(async () => {
    const params = new URLSearchParams();
    if (forSelect) {
      params.set("limit", 100);
      params.set("page", 1);
    } else {
      params.set("limit", limit);
      params.set("page", page);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
    }

    const { ok, data } = await apiFetch(`/incident-catalog?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      setError("Error al obtener el catálogo de incidentes");
      setRows([]);
      setTotal(0);
      return;
    }

    setRows(data.data ?? []);
    setTotal(data.pagination?.total ?? data.data?.length ?? 0);
  }, [page, limit, search, sortBy, sortOrder, forSelect]);

  const refreshData = useCallback(async () => {
    await fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await refreshData();
      setLoading(false);
    };
    load();
  }, [refreshData]);

  // ── Crear tipo de incidente (ADMIN) ─────────────────────────────────────
  const createIncidentCatalog = useCallback(async ({ name, description, type, points }) => {
    const { ok, data } = await apiFetch("/incident-catalog", "POST", {
      name,
      description,
      type,
      points,
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al crear el tipo de incidente");

    await refreshData();
    return data.incidentCatalog;
  }, [refreshData]);

  // ── Actualizar tipo de incidente (ADMIN) ───────────────────────────────
  const updateIncidentCatalog = useCallback(async (idIncidentCatalog, changes) => {
    const body = {};
    for (const key of ["name", "description", "type", "points"]) {
      if (changes[key] !== undefined) body[key] = changes[key];
    }

    const { ok, data } = await apiFetch(`/incident-catalog/${idIncidentCatalog}`, "PATCH", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar el tipo de incidente");

    await refreshData();
    return data.incidentCatalog;
  }, [refreshData]);

  // ── Eliminar tipo de incidente (ADMIN) ─────────────────────────────────
  const deleteIncidentCatalog = useCallback(async (idIncidentCatalog) => {
    const { ok, data } = await apiFetch(`/incident-catalog/${idIncidentCatalog}`, "DELETE");

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar el tipo de incidente");

    await refreshData();
    return data.incidentCatalog;
  }, [refreshData]);

  // ── Catálogo agrupado por tipo, listo para <optgroup> en el select ──────
  const grouped = {
    POSITIVO: rows.filter((r) => r.type === "POSITIVO"),
    NEGATIVO: rows.filter((r) => r.type === "NEGATIVO"),
  };

  return {
    rows,
    grouped,
    total,
    loading,
    error,
    refetch: refreshData,
    createIncidentCatalog,
    updateIncidentCatalog,
    deleteIncidentCatalog,
  };
}

export { useIncidentCatalog };