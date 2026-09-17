import { useState, useEffect, useMemo } from "react";
import { SelectedStudentContext } from "./selectStudentContext.js";
import { useParentSummary } from "../../hooks/hooksParent/useParentSumary.js";

function SelectedStudentProvider({ children }) {
  const { studentsSummary, loading, error, refetch } = useParentSummary();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentsOptions = useMemo(
    () =>
      studentsSummary.map((s) => ({
        id: s.idStudent,
        name: `${s.firstname} ${s.lastname}`,
      })),
    [studentsSummary],
  );

  // auto-selecciona el primer hijo SOLO si el actual ya no existe en la lista
  useEffect(() => {
    if (studentsOptions.length === 0) return;
    const exists = studentsOptions.some((s) => s.id === selectedStudent);
    if (!exists) setSelectedStudent(studentsOptions[0].id);
  }, [studentsOptions, selectedStudent]);

  const selectedStudentData = useMemo(
    () => studentsSummary.find((s) => s.idStudent === selectedStudent) ?? null,
    [studentsSummary, selectedStudent],
  );

  const value = useMemo(
    () => ({
      studentsSummary,
      studentsOptions,
      selectedStudent,
      setSelectedStudent,
      selectedStudentData,
      loadingStudents: loading,
      errorStudents: error,
      refetchStudents: refetch,
    }),
    [studentsSummary, studentsOptions, selectedStudent, selectedStudentData, loading, error, refetch],
  );

  return (
    <SelectedStudentContext.Provider value={value}>
      {children}
    </SelectedStudentContext.Provider>
  );
}

export { SelectedStudentProvider };