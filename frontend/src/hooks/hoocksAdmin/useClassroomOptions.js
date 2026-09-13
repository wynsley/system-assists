import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { useLoading } from "../hookGlobals/useLoading";

function useClassroomOptions() {
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState(null);
  const { loading, startLoading, stopLoading } = useLoading();

  const fetchOptions = useCallback(async () => {
    setError(null);
    startLoading();

    // limit alto porque son pocas aulas (48 en tu caso), traemos todas de una
    const { ok, data } = await apiFetch(`/classroom?limit=50&status=ACTIVO`, "GET");

    if (!data || !ok || !data.success) {
      setError(data?.message || "No se pudieron cargar las aulas");
      setClassrooms([]);
      stopLoading();
      return;
    }

    setClassrooms(data.data ?? []);
    stopLoading();
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const years = useMemo(
    () => [...new Set(classrooms.map((c) => c.year))].sort((a, b) => b - a),
    [classrooms]
  );

  const grades = useMemo(
    () => [...new Set(classrooms.map((c) => c.grade))].sort((a, b) => a - b),
    [classrooms]
  );

  const sections = useMemo(
    () => [...new Set(classrooms.map((c) => c.section))].sort(),
    [classrooms]
  );

  // para el select combinado "1° A - 2025"
  const classroomOptions = useMemo(
    () =>
      [...classrooms]
        .sort((a, b) => a.grade - b.grade || a.section.localeCompare(b.section))
        .map((c, index) => ({
          idClassroom: c.idClassroom,
          year: c.year,
          grade: c.grade,
          section: c.section,
          label: `${c.grade}° "${c.section}" - ${c.year}`,
          pageIndex: index + 1, // <-- posición real dentro del orden, = número de página en el backend
        })),
    [classrooms]
  );

  return { years, grades, sections, classroomOptions, loading, error, refetch: fetchOptions };
}

export { useClassroomOptions };