import { BannerBehaviorAssistant } from "../../organims/behaviorControl/BannerBehaviorAssitant";
import { CardsScales } from "../../organims/behaviorControl/cardsBehaviorScales";
import { MyTemplate } from "../../templates/myTemplate";
import { BehaviorListStudents } from "../../organims/behaviorControl/behaviorListStudents";

import { useBehavior } from "../../../hooks/hooksAssistant/useBehavior";
import { behavior_scale_style } from "../../../config/assistant/behavior";
import { useIncident } from "../../../hooks/hooksAssistant/useIncidents";
import { useState } from "react";

function BehaviorControlPage () {

  const [filters, setFilters] = useState({
    grade: "",
    section: "",
    search: "",
    idPeriod: null,
  })
  const {
  rows : students,
  behaviorSummary,
  loading: behaviorLoading,
  calificar,
  getConsolidado
} = useBehavior({ 
  fetchBehavior: true, 
  fetchRoster: true,
  grade: filters.grade,
  section: filters.section,
  search: filters.search,
  idPeriod: filters.idPeriod,
});


const {
  rows : incidentList,
  total,
  loading: incidentLoading,
  error,
  createIncident,
} =useIncident({
  startDate: filters.startDate,
  endDate: filters.endDate,
  search: filters.search,
})

// POrcentaje de calificaiones del comportamiento

const behaviorScales = behaviorSummary ? [
  { 
    name: "AD", 
    description: "Logro Destacado", 
    progress: behaviorSummary.AD ?? 0 ,
    className: behavior_scale_style.AD
  },
  { 
    name: "A",  
    description: "Logro Esperado",  
    progress: behaviorSummary.A  ?? 0,
    className: behavior_scale_style.A
  },
  { 
    name: "B",  
    description: "En Proceso",      
    progress: behaviorSummary.B  ?? 0,
    className: behavior_scale_style.B
  },
  { 
    name: "C",  
    description: "En Inicio",       
    progress: behaviorSummary.C  ?? 0,
    className: behavior_scale_style.C
  },
] : [];

  return(
    <MyTemplate> 
      <BannerBehaviorAssistant/>
      <CardsScales
        behaviorStatics = {behaviorScales}
        loading = {behaviorLoading}
      />
      <BehaviorListStudents
        students={students}
        calificar={calificar}
        createIncident={createIncident}
        filters={filters}
        setFilters={setFilters}
        loading={behaviorLoading}
      />
      {/*
        
      <BehaviorRecords
        updateBehavior={updateBehavior}
      />
      */}
      
    </MyTemplate>
  )
}

export {BehaviorControlPage}