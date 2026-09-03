import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function useAuxiliarSectionAssignment({ idAuxiliar, year } = {}) {
  const [classrooms, setClassrooms] = useState([]);       // todas las aulas activas
  const [assignments, setAssignments] = useState([]);      // asignaciones actuales de este auxiliar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null); // idClassroom que se está guardando/quitando (para loading por checkbox)

  const currentYear = year ?? new Date().getFullYear();

  const fetchData = useCallback(async () => {
    if (!idAuxiliar) return;

    setLoading(true);
    setError(null);

    const [resClassrooms, resAssignments] = await Promise.all([
      apiFetch(`/classroom?year=${currentYear}&status=ACTIVO&limit=50&page=1`, "GET"),
      apiFetch(`/classroom-auxiliar?idAuxiliar=${idAuxiliar}&limit=50&page=1`, "GET"),
    ]);

    if (!resClassrooms.ok || !resClassrooms.data?.success) {
      setError("Error al obtener las aulas");
      setLoading(false);
      return;
    }

    if (!resAssignments.ok || !resAssignments.data?.success) {
      setError("Error al obtener las asignaciones del auxiliar");
      setLoading(false);
      return;
    }

    setClassrooms(resClassrooms.data.data ?? []);
    setAssignments(resAssignments.data.data ?? []);
    setLoading(false);
  }, [idAuxiliar, currentYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mapa idClassroom -> idClassroomAuxiliar (para saber qué asignación borrar al desmarcar)
  const assignmentMap = useMemo(() => {
  return new Map(assignments.map((a) => [a.classroom.idClassroom, a.idClassroomAuxiliar]));
}, [assignments]);

  // Aulas agrupadas por grado, con su estado "asignado sí/no" ya resuelto
  const gradeGroups = useMemo(() => {
    const groups = {};
    for (const c of classrooms) {
      const level = c.grade; // asumiendo formatClassroomOnly: { grade, section, year, idClassroom }
      if (!groups[level]) groups[level] = { level, sections: [] };
      groups[level].sections.push({
        idClassroom: c.idClassroom,
        section: c.section,
        assigned: assignmentMap.has(c.idClassroom),
        idClassroomAuxiliar: assignmentMap.get(c.idClassroom) ?? null,
      });
    }
    return Object.values(groups).sort((a, b) => a.level - b.level);
  }, [classrooms, assignmentMap]);

  // ── Marcar/desmarcar un checkbox individual ─────────────────────────
  const toggleClassroom = useCallback(async ({ idClassroom, assigned, idClassroomAuxiliar }) => {
    setSavingId(idClassroom);
    try {
      if (assigned) {
        // Ya está asignado -> quitar
        const { ok, data } = await apiFetch(`/classroom-auxiliar/${idClassroomAuxiliar}`, "DELETE");
        if (!data) throw new Error("No se pudo conectar con el servidor");
        if (!ok || !data.success) throw new Error(data.message || "Error al quitar la asignación");
      } else {
        // No está asignado -> asignar
        const { ok, data } = await apiFetch("/classroom-auxiliar", "POST", {
          idClassroom,
          idAuxiliar,
        });
        if (!data) throw new Error("No se pudo conectar con el servidor");
        if (!ok || !data.success) throw new Error(data.message || "Error al asignar el aula");
      }
      await fetchData();
    } finally {
      setSavingId(null);
    }
  }, [idAuxiliar, fetchData]);

  // ── Asignar un grado completo de una vez ─────────────────────────────
  const assignFullGrade = useCallback(async (grade) => {
    const { ok, data } = await apiFetch("/classroom-auxiliar/bulk-by-grade", "POST", {
      idAuxiliar,
      grade,
      year: currentYear,
    });
    if (!data) throw new Error("No se pudo conectar con el servidor");
    if (!ok || !data.success) throw new Error(data.message || "Error al asignar el grado");
    await fetchData();
    return data.data; // { requested, created, alreadyAssigned }
  }, [idAuxiliar, currentYear, fetchData]);

  return {
    gradeGroups,     // [{ level, sections: [{ idClassroom, section, assigned, idClassroomAuxiliar }] }]
    loading,
    error,
    savingId,        // idClassroom actualmente guardando (para deshabilitar ese checkbox puntual)
    toggleClassroom,
    assignFullGrade,
    refetch: fetchData,
  };
}

export { useAuxiliarSectionAssignment };