import { TitleAndIcon } from "../../molecules/titleAndIcon";
import { HiUserGroup } from "react-icons/hi2";
import { FaExchangeAlt } from "react-icons/fa";
import { Table } from "../tableReusable";
import { GENDER_LABELS } from "../../../config/studentLabels";
//Hooks
import { useState, useMemo } from "react";
import { useClassroomRoster } from "../../../hooks/hoocksAdmin/useClassroomStudent";
import { useClassroomOptions } from "../../../hooks/hoocksAdmin/useClassroomOptions";
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";
import { useToast } from "../../../hooks/hookGlobals/useToast";
//Modals
import { ModalAssignClassroom } from "../../modals/adminRegisters/modalAssignClassroom";
import { Paginations } from "../../molecules/adminRegisters/Paginations";

function ClassroomRoster() {
  const title = "ESTUDIANTES POR AULA";
  const headers = ["Nombre", "Sexo", "Grado", "Sección", "Año", "Acciones"];

  const [search, setSearch] = useState("");
  const [reassigningStudent, setReassigningStudent] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const { classroomOptions } = useClassroomOptions();

  const {
    page,
    classroom,
    students,
    pagination,
    loading,
    error,
    goToPage,
    reassignStudent,
  } = useClassroomRoster({});

  const { showToast } = useToast();

  const filteredStudents = useMemo(() => {
    if (!debouncedSearch) return students;
    const term = debouncedSearch.toLowerCase();
    return students.filter((row) =>
      `${row.student.firstname} ${row.student.lastname}`.toLowerCase().includes(term) ||
      row.student.dni?.toLowerCase().includes(term)
    );
  }, [students, debouncedSearch]);

  const handleReassign = (row) => {
    setReassigningStudent({ ...row, currentClassroom: classroom });
  };

  const handleClassroomJump = (e) => {
    const opt = classroomOptions.find((c) => c.idClassroom === Number(e.target.value));
    if (!opt) return;
    goToPage(opt.pageIndex);
  };

  const renderRow = (row, index) => (
    <tr
      key={row.idClassroomStudent ?? index}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap font-medium">
        {row.student.firstname} {row.student.lastname}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {GENDER_LABELS[row.student.gender] ?? row.student.gender}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{row.grade}°</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.section}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.year}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => handleReassign(row)}
          className="text-blue-700 hover:underline"
          title="Cambiar de aula"
        >
          <FaExchangeAlt size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="my-10 flex flex-col gap-5 w-[96%] md:w-[90%] md:max-w-7xl mx-auto">
      <TitleAndIcon icon={HiUserGroup} title={title} level="h3" weight="bold" sizeIcon={30} />

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <select
          onChange={handleClassroomJump}
          defaultValue=""
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-64"
        >
          <option value="">Selecciona un aula...</option>
          {classroomOptions.map((c) => (
            <option key={c.idClassroom} value={c.idClassroom}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
        />
      </div>

      {error && <span className="text-sm text-red-600">{error}</span>}

      <div className="min-h-112 flex flex-col gap-3">
        {classroom && (
          <h4 className="font-semibold text-gray-700">
            {classroom.grade}° "{classroom.section}" — {classroom.year} ({filteredStudents.length} estudiantes)
          </h4>
        )}

        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          <Table
            headers={headers}
            data={filteredStudents}
            renderRow={renderRow}
            emptyMessage={search ? "Ningún estudiante coincide con la búsqueda" : "No hay estudiantes en esta aula"}
          />
        </div>

        <Paginations
          total={pagination.totalClassrooms}
          page={page}
          amount={students}
          setPage={goToPage}
          hasNextPage={page < pagination.totalPages}
          label="TOTAL AULAS"
        />
      </div>

      {reassigningStudent && (
        <ModalAssignClassroom
          student={reassigningStudent.student}
          currentClassroom={reassigningStudent.currentClassroom}
          idClassroomStudent={reassigningStudent.idClassroomStudent}
          closeModal={() => setReassigningStudent(null)}
          onAssign={async (idClassroomStudent, newIdClassroom) => {
            await reassignStudent(idClassroomStudent, newIdClassroom);
            showToast("Estudiante reasignado correctamente", "success");
          }}
        />
      )}
    </div>
  );
}

export { ClassroomRoster };