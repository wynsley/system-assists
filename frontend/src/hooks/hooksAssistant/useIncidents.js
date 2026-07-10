import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useIncidents({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  autoFetch = true,
} = {}) {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lista de incidentes ────────────────────────────────────────────────────
  const fetchIncidents = useCallback(async () => {
    if (!autoFetch) return;

    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    params.set("sortOrder", sortOrder ?? "desc");
    if (search)  params.set("search", search);
    if (sortBy)  params.set("sortBy", sortBy);

    const { ok, data } = await apiFetch(
      `/incident?${params.toString()}`,
      "GET"
    );

    if (!ok || !data?.success) {
      setIncidents([]);
      setTotal(0);
      setError(data?.message || "Error al obtener incidentes");
      return;
    }

    setIncidents(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
  }, [page, limit, search, sortBy, sortOrder, autoFetch]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchIncidents();
      setLoading(false);
    };
    load();
  }, [fetchIncidents]);

  // ── Crear incidente (POST /incident) ──────────────────────────────────────
  const createIncident = useCallback(async ({
    idStudent,
    idIncidentCatalog,
    idAuxiliar,
    note = "",
  }) => {
    const { ok, data } = await apiFetch("/incident", "POST", {
      idStudent,
      idIncidentCatalog,
      idAuxiliar,
      note,
      date: new Date().toISOString(),
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al registrar incidente");

    await fetchIncidents();
    return data.incident;
  }, [fetchIncidents]);

  // ── Actualizar incidente (PATCH /incident/:id) ────────────────────────────
  const updateIncident = useCallback(async (idIncident, updateData) => {
    const { ok, data } = await apiFetch(
      `/incident/${idIncident}`,
      "PATCH",
      updateData
    );

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar incidente");

    await fetchIncidents();
    return data.incident;
  }, [fetchIncidents]);

  // ── Eliminar incidente (DELETE /incident/:id) ─────────────────────────────
  const deleteIncident = useCallback(async (idIncident) => {
    const { ok, data } = await apiFetch(`/incident/${idIncident}`, "DELETE");

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar incidente");

    await fetchIncidents();
    return data.incident;
  }, [fetchIncidents]);

  return {
    incidents,
    total,
    loading,
    error,
    refetch: fetchIncidents,
    createIncident,
    updateIncident,
    deleteIncident,
  };
}

export { useIncidents };