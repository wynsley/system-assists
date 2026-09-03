import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { useLoading } from "../hookGlobals/useLoading";

function useStudents({ page = 1, limit = 10, status, gender, search, sortBy, sortOrder } = {}) {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const {loading, startLoading, stopLoading} = useLoading()
  
  const fetchStudents = useCallback(async () => {
    setError(null);
    startLoading()

    const params = new URLSearchParams();
    
    params.set("page", page);
    params.set("limit", limit);
    if (status) params.set("status", status);
    if (gender) params.set("gender", gender);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const { ok, data } = await apiFetch(`/student?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setStudents([]);
      stopLoading();
      return;
    }

    if (!ok || !data.success) {
      setError(data.message || "Error al obtener estudiantes");
      setStudents([]);
      stopLoading();
      return;
    }

    setStudents(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    stopLoading();
  }, [page, limit, status, gender, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const deleteStudent = useCallback(async (id) => {
    const { ok, data } = await apiFetch(`/student/${id}`, "DELETE");
    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo eliminar el estudiante");
    }
    await fetchStudents();
    return data;
  }, [fetchStudents]);

  return { students, total, loading, error, refetch: fetchStudents, deleteStudent };
}

export { useStudents };