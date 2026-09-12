import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { useLoading } from "../hookGlobals/useLoading";

function useClassroomRoster({ year, grade, section } = {}) {
  const [page, setPage] = useState(1);
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, totalClassrooms: 0 });
  const [error, setError] = useState(null);
  const { loading, startLoading, stopLoading } = useLoading();

  // si cambian los filtros, siempre vuelve a la aula 1 del nuevo filtro
  useEffect(() => {
    setPage(1);
  }, [year, grade, section]);

  const fetchRoster = useCallback(async () => {
    setError(null);
    startLoading();

    const params = new URLSearchParams();
    params.set("page", page);
    if (year) params.set("year", year);
    if (grade) params.set("grade", grade);
    if (section) params.set("section", section);

    const { ok, data } = await apiFetch(`/classroom-student/roster?${params.toString()}`, "GET");

    if (!data) {
      setError("No se pudo conectar con el servidor");
      setClassroom(null);
      setStudents([]);
      stopLoading();
      return;
    }

    if (!ok || !data.success) {
      setError(data.message || "Error al obtener el aula");
      setClassroom(null);
      setStudents([]);
      stopLoading();
      return;
    }

    setClassroom(data.classroom ?? null);
    setStudents(data.data ?? []);
    setPagination(data.pagination ?? { page, totalPages: 0, totalClassrooms: 0 });
    stopLoading();
  }, [page, year, grade, section]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const goToPage = useCallback((p) => {
    if (p >= 1 && p <= pagination.totalPages) setPage(p);
  }, [pagination.totalPages]);

  const reassignStudent = useCallback(async (idClassroomStudent, idClassroom) => {
    const { ok, data } = await apiFetch(`/classroom-student/${idClassroomStudent}`, "PATCH", {
      idClassroom,
    });
    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "No se pudo reasignar al estudiante");
    }
    await fetchRoster();
    return data;
  }, [fetchRoster]);

  return {
    page,
    classroom,
    students,
    pagination,
    loading,
    error,
    goToPage,
    refetch: fetchRoster,
    reassignStudent,
  };
}

export { useClassroomRoster };