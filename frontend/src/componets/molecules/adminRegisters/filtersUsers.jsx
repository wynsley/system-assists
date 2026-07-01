import { ROLE_LABELS } from "../../../config/roleLabels";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Select } from "../../atoms/select";
import { object } from "joi";

function UserFilters({ search, onSearchChange, role, onRoleChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-end w-full">
      <div className="relative">
        <HiMagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Buscar Usuario..."
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

      <Select
        value={role}
        variant="primary"
        onChange={(e) => onRoleChange(e.target.value)}
        options={[
          { value: "", text: "Roles" },
          ...Object.entries(ROLE_LABELS).map(([value, label]) => ({
            value,
            text: label,
          })),
        ]}
      />
    </div>
  );
}

export { UserFilters };