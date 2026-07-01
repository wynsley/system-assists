import { IoSearch } from "react-icons/io5";
import { STATUS_LABELS, GENDER_LABELS } from "../../../config/studentLabels";
import { Select } from "../../atoms/select";
import { object } from "joi";

function StudentFilters({ search, onSearchChange, status, onStatusChange, gender, onGenderChange }) {
  return (
    <div className=" flex flex-col flex-wrap  sm:flex-row gap-3 items-center justify-end">
      <div className="relative w-full sm:w-64">
        <IoSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Nombre o DNI..."
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
      <div className="flex items-center gap-3">
          <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        variant="primary"
        options={[
          {value: '' , text: 'Estados'},
          ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
            value,
            text:label,
          }))
        ]}
      />
      <Select
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        variant="primary"
        options={[
          {value: '' , text: 'Filtrar por sexo'},
          ...Object.entries(GENDER_LABELS).map(([value, label]) => ({
            value,
            text:label,
          }))
        ]}
      />
  
      </div>
    </div>
  );
}

export { StudentFilters };