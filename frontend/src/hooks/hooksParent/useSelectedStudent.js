import { useContext } from "react";
import { SelectedStudentContext } from "../../context/parent/selectStudentContext";

function useSelectedStudent() {
  const ctx = useContext(SelectedStudentContext);
  if (!ctx) {
    throw new Error("useSelectedStudent debe usarse dentro de <SelectedStudentProvider>");
  }
  return ctx;
}

export { useSelectedStudent };