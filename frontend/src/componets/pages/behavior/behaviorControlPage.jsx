import { useBehaviorControl } from "../../../hooks/hooksAssistant/useBehavior";
import { useBehaviorStats } from "../../../hooks/hooksAssistant/useBehaviorStats";
import { useStudents } from "../../../hooks/hooksAssistant/useStudent";
import { BannerBehaviorAssistant } from "../../organims/behaviorControl/BannerBehaviorAssitant";
import { BehaviorListStudents } from "../../organims/behaviorControl/behaviorListStudents";
import { BehaviorRecords } from "../../organims/behaviorControl/behaviorRecords";
import { CardsScales } from "../../organims/behaviorControl/cardsBehaviorScales";
import { MyTemplate } from "../../templates/myTemplate";

function BehaviorControlPage () {

  //hook para proporcionar la lista de estudiantes y permitir actualizarla.
  const { students, setStudents} = useStudents()

  //hoock para actualizar la información de comportamiento de un estudiante.
  const {
    updateBehavior,
  } = useBehaviorControl( students, setStudents)
  
  //Calcular las estadísticas del comportamiento de los estudiantes 
  const behaviorStatics = useBehaviorStats(students)

  return(
    <MyTemplate> 
      <BannerBehaviorAssistant/>
      <CardsScales
        behaviorStatics = {behaviorStatics}
      />
      <BehaviorListStudents
        students={students}
        updateBehavior={updateBehavior}
      />
      <BehaviorRecords
        updateBehavior={updateBehavior}
      />
    </MyTemplate>
  )
}

export {BehaviorControlPage}