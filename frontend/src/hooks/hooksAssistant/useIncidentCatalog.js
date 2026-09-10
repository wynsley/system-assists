import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useIncidentCatalog({
  page = 1,
  limit = 50,
  search,
  sortBy,
  sortOrder,
  fetchList = true,
} = {}) {
  const [catalog, setCatalog] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = useCallback(async () => {
    if (!fetchList) return;
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const { ok, data } = await apiFetch(`/incident-catalog?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      setError("Error al obtener el catálogo de incidentes");
      setCatalog([]);
      setTotal(0);
      return;
    }

    setCatalog(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
  }, [fetchList, page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await fetchCatalog();
      setLoading(false);
    };
    load();
  }, [fetchCatalog]);

  // Agrupado por tipo — para el select de ModalRegisterIncident
  const grouped = {
    POSITIVO: catalog.filter((item) => item.type === "POSITIVO"),
    NEGATIVO: catalog.filter((item) => item.type === "NEGATIVO"),
  };

  const createIncidentType = useCallback(async ({ name, description, type, points }) => {
    const { ok, data } = await apiFetch("/incident-catalog", "POST", { name, description, type, points });
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al crear el tipo de incidente");
    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  const updateIncidentType = useCallback(async (idIncidentCatalog, { name, description, type, points }) => {
    const body = {};
    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;
    if (type !== undefined) body.type = type;
    if (points !== undefined) body.points = points;

    const { ok, data } = await apiFetch(`/incident-catalog/${idIncidentCatalog}`, "PATCH", body);
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar el tipo de incidente");
    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  const deleteIncidentType = useCallback(async (idIncidentCatalog) => {
    const { ok, data } = await apiFetch(`/incident-catalog/${idIncidentCatalog}`, "DELETE");
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar el tipo de incidente");
    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  return {
    catalog,
    grouped,       // { POSITIVO: [...], NEGATIVO: [...] } — nunca undefined, arranca en []
    total,
    loading,
    error,
    refetch: fetchCatalog,
    createIncidentType,
    updateIncidentType,
    deleteIncidentType,
  };
}

export { useIncidentCatalog };