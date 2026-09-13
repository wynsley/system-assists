import { BannerBehaviorAssistant } from "../../organims/behaviorControl/BannerBehaviorAssitant";
import { CardsScales } from "../../organims/behaviorControl/cardsBehaviorScales";
import { MyTemplate } from "../../templates/myTemplate";
import { BehaviorListStudents } from "../../organims/behaviorControl/behaviorListStudents";
import { BehaviorRecords } from "../../organims/behaviorControl/behaviorRecords";
import { useBehavior } from "../../../hooks/hooksAssistant/useBehavior";
import { behavior_scale_style } from "../../../config/assistant/behavior";
import { useIncident } from "../../../hooks/hooksAssistant/useIncidents";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";
import { useAcademicPeriod } from "../../../hooks/hoocksAdmin/useAcademicPeriod";

function BehaviorControlPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    section: "",
    search: "",
    idPeriod: null,
  })

  const debouncedSearch = useDebounce(filters.search, 400);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const { periods, currentPeriod, fetchCurrentPeriod } = useAcademicPeriod();

  useEffect(() => {
    fetchCurrentPeriod().then((current) => {
      if (current) setSelectedPeriod(current.idPeriod);
    });
  }, [fetchCurrentPeriod]);

  const {
    rows: students,
    behaviorSummary,
    loading: behaviorLoading,
    calificar,
    isFetching,
    message,
    refetch: refechtBehavior
  } = useBehavior({
    fetchBehavior: true,
    fetchRoster: true,
    grade: filters.grade,
    section: filters.section,
    search: debouncedSearch,
    idPeriod: selectedPeriod,
  });

  const {
    rows: incidentList,
    loading: incidentLoading,
    createIncident,
  } = useIncident({
    startDate: selectedDate || undefined,
    endDate: selectedDate || undefined,
    search: filters.search,
  })

  const isCurrentPeriod = selectedPeriod === currentPeriod?.idPeriod;
  // POrcentaje de calificaiones del comportamiento

  const behaviorScales = behaviorSummary ? [
    {
      name: "AD",
      description: "Logro Destacado",
      progress: behaviorSummary.AD ?? 0,
      className: behavior_scale_style.primary.AD
    },
    {
      name: "A",
      description: "Logro Esperado",
      progress: behaviorSummary.A ?? 0,
      className: behavior_scale_style.primary.A
    },
    {
      name: "B",
      description: "En Proceso",
      progress: behaviorSummary.B ?? 0,
      className: behavior_scale_style.primary.B
    },
    {
      name: "C",
      description: "En Inicio",
      progress: behaviorSummary.C ?? 0,
      className: behavior_scale_style.primary.C
    },
  ] : [];

  return (
    <MyTemplate>
      <BannerBehaviorAssistant />
      <CardsScales
        behaviorStatics={behaviorScales}
        loading={behaviorLoading}
      />
      {message && (
        <div className="bg-yellow-50 border mt-4 border-yellow-300 text-yellow-800 rounded-md 
        p-3 text-sm w-[80%] md:w-[70%] md:max-w-7xl mx-auto">
          {message}
        </div>
      )}
      <BehaviorListStudents
        students={students}
        calificar={calificar}
        canCalificar ={isCurrentPeriod && !message}
        createIncident={createIncident}
        filters={filters}
        setFilters={setFilters}
        loading={behaviorLoading}
        periods={periods}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        isFetching={isFetching}
        refechtBehavior = {refechtBehavior}
      />
        
      <BehaviorRecords
        incidentList = {incidentList}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

    </MyTemplate>
  )
}

export { BehaviorControlPage }