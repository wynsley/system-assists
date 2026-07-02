import { TitleAndIcon } from "../../molecules/titleAndIcon"
import { HiAcademicCap } from "react-icons/hi2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Table } from "../tableReusable";
import { GENDER_LABELS, STATUS_LABELS, STATUS_BADGE_COLORS } from "../../../config/studentLabels";
import { PaginationStudents } from "../../molecules/adminRegisters/paginationStudents";
//Hooks
import { useState } from "react";
import { useStudents } from "../../../hooks/hoocksAdmin/useStudents";
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useConfirm } from "../../../hooks/hoocksAdmin/useConfirmDelete";
import { StudentFilters } from "../../molecules/adminRegisters/filterStudents";
//Modals
import { ModalRegisterStudent } from "../../modals/adminRegisters/modalRegisterStudents";
import { ModalConfirm } from "../../modals/adminRegisters/modalConfirmDelete";

function ListStudents() {
  const title = 'ESTUDIANTES'
  const headers = [
    "Nombre", "DNI", "Sexo",
    "Teléfono", "Correo", "Estado", "Acciones"
  ]

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);
  const { config, confirm, closeConfirm } = useConfirm();

  const { students, total, loading, error, deleteStudent, refetch } = useStudents({
    page,
    limit: 10,
    status: status || undefined,
    gender: gender || undefined,
    search: debouncedSearch || undefined,
  });

  const { openRowId, openRow, closeRow } = useRowToggle();
  const { showToast } = useToast();

  //obtenemos el id del estudiante para editar
  const editingStudent = students.find((s) => s.idStudent === openRowId) ?? null;

  //indetificar fila en actividad
  const handleEdit = (student) => openRow(student.idStudent);
  //hook eliminar estudiante
  const handleDelete = (student) => {
    confirm({
      title: `¿Eliminar a ${student.firstname} ${student.lastname}?`,
      description: "Esta acción no se puede deshacer. El estudiante será eliminado permanentemente del sistema.",
      onConfirm: async () => {
        await deleteStudent(student.idStudent);
        showToast("Estudiante eliminado correctamente", "success");
      },
    });
  };

  const renderRow = (student, index) => {
    const isActive = openRowId === student.idStudent;
    return (
      <tr
        key={student.idStudent ?? index}
        className={`
          border-b border-gray-100 transition-colors
          ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}
        `}
      >
        <td className="px-6 py-4 whitespace-nowrap font-medium">
          {student.firstname} {student.lastname}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{student.dni}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          {GENDER_LABELS[student.gender] ?? student.gender}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{student.phone || "—"}</td>
        <td className="px-6 py-4 whitespace-nowrap">{student.email || "—"}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 rounded-full text-xs ${STATUS_BADGE_COLORS[student.status] ?? "bg-gray-100 text-gray-700"}`}>
            {STATUS_LABELS[student.status] ?? student.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEdit(student)}
              className="text-blue-700 hover:underline"
              title="Editar"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(student)}
              className="text-red-600 hover:underline"
              title="Eliminar"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="my-10 flex flex-col gap-5 w-[96%] md:w-[90%] md:max-w-7xl mx-auto">
      <TitleAndIcon
        icon={HiAcademicCap}
        title={title}
        level='h3'
        weight='bold'
        sizeIcon={30}
      />

      <StudentFilters
        search={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        status={status}
        onStatusChange={(value) => { setStatus(value); setPage(1); }}
        gender={gender}
        onGenderChange={(value) => { setGender(value); setPage(1); }}
      />

      {error && <span className="text-sm text-red-600">{error}</span>}

      {loading ? (
        <p className="text-center text-gray-500 py-10">Cargando estudiantes...</p>
      ) : (
        <>
          <Table
            headers={headers}
            data={students}
            renderRow={renderRow}
            emptyMessage="No se encontraron estudiantes"
          />
          <PaginationStudents
            total={total}
            setPage={setPage}
            page={page}
            students={students}
          />
        </>
      )}

      {editingStudent && (
        <ModalRegisterStudent
          mode="edit"
          initialData={editingStudent}
          closeModal={closeRow}
          onSuccess={refetch}
        />
      )}

      {config && (
        <ModalConfirm
          title={config.title}
          description={config.description}
          onConfirm={config.onConfirm}
          closeModal={closeConfirm}
        />
      )}
    </div>
  )
}

export { ListStudents }