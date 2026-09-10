import { useState, useMemo } from "react";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { Title } from "../../atoms/title";
import { Table } from "../tableReusable";
import { Search } from "../../molecules/search";

function BehaviorRecords({ incidentList = [], selectedDate, setSelectedDate }) {
  const title = "HISTORIAL DE REGISTROS";
  const [search, setSearch] = useState("");

  const { openRowId, closeRow, openRow } = useRowToggle();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return incidentList.filter((incident) => {
      if (!term) return true;
      return (
        incident.student?.fullname?.toLowerCase().includes(term) ||
        incident.incidentName?.toLowerCase().includes(term) ||
        incident.auxiliar?.fullname?.toLowerCase().includes(term)
      );
    });
  }, [incidentList, search]);

  const headers = [
    "Fecha",
    "Estudiante",
    "Grado y Sección",
    "Incidente",
    "Descripción",
    "Puntos",
    "Registró",
  ];

  return (
    <section className="mt-6 w-[96%] md:w-[90%] md:max-w-7xl mx-auto flex flex-col gap-3">
      <Title text={title} level="h3" weight="bold" />

      <div className="flex items-center justify-between gap-3 w-full">
        <Search 
          search={search} 
          setSearch={setSearch} 
          className="w-auto"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto shrink-0 p-2 rounded-md border border-borderC bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <Table
        headers={headers}
        emptyMessage="No hay registros disponibles"
        data={filtered}
        renderRow={(incident) => {
          const isActive = openRowId === incident.idIncident;
          const isPositive = incident.incidentType === "POSITIVO";

          return (
            <tr
              key={incident.idIncident}
              className={`
                border-b border-gray-100
                transition-colors duration-300
                ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}
              `}
            >
              <td className="px-6 py-4">
                {new Date(incident.date).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                {incident.student?.fullname ?? "—"}
              </td>

              <td className="px-6 py-4">
                {incident.student?.grade}° {incident.student?.section}
              </td>

              <td className="px-6 py-4 text-sm">
                {incident.incidentName}
              </td>

              <td className="px-6 py-4 text-sm">
                {incident.note || "—"}
              </td>

              <td className={`px-6 py-4 font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : "-"}{incident.points}
              </td>

              <td className="px-6 py-4">
                {incident.auxiliar?.fullname ?? "—"}
              </td>
            </tr>
          );
        }}
      />
    </section>
  );
}

export { BehaviorRecords };