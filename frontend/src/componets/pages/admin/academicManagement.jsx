import { useClassrooms } from "../../../hooks/hoocksAdmin/useClassroom";
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades"
import { useSections } from "../../../hooks/hoocksAdmin/useSections";
import { AcademicCatalog } from "../../organims/adminRegisters/academicCatalog"
import { HeaderAcademic } from "../../organims/adminRegisters/headerAcamdemic"
import { MyTemplate } from "../../templates/myTemplate"

function AcademicManagement () {
  //hooks de grados, seccion y aulas
  const gradesHook =  useGrades({limit : 50});
  const sectionsHook =  useSections({limit: 100});
  const classroomHook =  useClassrooms({limit: 20})
  
  return(
    <MyTemplate >
      <HeaderAcademic
        refetchGrades={gradesHook.refetch}
        refethcSections={sectionsHook.refetch}
        refetchClassroom={classroomHook.refetch}
      />
      <hr className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto text-gray-400 rounded-full mt-1"/>
      <AcademicCatalog
        gradesHook={gradesHook}
        sectionsHook={sectionsHook}
        classroomHook={classroomHook}
      />
    </MyTemplate>
  )
}

export {AcademicManagement}