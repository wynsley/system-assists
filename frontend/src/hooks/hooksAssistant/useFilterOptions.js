import { useMemo } from "react";

export function useFilterOptions(students = []) {

  const gradeOptions = useMemo(() => {

    const grades = [
      ...new Set(
        students
          .map(student => student.grade)
          .filter(Boolean)
      )
    ];

    return [
      {
        text: "Grados",
        value: "",
      },
      ...grades.map(grade => ({
        text: `${grade}°`,
        value: String(grade),
      }))
    ];

  }, [students]);


  const sectionOptions = useMemo(() => {

    const sections = [
      ...new Set(
        students
          .map(student => student.section)
          .filter(Boolean)
      )
    ];

    return [
      {
        text: "Secciones",
        value: "",
      },
      ...sections.map(section => ({
        text: section,
        value: section,
      }))
    ];

  }, [students]);


  return {
    gradeOptions,
    sectionOptions,
  };
}