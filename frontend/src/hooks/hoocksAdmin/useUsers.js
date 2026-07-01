import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useUsers({ page = 1, limit = 10, role, search, sortBy, sortOrder } = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (role) params.set("role", role);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const { ok, data } = await apiFetch(`/user?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setUsers([]);
      setLoading(false);
      return;
    }

    if (!ok || !data.success) {
      setError(data.message || "Error al obtener usuarios");
      setUsers([]);
      setLoading(false);
      return;
    }

    // La forma real: { success, data: [...], pagination: { total, ... } }
    setUsers(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    setLoading(false);
  }, [page, limit, role, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    const { ok, data } = await apiFetch(`/user/${id}`, "DELETE");
    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo eliminar el usuario");
    }
    await fetchUsers();
    return data;
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers, deleteUser };
}

export { useUsers };