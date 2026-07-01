import { HeaderRegisterStudent } from "../../organims/adminRegisters/headerRegisterStudent";
import { MyTemplate } from "../../templates/myTemplate";
import { ListStudents } from "../../organims/adminRegisters/listStudents";

function RegisterStudent () {
  return(
    <MyTemplate> 
      <HeaderRegisterStudent/>
      <hr className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto text-gray-400 rounded-full mt-1"/>
      <ListStudents/>
    </MyTemplate>
  )
}

export {RegisterStudent}