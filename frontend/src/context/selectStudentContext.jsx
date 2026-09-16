import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useParentSummary } from "../hooks/hooksParent/useParentSumary";

const SelectedStudentContext = createContext(null);

function SelectedStudentProvider({ children }) {
  const { studentsSummary, loading, error, refetch } = useParentSummary();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // shape que espera tu FilterStudents: { id, name }
  const studentsOptions = useMemo(
    () =>
      studentsSummary.map((s) => ({
        id: s.idStudent,
        name: `${s.firstname} ${s.lastname}`,
      })),
    [studentsSummary],
  );

  // selecciona el primer hijo apenas carga la lista (una sola vez, a nivel global)
  useEffect(() => {
    if (!selectedStudent && studentsOptions.length > 0) {
      setSelectedStudent(studentsOptions[0].id);
    }
  }, [studentsOptions, selectedStudent]);

  const selectedStudentData = useMemo(
    () => studentsSummary.find((s) => s.idStudent === selectedStudent) ?? null,
    [studentsSummary, selectedStudent],
  );

  const value = {
    studentsSummary,      // data cruda del back (para el Dashboard)
    studentsOptions,      // { id, name }[] (para el FilterStudents)
    selectedStudent,      // idStudent actual
    setSelectedStudent,
    selectedStudentData,  // el objeto del hijo seleccionado dentro de studentsSummary
    loadingStudents: loading,
    errorStudents: error,
    refetchStudents: refetch,
  };

  return (
    <SelectedStudentContext.Provider value={value}>
      {children}
    </SelectedStudentContext.Provider>
  );
}

function useSelectedStudent() {
  const ctx = useContext(SelectedStudentContext);
  if (!ctx) {
    throw new Error("useSelectedStudent debe usarse dentro de <SelectedStudentProvider>");
  }
  return ctx;
}

export { SelectedStudentProvider, useSelectedStudent };