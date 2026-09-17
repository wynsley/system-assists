import { Logo } from "../molecules/logo";
import { NavbarMenu } from "../molecules/desktopMenu";
import { UserMenu } from "./userMenu";

function Navbar() {
  return (
    <nav className=" fixed bg-blue flex justify-between items-center top-0
            py-0 pr-[1%] pl-[3%] h-[4em] w-full  z-1000 
        ">
      <Logo
      />
      <NavbarMenu />
      <UserMenu/>
    </nav>
  )
}

export { Navbar }