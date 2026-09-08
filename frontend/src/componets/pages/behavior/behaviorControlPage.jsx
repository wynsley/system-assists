import { BannerBehaviorAssistant } from "../../organims/behaviorControl/BannerBehaviorAssitant";
import { CardsScales } from "../../organims/behaviorControl/cardsBehaviorScales";
import { MyTemplate } from "../../templates/myTemplate";
import { useBehavior } from "../../../hooks/hooksAssistant/useBehavior";

function BehaviorControlPage () {

  const {
    total,
    period,
    message,
    behaviorSummary,
    refetch,
    calificar,
    getConsolidado
  } = useBehavior()

  return(
    <MyTemplate> 
      <BannerBehaviorAssistant/>
      <CardsScales
        behaviorStatics = {behaviorStatics}
      />
      {/*
        <BehaviorListStudents
        students={students}
        updateBehavior={updateBehavior}
      />
      <BehaviorRecords
        updateBehavior={updateBehavior}
      />
      */}
      
    </MyTemplate>
  )
}

export {BehaviorControlPage}