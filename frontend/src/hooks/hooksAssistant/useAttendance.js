import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useAttendance({
  page = 1,
  limit = 20,
  search,
  date,
  fetchSummary = false,
  fetchBehavior = false,
  autoFetch = true,
} = {}) {
  const [attendances, setAttendances] = useState([]);
  const [total, setTotal] = useState(0);
  const [summaryToday, setSummaryToday] = useState(null);
  const [behaviorSummary, setBehavior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // Lista de asistencias
  // ─────────────────────────────────────────────────────────────
  const fetchAttendances = useCallback(async () => {
    if (!autoFetch) return;

    setError(null);

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    params.set("sortOrder", "desc");

    if (search) params.set("search", search);
    if (date) params.set("date", date);

    const { ok, data } = await apiFetch(
      `/attendance?${params.toString()}`,
      "GET"
    );

    if (!ok || !data?.success) {
      setAttendances([]);
      setTotal(0);
      setError(data?.message || "Error al obtener asistencias");
      return;
    }

    setAttendances(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
  }, [page, limit, search, date, autoFetch]);

  // ─────────────────────────────────────────────────────────────
  // Resumen del día
  // ─────────────────────────────────────────────────────────────
  const fetchSummaryToday = useCallback(async () => {
    if (!fetchSummary) return;

    const { ok, data } = await apiFetch(
      "/attendance/summary/today",
      "GET"
    );

    if (!ok || !data?.success) {
      setSummaryToday(null);
      return;
    }

    const summary = data.data;

    setSummaryToday({
      ...summary,
      total:
        (summary.present ?? 0) +
        (summary.late ?? 0) +
        (summary.justified ?? 0) +
        (summary.absent ?? 0),
    });
  }, [fetchSummary]);

  // ─────────────────────────────────────────────────────────────
  // Resumen de comportamiento
  // ─────────────────────────────────────────────────────────────
  const fetchBehaviorSummary = useCallback(async () => {
    if (!fetchBehavior) return;

    const { ok, data } = await apiFetch(
      "/attendance/summary/behavior",
      "GET"
    );

    if (!ok || !data?.success) {
      setBehavior(null);
      return;
    }

    setBehavior(data.data);
  }, [fetchBehavior]);

  // ─────────────────────────────────────────────────────────────
  // Refresca toda la información
  // ─────────────────────────────────────────────────────────────
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchAttendances(),
      fetchSummaryToday(),
      fetchBehaviorSummary(),
    ]);
  }, [
    fetchAttendances,
    fetchSummaryToday,
    fetchBehaviorSummary,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Carga inicial
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };

    load();
  }, [refreshData]);

  // ─────────────────────────────────────────────────────────────
  // Registrar asistencia
  // ─────────────────────────────────────────────────────────────
  const createAttendance = useCallback(
    async ({ idStudent, status, note = "" }) => {
      const { ok, data } = await apiFetch("/attendance", "POST", {
        idStudent,
        status,
        note,
        date: new Date().toISOString(),
      });

      if (!data) {
        throw new Error("No se pudo conectar con el servidor");
      }

      if (!ok || !data.success) {
        throw new Error(
          data.message || "Error al registrar la asistencia"
        );
      }

      await refreshData();

      return data.attendance;
    },
    [refreshData]
  );

  // ─────────────────────────────────────────────────────────────
  // Actualizar asistencia
  // ─────────────────────────────────────────────────────────────
  const updateAttendance = useCallback(
    async (idAttendance, { status, note }) => {
      const { ok, data } = await apiFetch(
        `/attendance/${idAttendance}`,
        "PATCH",
        {
          status,
          note,
        }
      );

      if (!data) {
        throw new Error("No se pudo conectar con el servidor");
      }

      if (!ok || !data.success) {
        throw new Error(
          data.message || "Error al actualizar la asistencia"
        );
      }

      await refreshData();

      return data.attendance;
    },
    [refreshData]
  );

  // ─────────────────────────────────────────────────────────────
  // Buscar estudiante por DNI
  // ─────────────────────────────────────────────────────────────
  const findStudentByDni = useCallback(async (dni) => {
  const cleanDni = dni.trim();

  const { ok, data } = await apiFetch(
    `/student?search=${cleanDni}&limit=20&page=1`,
    "GET"
  );

  if (!ok || !data?.success) {
    throw new Error("No se encontró el estudiante");
  }

  const student = data.data?.find(
    (item) => item.dni === cleanDni
  );

  if (!student) {
    throw new Error(
      `No existe un estudiante con DNI ${cleanDni}`
    );
  }

  return student;
}, []);

  return {
    // Datos
    attendances,
    total,
    summaryToday,
    behaviorSummary,
    loading,
    error,

    // Refrescar
    refetch: refreshData,

    // Acciones
    createAttendance,
    updateAttendance,
    findStudentByDni,
  };
}

export { useAttendance };