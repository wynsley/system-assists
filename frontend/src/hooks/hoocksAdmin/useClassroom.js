import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../helpers/apiFetch";
import { API_LIMITS } from "../../config/apiLimits";

function useClassrooms({
  page = 1,
  limit = API_LIMITS.classroom,
  search,
  year,
  grade,
  section,
} = {}) {
  // ESTADOS
  const [classrooms, setClassrooms] = useState([]);

  const [years, setYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // OBTENER AULAS
  const fetchClassrooms = useCallback(async () => {
    const params = new URLSearchParams();
    const safeLimit = Math.min(limit, API_LIMITS.classroom);

    params.set("page", page);
    params.set("limit", safeLimit);

    if (search) params.set("search", search);
    if (year) params.set("year", year);
    if (grade) params.set("grade", grade);
    if (section) params.set("section", section);

    const { ok, data } = await apiFetch(
      `/classroom?${params.toString()}`,
      "GET"
    );

    if (!data || !ok || !data.success) {
      throw new Error(data?.message || "Error al obtener aulas");
    }

    setClassrooms(data.data ?? []);
    setTotal(data.pagination?.total ?? 0);
    
  }, [page, limit, search, year, grade, section]);

  // OBTENER CATÁLOGOS (grados y secciones)
  const fetchCatalogs = useCallback(async () => {
    const [yearsResponse, gradesResponse, sectionsResponse] = await Promise.all([
      apiFetch("/classroom/years", "GET"),
      apiFetch("/grade?limit=10", "GET"),
      apiFetch("/section?limit=50", "GET"),
    ]);

    if (!yearsResponse.ok || !yearsResponse.data?.success) {
      throw new Error(yearsResponse.data?.message || "Error al obtener años");
    }
    if (!gradesResponse.ok || !gradesResponse.data?.success) {
      throw new Error(gradesResponse.data?.message || "Error al obtener grados");
    }
    if (!sectionsResponse.ok || !sectionsResponse.data?.success) {
      throw new Error(sectionsResponse.data?.message || "Error al obtener secciones");
    }

    const uniqueYears = (yearsResponse.data.data ?? []).map((y) => ({
      idYear: y,
      year: y,
    }));

    setYears(uniqueYears);
    setGrades(gradesResponse.data.data ?? []);
    setSections(sectionsResponse.data.data ?? []);
  }, []);

  // OBTENER TODO
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchClassrooms(), fetchCatalogs()]);
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [fetchClassrooms, fetchCatalogs]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ELIMINAR AULA
  const deleteClassroom = useCallback(
    async (id) => {
      const { ok, data } = await apiFetch(`/classroom/${id}`, "DELETE");

      if (!data || !ok || !data.success) {
        throw new Error(data?.message || "No se pudo eliminar el aula");
      }

      await fetchClassrooms();
      return data;
    },
    [fetchClassrooms]
  );

  // ELIMINAR GRADO
  const deleteGrade = useCallback(
    async (id) => {
      const { ok, data } = await apiFetch(`/grade/${id}`, "DELETE");

      if (!data || !ok || !data.success) {
        throw new Error(data?.message || "No se pudo eliminar el grado");
      }

      await fetchCatalogs();
      return data;
    },
    [fetchCatalogs]
  );

  // ELIMINAR SECCIÓN
  const deleteSection = useCallback(
    async (id) => {
      const { ok, data } = await apiFetch(`/section/${id}`, "DELETE");

      if (!data || !ok || !data.success) {
        throw new Error(data?.message || "No se pudo eliminar la sección");
      }

      await fetchCatalogs();
      return data;
    },
    [fetchCatalogs]
  );

  return {
    classrooms,
    years,
    grades,
    sections,
    total,
    loading,
    error,
    refetch: fetchAll,
    refetchClassrooms: fetchClassrooms,
    refetchCatalogs: fetchCatalogs,
    deleteClassroom,
    deleteGrade,
    deleteSection,
  };
}

export { useClassrooms };