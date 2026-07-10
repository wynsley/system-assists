import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useIncidentCatalog({
  page = 1,
  limit = 50,
  search,
  type,
} = {}) {
  const [catalog, setCatalog] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lista del catálogo ─────────────────────────────────────────────────────
  const fetchCatalog = useCallback(async () => {
    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("search", search);
    if (type)   params.set("type", type);

    const { ok, data } = await apiFetch(
      `/incident-catalog?${params.toString()}`,
      "GET"
    );

    if (!ok || !data?.success) {
      setCatalog([]);
      setError(data?.message || "Error al obtener catálogo");
      return;
    }

    setCatalog(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
  }, [page, limit, search, type]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCatalog();
      setLoading(false);
    };
    load();
  }, [fetchCatalog]);

  // ── Crear item del catálogo (solo ADMIN) ───────────────────────────────────
  const createCatalogItem = useCallback(async ({
    name,
    description,
    type,
    pointsDeducted,
  }) => {
    const { ok, data } = await apiFetch("/incident-catalog", "POST", {
      name,
      description,
      type,
      pointsDeducted,
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al crear catálogo");

    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  // ── Actualizar item del catálogo (solo ADMIN) ─────────────────────────────
  const updateCatalogItem = useCallback(async (idIncidentCatalog, updateData) => {
    const { ok, data } = await apiFetch(
      `/incident-catalog/${idIncidentCatalog}`,
      "PATCH",
      updateData
    );

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar catálogo");

    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  // ── Eliminar item del catálogo (solo ADMIN) ───────────────────────────────
  const deleteCatalogItem = useCallback(async (idIncidentCatalog) => {
    const { ok, data } = await apiFetch(
      `/incident-catalog/${idIncidentCatalog}`,
      "DELETE"
    );

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al eliminar catálogo");

    await fetchCatalog();
    return data.incidentCatalog;
  }, [fetchCatalog]);

  // Labels por tipo para usar en badges/filtros
  const TYPE_LABELS = {
    LEVE:      { label: "Leve",       className: "bg-yellow-100 text-yellow-700" },
    GRAVE:     { label: "Grave",      className: "bg-orange-100 text-orange-700" },
    MUY_GRAVE: { label: "Muy grave",  className: "bg-red-100 text-red-700" },
  };

  // Opciones formateadas para selects
  const catalogOptions = catalog.map((item) => ({
    value: String(item.idIncidentCatalog),
    text:  `${item.name} (${TYPE_LABELS[item.type]?.label ?? item.type}) — ${item.pointsDeducted} pts`,
    ...item,
  }));

  return {
    catalog,
    catalogOptions, // listo para usar en <select> o FormItem
    total,
    loading,
    error,
    TYPE_LABELS,
    refetch: fetchCatalog,
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
  };
}

export { useIncidentCatalog };