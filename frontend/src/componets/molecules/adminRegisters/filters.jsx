import { HiMagnifyingGlass } from "react-icons/hi2";
import { Select } from "../../atoms/select";

function Filters({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  selects = [],
}) {
  return (
    <div className="flex flex-col flex-wrap sm:flex-row gap-3 items-center justify-end w-full">

      {/* BUSCADOR */}
      <div className="relative w-full sm:w-64">
        <HiMagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder={searchPlaceholder}
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

      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-3">
        {selects.map((select, index) => {

          let options = [];

          // Si data es un objeto:
          // { admin: "Administrador", docente: "Docente" }
          if (select.data && !Array.isArray(select.data)) {
            options = Object.entries(select.data).map(
              ([value, text]) => ({
                value,
                text,
              })
            );
          }

          // Si data es un array:
          // [{ id: 1, name: "Primero" }]
          if (Array.isArray(select.data)) {
            options = select.data.map((item) => ({
              value: item[select.valueKey],
              text: item[select.labelKey],
            }));
          }

          return (
            <Select
              key={select.name || index}
              value={select.value}
              onChange={(e) => select.onChange(e.target.value)}
              variant="primary"
              options={[
                {
                  value: "",
                  text: select.placeholder || "Seleccionar",
                },
                ...options,
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}

export { Filters };