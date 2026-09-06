import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { getLocalDateString } from "../../utils/date";

function useAttendance({
  page = 1,
  limit = 30,
  search,
  grade,
  section,
  date,
  fetchSummary = false,
  fetchBehavior = false,
} = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [summaryToday, setSummaryToday] = useState(null);
  const [behaviorSummary, setBehaviorSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ grades: [], sections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (filtro por fecha).
  const today = getLocalDateString();
  const targetDate = date || today;

  // ── Roster del día/fecha filtrada (ya viene resuelto desde el backend) ──
  const buildTable = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("limit", limit);
    params.set("page", page);
    params.set("date", targetDate);
    if (search) params.set("search", search);
    if (grade) params.set("grade", grade);
    if (section) params.set("section", section);

    const { ok, data } = await apiFetch(`/attendance?${params.toString()}`, "GET");

    if (!ok || !data?.success) {
      setError("Error al obtener asistencias");
      setRows([]);
      setTotal(0);
      return;
    }

    const tableRows = (data.data ?? []).map((row) => ({
      idStudent:    row.student.idStudent,
      fullname:     `${row.student.firstname} ${row.student.lastname}`,
      dni:          row.student.dni,
      grade:        row.grade,
      section:      row.section,
      year:         row.year,
      idAttendance: row.idAttendance,
      status:       row.status ?? "FALTA", // null del backend → FALTA en UI
      time: row.date
        ? new Date(row.date).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      note: row.note ?? null,
    }));

    setRows(tableRows);
    setTotal(data.pagination?.total ?? tableRows.length);
  }, [search, grade, section, page, limit, targetDate]);

  // ── Opciones de filtro: grados y secciones (según el rol, desde backend) ──
  const fetchFilterOptions = useCallback(async () => {
    const { ok, data } = await apiFetch("/attendance/filters", "GET");
    if (!ok || !data?.success) {
      setFilterOptions({ grades: [], sections: [] });
      return;
    }
    setFilterOptions({
      grades: data.data?.grades ?? [],
      sections: data.data?.sections ?? [],
    });
  }, []);

  // ── Resumen del día ────────────────────────────────────────────────────
  const fetchSummaryToday = useCallback(async () => {
    if (!fetchSummary) return;
    const { ok, data } = await apiFetch("/attendance/summary/today", "GET");
    if (!ok || !data?.success) { setSummaryToday(null); return; }
    const s = data.data;
    setSummaryToday({
      present:   s.present   ?? 0,
      late:      s.late      ?? 0,
      justified: s.justified ?? 0,
      absent:    s.absent    ?? 0,
      total: (s.present ?? 0) + (s.late ?? 0) + (s.justified ?? 0) + (s.absent ?? 0),
    });
  }, [fetchSummary]);

  // ── Comportamiento AD/A/B/C ────────────────────────────────────────────
  const fetchBehaviorSummary = useCallback(async () => {
    if (!fetchBehavior) return;
    const { ok, data } = await apiFetch("/attendance/summary/behavior", "GET");
    if (!ok || !data?.success) { setBehaviorSummary(null); return; }
    setBehaviorSummary(data.data);
  }, [fetchBehavior]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      buildTable(),
      fetchSummaryToday(),
      fetchBehaviorSummary(),
      fetchFilterOptions(),
    ]);
  }, [buildTable, fetchSummaryToday, fetchBehaviorSummary, fetchFilterOptions]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    load();
  }, [refreshData]);

  // ── Crear asistencia (escaneo o registro manual) ────────────────────────
  const createAttendance = useCallback(async ({ idStudent, status, note = "" }) => {
    const body = { idStudent, status };
    if (note?.trim()) body.note = note.trim();

    const { ok, data } = await apiFetch("/attendance", "POST", body);

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al registrar asistencia");

    await refreshData();
    return data.attendance;
  }, [refreshData]);

  // ── Actualizar asistencia existente ──────────────────────────────────────
  const updateAttendance = useCallback(async (idAttendance, { status, note }) => {
    const { ok, data } = await apiFetch(`/attendance/${idAttendance}`, "PATCH", {
      status,
      note,
    });

    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al actualizar asistencia");

    await refreshData();
    return data.attendance;
  }, [refreshData]);

  // ── Guardar (decide crear o actualizar según si ya existe registro) ─────
  const saveAttendance = useCallback(async (row, { status, note }) => {
    if (row.idAttendance) {
      return updateAttendance(row.idAttendance, { status, note });
    }
    return createAttendance({ idStudent: row.idStudent, status, note });
  }, [createAttendance, updateAttendance]);

  // ── Buscar estudiante por DNI (para el escaneo QR) ────────────────────
  const findStudentByDni = useCallback(async (dni) => {
    const cleanDni = dni.trim();

    const { ok, data } = await apiFetch(
      `/student?search=${cleanDni}&limit=20&page=1`,
      "GET"
    );

    if (!ok || !data?.success) {
      throw new Error("No se pudo conectar con el servidor");
    }

    const student = data.data?.find((item) => item.dni === cleanDni);

    if (!student) {
      throw new Error(`No existe un estudiante con DNI ${cleanDni}`);
    }

    if (student.status !== "ACTIVO") {
      throw new Error(`El estudiante con DNI ${cleanDni} no está activo`);
    }

    const activeClassroom = student.classroomStudents?.[0]?.classroom ?? null;

    return {
      ...student,
      classroom: activeClassroom
        ? {
            idClassroom: activeClassroom.idClassroom,
            year:        activeClassroom.year,
            grade:       activeClassroom.section?.grade?.level ?? null,
            section:     activeClassroom.section?.name ?? null,
          }
        : null,
    };
  }, []);

  // ── Stats calculadas desde las filas visibles ────────────────────────────
  const stats = {
    total:   rows.length,
    present: rows.filter(r => r.status === "PRESENTE").length,
    late:    rows.filter(r => r.status === "TARDANZA").length,
    absent:  rows.filter(r => r.status === "FALTA").length,
  };

  return {
    rows,
    total,
    stats,
    summaryToday,
    behaviorSummary,
    filterOptions,       // 🔹 { grades: [{level}], sections: [{name}] } para tus selects "Grados"/"Secciones"
    loading,
    error,
    refetch: refreshData,
    createAttendance,
    updateAttendance,
    saveAttendance,
    findStudentByDni,
  };
}

export { useAttendance };