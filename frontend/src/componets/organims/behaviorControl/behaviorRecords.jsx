import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle"
import { useStudentFilters } from "../../../hooks/hooksAssistant/useStudentFilters"
import { Title } from "../../atoms/title"
import { Table } from "../tableReusable"
import { Search } from "../../molecules/search"

function BehaviorRecords({ incidentList }) {
  const title = "HISTORIAL DE REGISTROS"
  //hook filtros y buscadores
  const {
    search,
    setSearch,
    filtered,
  } = useStudentFilters(incidentList)

  //controlar interaccion por fila
  const {
    openRowId,
    closeRow,
    openRow,
  } = useRowToggle();


  const headers = [
    "Fecha",
    "Estudiante",
    "Grado y Sección",
    "Incidente",
    "Descripción",
    "Puntos",
    "Registró",
  ]
  return (
    <section className="mt-6 w-[96%] md:w-[90%] md:max-w-7xl mx-auto
      flex flex-col gap-3
    ">
      <Title
        text={title}
        level="h3"
        weight="bold"
      />
      <Search
        search={search}
        setSearch={setSearch}
      />
      <Table
        headers={headers}
        emptyMessage="No hay registros disponibles"
        // mapear el historial de registros
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
                {student.behavior.date}
              </td>

              <td className="px-6 py-4">
                {student.student}
              </td>

              <td className="px-6 py-4">
                {student.grade} {student.section}
              </td>
              <td className="px-6 py-4 text-sm">
                {student.behavior.behaviorGrade}
              </td>

              <td className="px-6 py-4">
                <DespliegueDescription
                  behavior={student}
                  openRowId={openRowId}
                  openRow={openRow}
                  closeRow={closeRow}
                />
              </td>
              <td className="px-6 py-4 relative">
              </td>
              <td className="px-6 py-4 relative">
              </td>
            </tr>
          );
        }}
      />
    </section>
  )
}

export { BehaviorRecords }