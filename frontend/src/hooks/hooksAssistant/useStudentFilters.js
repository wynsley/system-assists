import { useMemo, useState } from "react";

export function useStudentFilters(initialData = []) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");

  const filtered = useMemo(() => {
    return initialData.filter((item) => {

      const term = search.toLowerCase();

      // Nombre o DNI
      const matchesSearch =
        !search ||
        item.fullname?.toLowerCase().includes(term) ||
        item.dni?.includes(term);


      // Grado
      const matchesGrade =
        !grade ||
        String(item.grade) === String(grade);


      // Sección
      const matchesSection =
        !section ||
        item.section?.toLowerCase() === section.toLowerCase();


      return matchesSearch && matchesGrade && matchesSection;
    });

  }, [initialData, search, grade, section]);


  return {
    search,
    setSearch,
    grade,
    setGrade,
    section,
    setSection,
    filtered,
  };
}