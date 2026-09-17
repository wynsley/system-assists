import { Outlet } from "react-router-dom";
import { SelectedStudentProvider } from "../../context/parent/selectStudentProvider";
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