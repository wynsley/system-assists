import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useParentAttendance({ idStudent, status, period, page = 1, limit = 20 } = {}) {
  const [stats, setStats] = useState({
    schoolDaysRegistered: 0,
    attendances: 0,
    absences: 0,
    attendanceRate: 0,
  });
  const [counts, setCounts] = useState({ total: 0, present: 0, late: 0, justified: 0, absent: 0 });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!idStudent) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("idStudent", idStudent);
    params.set("page", page);
    params.set("limit", limit);
    if (status) params.set("status", status);
    if (period) params.set("period", period);

    const { ok, data } = await apiFetch(`/attendance/parent-detail?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
      return;
    }

    if (!ok || !data.success) {
      setError(data.errors?.[0]?.message || data.message || "Error al obtener la asistencia");
      setLoading(false);
      return;
    }

    setStats(data.stats ?? {});
    setCounts(data.counts ?? {});
    setRows(
      (data.rows ?? []).map((row) => ({
        ...row,
        // status null => "Ausente" en la UI, igual que en el hook del auxiliar
        status: row.status ?? "FALTA",
        time: row.time
          ? new Date(row.time).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
          : null,
      })),
    );
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [idStudent, status, period, page, limit]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    stats,
    counts,
    rows,
    total,
    loading,
    error,
    refetch: fetchDetail,
  };
}

export { useParentAttendance };