import { FaTrash } from "react-icons/fa";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
import { HiAcademicCap } from "react-icons/hi2";

function GradeAndSeccions({
  loadingGrades,
  loadingSections,
  grades,
  getSectionsForGrade,
  handleDeleteGrade,
  handleDeleteSection,
  gradeSections
}) {
  return (
    <>
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
    </>
  )
}

export { GradeAndSeccions }