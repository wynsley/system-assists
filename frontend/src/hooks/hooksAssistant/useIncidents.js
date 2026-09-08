import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useIncident({
  page = 1,
  limit = 30,
  search,
  sortBy,
  sortOrder,
  incidentCatalog, // filtro por idIncidentCatalog puntual, si se necesita
  startDate,       // "YYYY-MM-DD"
  endDate,         // "YYYY-MM-DD"
} = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Historial de incidentes (con filtro de fecha) ────────────────────────
  const fetchIncidents = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("limit", limit);
    params.set("page", page);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (incidentCatalog) params.set("incidentCatalog", incidentCatalog);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const { ok, data } = await apiFetch(`/incident?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      setError("Error al obtener el historial de incidentes");
      setRows([]);
      setTotal(0);
      return;
    }

    setRows(data.data ?? []);
    setTotal(data.pagination?.total ?? data.data?.length ?? 0);
  }, [page, limit, search, sortBy, sortOrder, incidentCatalog, startDate, endDate]);

  const refreshData = useCallback(async () => {
    await fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await refreshData();
      setLoading(false);
    };
    load();
  }, [refreshData]);

  // ── Registrar incidente (modal: idStudent + idIncidentCatalog, puntos van del catálogo) ──
  const createIncident = useCallback(async ({ idStudent, idIncidentCatalog, date, note = "" }) => {
    const body = { idStudent, idIncidentCatalog, date };
    if (note?.trim()) body.note = note.trim();

    const { ok, data } = await apiFetch("/incident", "POST", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) {
      // El backend distingue "incidente duplicado" (mismo tipo, mismo día) de otros errores;
      // el mensaje ya viene listo para mostrar tal cual en el modal.
      throw new Error(data.message || "Error al registrar el incidente");
    }

    await refreshData();
    return data.incident;
  }, [refreshData]);

  // ── Editar incidente (ej. corregir nota o fecha) ─────────────────────────
  const updateIncident = useCallback(async (idIncident, { date, note, idIncidentCatalog }) => {
    const body = {};
    if (date !== undefined) body.date = date;
    if (note !== undefined) body.note = note;
    if (idIncidentCatalog !== undefined) body.idIncidentCatalog = idIncidentCatalog;

    const { ok, data } = await apiFetch(`/incident/${idIncident}`, "PATCH", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar el incidente");

    await refreshData();
    return data.incident;
  }, [refreshData]);

  // ── Eliminar incidente ────────────────────────────────────────────────
  const deleteIncident = useCallback(async (idIncident) => {
    const { ok, data } = await apiFetch(`/incident/${idIncident}`, "DELETE");

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar el incidente");

    await refreshData();
    return data.incident;
  }, [refreshData]);

  // ── Historial de un estudiante puntual (ej. perfil del estudiante) ───────
  const getIncidentsByStudent = useCallback(async (idStudent) => {
    const { ok, data } = await apiFetch(`/incident/student/${idStudent}`, "GET");

    if (!ok || !data?.success) {
      throw new Error(data?.message || "No se encontraron incidentes para este estudiante");
    }

    return data.data ?? data.incidents ?? [];
  }, []);

  return {
    rows,
    total,
    loading,
    error,
    refetch: refreshData,
    createIncident,
    updateIncident,
    deleteIncident,
    getIncidentsByStudent,
  };
}

export { useIncident };