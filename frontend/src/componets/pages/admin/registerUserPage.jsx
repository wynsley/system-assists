import { HeaderRegisterUser } from "../../organims/adminRegisters/headerRegisterUser";
import { ListUsers } from "../../organims/adminRegisters/ListUsers";
import { MyTemplate } from "../../templates/myTemplate";

function RegisterUser () {

  //USERS CREDENTIALS
  /*AUXILIAR
      email:  lopez@gmail.com
      password: Lopez11@
  */
  /*PARENT
      email:  diaz@gmail.com
      password: Diaz111@
  */
  return(
    <MyTemplate> 
      <HeaderRegisterUser/>
      <hr className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto text-gray-400 rounded-full mt-1"/>
      <ListUsers/>
    </MyTemplate>
  )
}

export {RegisterUser}