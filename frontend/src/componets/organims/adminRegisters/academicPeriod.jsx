import { FaEdit, FaTrash } from "react-icons/fa";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
import { BsCalendarRange } from "react-icons/bs";

function AcademicPeriods({
  loadingPeriods,
  periods,
  handleEditPeriod,
  handleDeletePeriod,
}) {
  return (
    <div className="flex flex-col gap-4">
      <TitleAndIcon
        icon={BsCalendarRange}
        title="BIMESTRES"
        level="h3"
        weight="bold"
        sizeIcon={24}
      />

      {loadingPeriods ? (
        <p className="text-gray-500 text-sm py-4">Cargando bimestres...</p>
      ) : periods.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay bimestres registrados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {periods.map((period) => (
            <div
              key={period.idPeriod}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue text-lg">
                  {period.bimester}° Bimestre
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPeriod(period)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Editar bimestre"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeletePeriod(period)}
                    className="text-red-400 hover:text-red-600"
                    title="Eliminar bimestre"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Año {period.year}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(period.startDate).toLocaleDateString()} — {new Date(period.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { AcademicPeriods };