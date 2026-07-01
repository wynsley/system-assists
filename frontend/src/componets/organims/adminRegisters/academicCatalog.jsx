import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi2";
import { MdMeetingRoom } from "react-icons/md";
import { Table } from "../tableReusable";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
//hooks
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useSections } from "../../../hooks/hoocksAdmin/useSections";
import { useClassrooms } from "../../../hooks/hoocksAdmin/useClassroom";

function AcademicCatalog() {
  const { showToast } = useToast();

  const { grades, loading: loadingGrades, deleteGrade } = useGrades({ limit: 10 });
  const { sections, loading: loadingSections, deleteSection } = useSections({ limit: 50 });
  const { classrooms, total: totalClassrooms, loading: loadingClassrooms, deleteClassroom } = useClassrooms({ limit: 20 });

  // Para cada grado, filtra sus secciones
  const getSectionsForGrade = (idGrade) =>
    sections.filter((s) => s.idGrade === idGrade);

  const handleDeleteGrade = async (grade) => {
    const sects = getSectionsForGrade(grade.idGrade);
    if (sects.length > 0) {
      showToast("Elimina primero las secciones de este grado", "error");
      return;
    }
    if (!window.confirm(`¿Eliminar el grado ${grade.level}°?`)) return;
    try {
      await deleteGrade(grade.idGrade);
      showToast("Grado eliminado correctamente", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteSection = async (section) => {
    if (!window.confirm(`¿Eliminar la sección ${section.grade}° ${section.section}?`)) return;
    try {
      await deleteSection(section.idSection);
      showToast("Sección eliminada correctamente", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteClassroom = async (classroom) => {
    if (!window.confirm(`¿Eliminar el aula ${classroom.year} - ${classroom.grade}° ${classroom.section}?`)) return;
    try {
      await deleteClassroom(classroom.idClassroom);
      showToast("Aula eliminada correctamente", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

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
          <button className="text-blue-700 hover:underline" title="Editar">
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

      {/* SECCIÓN: GRADOS Y SECCIONES */}
      <div className="flex flex-col gap-4">
        <TitleAndIcon
          icon={HiAcademicCap}
          title="GRADOS Y SECCIONES"
          level="h3"
          weight="bold"
          sizeIcon={24}
        />

        {loadingGrades || loadingSections ? (
          <p className="text-gray-500 text-sm py-4">Cargando grados y secciones...</p>
        ) : grades.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay grados registrados aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grades.map((grade) => {
              const gradeSections = getSectionsForGrade(grade.idGrade);
              return (
                <div
                  key={grade.idGrade}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
                >
                  {/* Header de la card */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue text-lg">
                      {grade.level}° Grado
                    </span>
                    <button
                      onClick={() => handleDeleteGrade(grade)}
                      className="text-red-400 hover:text-red-600"
                      title="Eliminar grado"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  {/* Secciones del grado */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Secciones ({gradeSections.length})
                    </span>
                    {gradeSections.length === 0 ? (
                      <span className="text-xs text-gray-300 italic">Sin secciones</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {gradeSections.map((s) => (
                          <div
                            key={s.idSection}
                            className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium"
                          >
                            {s.section}
                            <button
                              onClick={() => handleDeleteSection(s)}
                              className="text-blue-400 hover:text-red-500 ml-1"
                              title={`Eliminar sección ${s.section}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN: AULAS */}
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
    </div>
  );
}

export { AcademicCatalog };