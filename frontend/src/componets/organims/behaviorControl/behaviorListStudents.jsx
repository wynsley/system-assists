import { useState } from "react";
import { FiltersBehavior } from "./FilterSerchDowldBehavior";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { Table } from "../tableReusable";
import { ModalRegisterBehaviors } from "../../modals/assistant/modalRegisterBehaviors";
import { ModalRegisterIncident } from "../../modals/assistant/modalRegisterIncident";
import { FaUserEdit } from "react-icons/fa";
import { Button } from "../../atoms/button";

function BehaviorListStudents({ students, calificar, createIncident, filters, setFilters, loading }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const {openRowId }= useRowToggle()

  const handleEdit = (student) => {
  setSelectedStudent(student);
  setModalType("calificar");
};

const handleIncident = (student) => {
  setSelectedStudent(student);
  setModalType("incidente");
};

  const closeModal = () => {
    setModalType(null);
    setSelectedStudent(null);
  };
  const headers = ["Estudiante", "Grado", "Sección", "Nota", "Escala", "Acciones"];

  return (
    <section className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto py-5 flex flex-col gap-5 rounded-md">
      <FiltersBehavior
        search={filters.search}
        setSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        grade={filters.grade}
        setGrade={(value) => setFilters((prev) => ({ ...prev, grade: value }))}
        section={filters.section}
        setSection={(value) => setFilters((prev) => ({ ...prev, section: value }))}
        students={students}
        showDownload={true}
        filtered={students}
      />

      <Table
        headers={headers}
        data={students}
        loading={loading}
        renderRow={(student) => {
          const isActive = openRowId === student.idClassroomStudent;
          console.log(student)
          return (
            <tr
              key={student.idClassroomStudent}
              className={`border-b border-gray-100 transition-colors duration-300 ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}`}
            >
              <td className="px-6 py-4">{student.student.firstname} {student.student.lastname}</td>
              <td className="px-6 py-4">{student.grade}</td>
              <td className="px-6 py-4">{student.section}</td>
              <td className="px-6 py-4">{student.score}</td>
              <td className="px-6 py-4">{student.scale}</td>
              <td className="px-6 py-4 relative">
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleEdit(student)}
                    className="flex items-center gap-2 text-white bg-blueT py-1 px-2 rounded-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FaUserEdit className="size-5 text-blue-100" />
                    Calificar
                  </Button>
                  <Button
                    onClick={() => handleIncident(student)}
                    className="flex items-center gap-2 text-white bg-blue py-1 px-2 rounded-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FaUserEdit className="size-5 text-blue-100" />
                    incidente
                  </Button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      {modalType === "calificar" && selectedStudent && (
        <ModalRegisterBehaviors
          closeModal={closeModal}
          student={selectedStudent}
          calificar={calificar}
        />
      )}
      {modalType === "incidente" && selectedStudent && (
        <ModalRegisterIncident
          closeModal={closeModal}
          student={selectedStudent}
          createIncident={createIncident}
        />
      )}
    </section>
  );
}

export { BehaviorListStudents };