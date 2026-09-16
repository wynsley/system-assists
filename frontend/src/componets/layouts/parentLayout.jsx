import { Outlet } from "react-router-dom";
import { SelectedStudentProvider } from "../../context/selectStudentContext";

function ParentLayout() {
  return (
    <SelectedStudentProvider>
      <Outlet />
    </SelectedStudentProvider>
  );
}

export { ParentLayout };