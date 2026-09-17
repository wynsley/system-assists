import { Button } from "../../atoms/button";
import { Title } from "../../atoms/title";
import { Table } from "../tableReusable";

const DATE_FILTERS = [
  { label: "Semana", value: "WEEK" },
  { label: "Bimestre", value: "BIMESTER" },
  { label: "Año", value: null },
];

const GRADE_STYLES = {
  AD: "bg-green-100 text-green-700",
  A: "bg-blue-100 text-blue-700",
  B: "bg-yellow-100 text-yellow-700",
  C: "bg-red-100 text-red-700",
};

function DeltaBadge({ delta }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 font-semibold text-sm">
        +{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-sm">
        {delta}
      </span>
    );
  }
  return <span className="text-gray-400 font-semibold text-sm">0</span>;
}

function IncidentStudentList({ history, total, period, setPeriod, page, setPage, loading }) {
  return (
    <section className="w-[96%]  md:px-0 md:max-w-7xl mx-auto mt-10 flex flex-col gap-3">
      <Title
          text="HISTORIAL DEL REGISTRO DE INCIDENTES"
          level="h3"
          weight="bold"
          variant="secondary"
        />
      <div className="flex gap-3 md:gap-6 justify-between md:justify-end w-full  rounded-md px-3">

        {DATE_FILTERS.map((filter) => (
          <Button
            key={filter.label}
            text={filter.label}
            variant={period === filter.value ? "base" : "ternary"}
            onClick={() => setPeriod(filter.value)}
          />
        ))}
      </div>

      <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <Table
          headers={["Fecha", "Calificación", "Puntos", "Observaciones", "Auxiliar"]}
          data={history}
          emptyMessage="No hay historial de comportamiento para este período"
          renderRow={(item) => (
            <tr
              key={item.idHistory}
              className="border-b border-borderC/20 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                {new Date(item.date).toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>

              <td className="px-6 py-4">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${GRADE_STYLES[item.scale] ?? ""}`}>
                  {item.scale}
                </span>
              </td>

              {/* PUNTOS: nota anterior -> nota nueva + el cambio */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">
                    {item.previousScore} → <span className="font-bold">{item.score}</span>
                  </span>
                  <DeltaBadge delta={item.delta} />
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {item.description}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {item.auxiliar ?? "—"}
              </td>
            </tr>
          )}
        />
      </div>
    </section>
  );
}

export { IncidentStudentList };