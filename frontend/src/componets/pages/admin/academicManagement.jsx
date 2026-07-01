import { AcademicCatalog } from "../../organims/adminRegisters/academicCatalog"
import { HeaderAcademic } from "../../organims/adminRegisters/headerAcamdemic"
import { MyTemplate } from "../../templates/myTemplate"

function AcademicManagement () {
  return(
    <MyTemplate >
      <HeaderAcademic/>
      <hr className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto text-gray-400 rounded-full mt-1"/>
      <AcademicCatalog/>
    </MyTemplate>
  )
}

export {AcademicManagement}