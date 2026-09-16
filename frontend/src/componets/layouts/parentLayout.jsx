import { Outlet } from "react-router-dom";
import { SelectedStudentProvider } from "../../context/parent/selectStudentProvaider";
import { Navbar } from "../organims/navbar";

function ParentLayout() {
  return (
    <SelectedStudentProvider>
      <Navbar />
      <Outlet />
    </SelectedStudentProvider>
  );
}

export { ParentLayout };