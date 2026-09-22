import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useParentRelations({ page = 1, limit = 10, search, relationship, idParent, idStudent } = {}) {
  const [relations, setRelations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("search", search);
    if (relationship) params.set("relationship", relationship);
    if (idParent) params.set("idParent", idParent);
    if (idStudent) params.set("idStudent", idStudent);

    const { ok, data } = await apiFetch(`/parent?${params.toString()}`, "GET");

    if (!data) { setError("No se pudo conectar con el servidor"); setLoading(false); return; }
    if (!ok || !data.success) {
      setError(data.errors?.[0]?.message || data.message || "Error al obtener las relaciones");
      setLoading(false);
      return;
    }

    setRelations(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    setLoading(false);
    
  }, [page, limit, search, relationship, idParent, idStudent]);

  useEffect(() => { fetchRelations(); }, [fetchRelations]);

  const createRelation = useCallback(async ({ idStudent, idParent, relationship }) => {
    const { ok, data } = await apiFetch("/parent", "POST", { 
      idStudent, 
      idParent, 
      relationship 
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.errors?.[0]?.message || data.message || "Error al asignar apoderado");
    return data.parent;
  }, []);

  const updateRelation = useCallback(async (idStudentParent, payload) => {
    const { ok, data } = await apiFetch(`/parent/${idStudentParent}`, "PATCH", payload);
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.errors?.[0]?.message || data.message || "Error al actualizar");
    return data.data;
  }, []);

  const deleteRelation = useCallback(async (idStudentParent) => {
    const { ok, data } = await apiFetch(`/parent/${idStudentParent}`, "DELETE");
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.errors?.[0]?.message || data.message || "Error al quitar la relación");
    return data.data;
  }, []);

  return { 
    relations, 
    total, 
    loading, 
    error, 
    refetch: 
    fetchRelations, 
    createRelation, 
    updateRelation, 
    deleteRelation 
  };
}

export { useParentRelations };