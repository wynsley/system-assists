import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { Table } from "../tableReusable";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
//Modals
import { ModalConfirm } from "../../modals/adminRegisters/modalConfirmDelete";
import { ModalCreateClassroom } from "../../modals/adminRegisters/ModalCreateClassroom";
//hooks
import { useState } from "react";
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useConfirm } from "../../../hooks/hoocksAdmin/useConfirmDelete";
import { GradeAndSeccions } from "./listGradesAndSecctions";
import { useModal } from "../../../hooks/hookModal/useModal";

function AcademicCatalog({
  gradesHook,
  sectionsHook,
  classroomHook
}) {
  const { showToast } = useToast();
  const { config, confirm, closeConfirm } = useConfirm();
  const editClassroomModal = useModal();
  const [editingClassroom, setEditingClassroom] = useState(null);

  const { 
    grades, 
    loading: loadingGrades, 
    deleteGrade, 
    refetch: refetchGrades } = gradesHook;

  const { 
    sections, 
    loading: loadingSections, 
    deleteSection, 
    refetch: refetchSections } = sectionsHook;

  const { 
    classrooms, 
    total: totalClassrooms, 
    loading: loadingClassrooms, 
    eleteClassroom, 
    refetch: refetchClassrooms } = classroomHook;

  const getSectionsForGrade = (idGrade) =>
    sections.filter((s) => s.idGrade === idGrade);

  const handleDeleteGrade = (grade) => {
    const sects = getSectionsForGrade(grade.idGrade);
    if (sects.length > 0) {
      showToast("Elimina primero las secciones de este grado", "error");
      return;
    }
    confirm({
      title: `¿Eliminar ${grade.level}° grado?`,
      description: "Esta acción no se puede deshacer. Se eliminará el grado permanentemente.",
      onConfirm: async () => {
        await deleteGrade(grade.idGrade);
        showToast("Grado eliminado correctamente", "success");
      },
    });
  };

  const handleDeleteSection = (section) => {
    confirm({
      title: `¿Eliminar sección ${section.grade}° ${section.section}?`,
      description: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        await deleteSection(section.idSection);
        showToast("Sección eliminada correctamente", "success");
      },
    });
  };

  const handleDeleteClassroom = (classroom) => {
    confirm({
      title: `¿Eliminar aula ${classroom.year} - ${classroom.grade}° ${classroom.section}?`,
      description: "Se eliminará el aula y sus relaciones con estudiantes.",
      onConfirm: async () => {
        await deleteClassroom(classroom.idClassroom);
        showToast("Aula eliminada correctamente", "success");
      },
    });
  };
  
  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    editClassroomModal.openModal();
  };
  //headers de la tabla aulas
  const classroomHeaders = ["Año", "Grado", "Sección", "Acciones"];

  const renderClassroomRow = (classroom, index) => (
    <tr
      key={classroom.idClassroom ?? index}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4">{classroom.year}</td>
      <td className="px-6 py-4">{classroom.grade}°</td>
      <td className="px-6 py-4">{classroom.section}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEditClassroom(classroom)}
            className="text-blue-700 hover:underline"
            title="Editar"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClassroom(classroom)}
            className="text-red-600 hover:underline"
            title="Eliminar"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="mt-8 flex flex-col gap-8 w-[96%] md:w-[90%] md:max-w-7xl mx-auto">

      {/* GRADOS Y SECCIONES */}
      <GradeAndSeccions
        loadingGrades={loadingGrades}
        loadingSections={loadingSections}
        grades={grades}
        getSectionsForGrade={getSectionsForGrade}
        handleDeleteGrade={handleDeleteGrade}
        handleDeleteSection={handleDeleteSection}
      />
      {/* AULAS */}
      <div className="flex flex-col gap-4">
        <TitleAndIcon
          icon={MdMeetingRoom}
          title="AULAS"
          level="h3"
          weight="bold"
          sizeIcon={24}
        />

        {loadingClassrooms ? (
          <p className="text-gray-500 text-sm py-4">Cargando aulas...</p>
        ) : (
          <>
            <Table
              headers={classroomHeaders}
              data={classrooms}
              renderRow={renderClassroomRow}
              emptyMessage="No hay aulas registradas aún"
            />
            <span className="text-sm text-gray-500">Total: {totalClassrooms}</span>
          </>
        )}
      </div>

      {/* Modal confirmación */}
      {config && (
        <ModalConfirm
          title={config.title}
          description={config.description}
          onConfirm={config.onConfirm}
          closeModal={closeConfirm}
          variant={config.variant ?? "danger"}
        />
      )}

      {/* Modal editar aula */}
      {editClassroomModal.isOpen && editingClassroom && (
        <ModalCreateClassroom
          mode="edit"
          initialData={editingClassroom}
          closeModal={editClassroomModal.closeModal}
          onSuccess={refetchClassrooms}
        />
      )}
    </div>
  );
}

export { AcademicCatalog };