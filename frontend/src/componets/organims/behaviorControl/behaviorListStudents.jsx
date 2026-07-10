import { useState } from "react";
import { FiltersBehavior } from "./FilterSerchDowldBehavior";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { useStudentFilters } from "../../../hooks/hooksAssistant/useStudentFilters";
import { Table } from "../tableReusable";
import { ModalRegisterBehaviors } from "../../modals/assistant/modalRegisterBehaviors";
import { FaUserEdit } from "react-icons/fa";

function BehaviorListStudents({
  students,
  updateBehavior
}) {

  const [selectedStudent, setSelectedStudent] = useState(null);

  // filtros
  const {
    search,
    setSearch,
    grade,
    setGrade,
    section,
    setSection,
    filtered,
  } = useStudentFilters(); 

  // fila activa
  const {
    openRowId,
    openRow,
    closeRow
  } = useRowToggle();

  // abrir modal
  const handleEdit = (student) => {
    setSelectedStudent(student);
    openRow(student.id);
  };

  const headers = [
    "Estudiante",
    "DNI",
    "Grado",
    "Sección",
    "Calificación",
    "Acciones"
  ];

  return (
    <section
      className="
      w-[96%] md:w-[90%] md:max-w-7xl mx-auto
      py-5 flex flex-col gap-5 rounded-md
    "
    >
      <FiltersBehavior
        search={search}
        setSearch={setSearch}
        grade={grade}
        setGrade={setGrade}
        section={section}
        setSection={setSection}
        students={students}
        showDownload = {true}
        filtered={filtered}
      />

      <Table
        headers={headers}
        data={filtered}
        renderRow={(student) => {

          const isActive =
            openRowId === student.id;

          return (
            <tr
              key={student.id}
              className={`
                border-b border-gray-100
                transition-colors duration-300
                ${isActive
                  ? "bg-blue-100"
                  : "hover:bg-gray-50"}
              `}
            >
              <td className="px-6 py-4">
                {student.student}
              </td>

              <td className="px-6 py-4">
                {student.dni}
              </td>

              <td className="px-6 py-4">
                {student.grade}
              </td>

              <td className="px-6 py-4">
                {student.section}
              </td>
              <td className="px-6 py-4">
                {student.behavior.behaviorGrade}
              </td>

              <td className="px-6 py-4 relative">

                <button
                  onClick={() => handleEdit(student)}
                  className="
                    flex items-center gap-2
                    text-white bg-blueT
                    py-1 px-2 rounded-md
                    transition-all duration-300
                    hover:-translate-y-0.5
                  "
                >
                  <FaUserEdit className="size-5 text-blue-100" />
                  Calificar
                </button>

                {
                  openRowId === student.id && (
                    <ModalRegisterBehaviors
                      closeModal={closeRow}
                      student={selectedStudent}
                      updateBehavior={updateBehavior}
                    />
                  )
                }

              </td>
            </tr>
          );
        }}
      />
    </section>
  );
}

export { BehaviorListStudents };