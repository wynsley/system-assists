import { IoSearch } from "react-icons/io5";
import { GENDER_LABELS, STATUS_LABELS, } from "../../../config/studentLabels";

function StudentFilters({ search, onSearchChange, status, onStatusChange, gender, onGenderChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative w-full sm:w-64">
        <IoSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, DNI..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
                  w-full pl-9 pr-4 py-2.5
                  rounded-md border border-borderC
                  bg-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue/20
                "
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2"
      >
        <option value="">Todos los estados</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2"
      >
        <option value="">Todos los sexos</option>
        {Object.entries(GENDER_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export { StudentFilters };