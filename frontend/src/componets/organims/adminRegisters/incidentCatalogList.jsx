import { FaEdit, FaTrash } from "react-icons/fa";
import { TitleAndIcon } from "../../molecules/titleAndIcon";
import { MdWarningAmber } from "react-icons/md";

function IncidentCatalogList({ loadingCatalog, catalog, handleEditType, handleDeleteType }) {
  return (
    <div className="flex flex-col gap-4">
      <TitleAndIcon icon={MdWarningAmber} title="TIPOS DE INCIDENTE" level="h3" weight="bold" sizeIcon={24} />

      {loadingCatalog ? (
        <p className="text-gray-500 text-sm py-4">Cargando tipos de incidente...</p>
      ) : catalog.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay tipos de incidente registrados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {catalog.map((item) => (
            <div key={item.idIncidentCatalog} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue text-base">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditType(item)} className="text-blue-400 hover:text-blue-600" title="Editar">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDeleteType(item)} className="text-red-400 hover:text-red-600" title="Eliminar">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <span className="text-xs text-gray-500">{item.description}</span>
              <span className={`text-xs font-medium ${item.type === "POSITIVO" ? "text-green-600" : "text-red-600"}`}>
                {item.type === "POSITIVO" ? "+" : "-"}{item.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { IncidentCatalogList };