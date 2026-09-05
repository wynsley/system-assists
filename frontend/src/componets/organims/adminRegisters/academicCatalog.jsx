import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { Table } from "../tableReusable";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
// Modals
import { ModalConfirm } from "../../modals/adminRegisters/modalConfirmDelete";
import { ModalCreateClassroom } from "../../modals/adminRegisters/ModalCreateClassroom";
// Hooks
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useConfirm } from "../../../hooks/hoocksAdmin/useConfirmDelete";
import { useModal } from "../../../hooks/hookModal/useModal";
// Components
import { GradeAndSeccions } from "./listGradesAndSections";
import { Paginations } from "../../molecules/adminRegisters/Paginations";
import { Filters } from "../../molecules/adminRegisters/filters";

function AcademicCatalog({
  classroomHook,
  page,
  setPage,
  search,
  setMySearch,
  yearFilter,
  setYearFilter,
  gradeFilter,
  setGradeFilter,
  sectionFilter,
  setSectionFilter,
}) {
  // HOOKS
  const [editingClassroom, setEditingClassroom] = useState(null);
  const { showToast } = useToast();
  const {
    config,
    confirm,
    closeConfirm,
  } = useConfirm();

  const editClassroomModal = useModal();

  // DATA DEL HOOK
  const {
    classrooms,
    years,
    grades,
    sections,
    total: totalClassrooms,
    loading: loadingClassrooms,
    deleteClassroom,
    deleteGrade,
    deleteSection,
    refetchClassrooms,
    refetchCatalogs,
  } = classroomHook;

  const sectionsForFilter = (() => {
    const filtered = gradeFilter
      ? sections.filter((s) => String(s.idGrade) === String(gradeFilter))
      : sections;

    const uniqueByName = Array.from(
      new Map(filtered.map((s) => [s.section, s])).values()
    );

    return uniqueByName.sort((a, b) => a.section.localeCompare(b.section));
  })();

  // SECCIONES POR GRADO
  const getSectionsForGrade = (idGrade) => {
    return sections.filter(
      (section) => section.idGrade === idGrade
    );
  };

  // ELIMINAR GRADO
  const handleDeleteGrade = (grade) => {
    const sects = getSectionsForGrade(
      grade.idGrade
    );

    if (sects.length > 0) {
      showToast(
        "Elimina primero las secciones de este grado",
        "error"
      );
      return;
    }
    confirm({
      title: `¿Eliminar ${grade.level}° grado?`,
      description:
        "Esta acción no se puede deshacer. Se eliminará el grado permanentemente.",
      onConfirm: async () => {
        try {
          await deleteGrade(grade.idGrade);
          showToast(
            "Grado eliminado correctamente",
            "success"
          );
        } catch (error) {
          showToast(
            error.message ||
            "No se pudo eliminar el grado",
            "error"
          );
        }
      },
    });
  };

  // ELIMINAR SECCIÓN

  const handleDeleteSection = (section) => {
    confirm({
      title: `¿Eliminar sección ${section.grade}° ${section.section}?`,
      description:
        "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          await deleteSection(
            section.idSection
          );
          showToast(
            "Sección eliminada correctamente",
            "success"
          );
        } catch (error) {
          showToast(
            error.message ||
            "No se pudo eliminar la sección",
            "error"
          );
        }
      },
    });
  };

  // ELIMINAR AULA
  const handleDeleteClassroom = (classroom) => {
    confirm({
      title: `¿Eliminar aula ${classroom.year} - ${classroom.grade}° ${classroom.section}?`,
      description:
        "Se eliminará el aula y sus relaciones con estudiantes.",
      onConfirm: async () => {
        try {
          await deleteClassroom(
            classroom.idClassroom
          );

          showToast(
            "Aula eliminada correctamente",
            "success"
          );
        } catch (error) {
          showToast(
            error.message ||
            "No se pudo eliminar el aula",
            "error"
          );
        }
      },
    });
  };

  // EDITAR AULA
  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    editClassroomModal.openModal();
  };

  // HEADERS
  const classroomHeaders = [
    "Año",
    "Grado",
    "Sección",
    "Acciones",
  ];

  // FILA
  const renderClassroomRow = (
    classroom,
    index
  ) => (
    <tr
      key={classroom.idClassroom ?? index}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4">
        {classroom.year}
      </td>
      <td className="px-6 py-4">
        {classroom.grade}°
      </td>
      <td className="px-6 py-4">
        {classroom.section}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              handleEditClassroom(classroom)
            }
            className="text-blue-700 hover:underline"
            title="Editar"
          >
            <FaEdit size={16} />
          </button>

          <button
            onClick={() =>
              handleDeleteClassroom(classroom)
            }
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

      {/*GRADOS Y SECCIONES*/}

      <GradeAndSeccions
        loadingGrades={loadingClassrooms}
        loadingSections={loadingClassrooms}
        grades={grades}
        getSectionsForGrade={
          getSectionsForGrade
        }
        handleDeleteGrade={
          handleDeleteGrade
        }
        handleDeleteSection={
          handleDeleteSection
        }
      />

      {/*AULAS*/}

      <div className="flex flex-col gap-4">

        <TitleAndIcon
          icon={MdMeetingRoom}
          title="AULAS"
          level="h3"
          weight="bold"
          sizeIcon={24}
        />

        {/* FILTROS*/}

        <Filters
          search={search}
          onSearchChange={(value) => {
            setMySearch(value);
            setPage(1);
          }}
          searchPlaceholder="Buscar aula...."
          selects={[
            {
              name: "year",
              value: yearFilter,
              onChange: (value) => {
                setYearFilter(value);
                setPage(1);
              },
              placeholder: "Año",
              data: years,
              valueKey: "idYear",
              labelKey: "year",
            },

            {
              name: "grade",
              value: gradeFilter,
              onChange: (value) => {
                setGradeFilter(value);
                setPage(1);
              },
              placeholder: "Grado",
              data: grades,
              valueKey: "idGrade",
              labelKey: "level",
            },

            {
              name: "section",
              value: sectionFilter,
              onChange: (value) => {
                setSectionFilter(value);
                setPage(1);
              },
              placeholder: "Sección",
              data: sectionsForFilter,
              valueKey: "section",
              labelKey: "section",
            },
          ]}
        />

        {/*TABLA*/}
        {loadingClassrooms ? (
          <p className="text-gray-500 text-sm py-4">
            Cargando aulas...
          </p>
        ) : (
          <>
            <Table
              headers={classroomHeaders}
              data={classrooms}
              renderRow={
                renderClassroomRow
              }
              emptyMessage="No hay aulas registradas aún"
            />
            <Paginations
              total={totalClassrooms}
              page={page}
              setPage={setPage}
              amount={classrooms}
            />
          </>
        )}
      </div>

      {/* MODAL CONFIRMACIÓN*/}
      {config && (
        <ModalConfirm
          title={config.title}
          description={
            config.description
          }
          onConfirm={
            config.onConfirm
          }
          closeModal={closeConfirm}
          variant={
            config.variant ?? "danger"
          }
        />
      )}

      {/* MODAL EDITAR AULA*/}
      {editClassroomModal.isOpen &&
        editingClassroom && (
          <ModalCreateClassroom
            mode="edit"
            initialData={
              editingClassroom
            }
            closeModal={
              editClassroomModal.closeModal
            }
            onSuccess={
              refetchClassrooms
            }
          />
        )}
    </div>
  );
}

export { AcademicCatalog };