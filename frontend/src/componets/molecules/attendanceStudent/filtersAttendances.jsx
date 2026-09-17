import { GrFilter } from "react-icons/gr";
import { TitleIconLink } from "../titleIconLink";

function FilterAttendances({
  statusFilter,
  setStatusFilter,
  periodFilter,
  setPeriodFilter,
  counts,
}) {
  const title = "FILTRAR POR ESTADO";

  return (
    <div className="bg-white border border-borderC rounded-md p-6">
      <TitleIconLink title={title} icon={GrFilter} />

      {/* DESKTOP */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-5 py-3 rounded-2xl font-semibold transition ${
            statusFilter === null
              ? "bg-[#003347] text-white"
              : "bg-gray-100 text-[#1f2a44] hover:bg-gray-200"
          }`}
        >
          Todos ({counts?.total ?? 0})
        </button>

        <button
          onClick={() => setStatusFilter("PRESENTE")}
          className={`px-5 py-3 rounded-2xl font-semibold transition ${
            statusFilter === "PRESENTE"
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-[#1f2a44] hover:bg-gray-200"
          }`}
        >
          Presentes ({counts?.present ?? 0})
        </button>

        <button
          onClick={() => setStatusFilter("FALTA")}
          className={`px-5 py-3 rounded-2xl font-semibold transition ${
            statusFilter === "FALTA"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-[#1f2a44] hover:bg-gray-200"
          }`}
        >
          Ausentes ({counts?.absent ?? 0})
        </button>

        <button
          onClick={() => setStatusFilter("TARDANZA")}
          className={`px-5 py-3 rounded-2xl font-semibold transition ${
            statusFilter === "TARDANZA"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 text-[#1f2a44] hover:bg-gray-200"
          }`}
        >
          Tardanzas ({counts?.late ?? 0})
        </button>

        <select
          value={periodFilter ?? ""}
          onChange={(e) => setPeriodFilter(e.target.value || null)}
          className="bg-gray-100 text-[#1f2a44] px-5 py-3 rounded-2xl font-semibold outline-none cursor-pointer hover:bg-gray-200 transition"
        >
          <option value="">Todo el histórico</option>
          <option value="WEEK">Semanal</option>
          <option value="BIMESTER">Bimestral</option>
          <option value="YEAR">Anual</option>
        </select>
      </div>

      {/* MOBILE */}
      <div className="flex md:hidden gap-3 mt-4">
        <select
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="w-full bg-gray-100 text-[#1f2a44] px-5 py-3 rounded-2xl font-semibold outline-none"
        >
          <option value="">Todos ({counts?.total ?? 0})</option>
          <option value="PRESENTE">Presentes ({counts?.present ?? 0})</option>
          <option value="FALTA">Ausentes ({counts?.absent ?? 0})</option>
          <option value="TARDANZA">Tardanzas ({counts?.late ?? 0})</option>
        </select>

        <select
          value={periodFilter ?? ""}
          onChange={(e) => setPeriodFilter(e.target.value || null)}
          className="w-full bg-gray-100 text-[#1f2a44] px-5 py-3 rounded-2xl font-semibold outline-none"
        >
          <option value="">Todo el histórico</option>
          <option value="WEEK">Semanal</option>
          <option value="BIMESTER">Bimestral</option>
          <option value="YEAR">Anual</option>
        </select>
      </div>
    </div>
  );
}

export { FilterAttendances };