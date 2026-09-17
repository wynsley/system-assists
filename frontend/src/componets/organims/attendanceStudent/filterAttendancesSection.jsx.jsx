import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { IoTime, IoCheckmarkDoneCircle } from "react-icons/io5";
import { FilterAttendances } from "../../molecules/attendanceStudent/filtersAttendances";
import { Table } from "../tableReusable";
import { Button } from "../../atoms/button";

const STATUS_BADGE = {
  PRESENTE: (
    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
      <FaCheckCircle size={14} /> Presente
    </span>
  ),
  FALTA: (
    <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold text-sm">
      <FaTimesCircle size={14} /> Ausente
    </span>
  ),
  TARDANZA: (
    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold text-sm">
      <IoTime size={14} /> Tardanza
    </span>
  ),
  JUSTIFICADA: (
    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
      <IoCheckmarkDoneCircle size={14} /> Justificada
    </span>
  ),
};

function FiltersAttendancesSection({
  rows,
  counts,
  total,
  page,
  setPage,
  limit,
  status,
  setStatus,
  period,
  setPeriod,
  loading,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="w-[96%] md:max-w-7xl mx-auto py-8 space-y-8">
      <FilterAttendances
        statusFilter={status}
        setStatusFilter={setStatus}
        periodFilter={period}
        setPeriodFilter={setPeriod}
        counts={counts}
      />

      <div className={`min-h-[400px] ${loading ? "opacity-60 transition-opacity" : "transition-opacity"}`}>
        <Table
          headers={["Fecha", "Estado", "Hora llegada"]}
          data={rows}
          emptyMessage="No hay asistencias disponibles"
          renderRow={(attendance) => (
            <tr
              key={attendance.idAttendance ?? attendance.date}
              className="border-b border-borderC/20 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3 text-blueT text-[.8em] md:text-[1em]">
                  <FaCalendarAlt size={16} className="text-slate-400" />
                  <span>
                    {new Date(attendance.date).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </td>

              <td className="px-6 py-3">
                {STATUS_BADGE[attendance.status] ?? STATUS_BADGE.FALTA}
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-3 text-[#1f2a44]">
                  <FaClock size={16} className="text-slate-400" />
                  <span>{attendance.time ?? "—"}</span>
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      <div className="flex justify-center items-center gap-4 pt-2 min-h-[52px]">
        {totalPages > 1 && (
          <>
            <Button
              text="Anterior"
              variant="ternary"
              disabled={page <= 1} 
              onClick={() => setPage((p) => p - 1)} 
              className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-40"
            />
            <span className="text-sm text-gray-500 font-bold">Página {page} de {totalPages}</span>
            <Button
              text='Siguiente'
              variant="ternary"
              disabled={page >= totalPages} 
              onClick={() => setPage((p) => p + 1)} 
              className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-40"
            />
          </>
        )}
      </div>
    </section>
  );
}

export { FiltersAttendancesSection };