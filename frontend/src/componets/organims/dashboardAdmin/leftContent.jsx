import { HiOutlineClipboardDocumentList } from "react-icons/hi2"
import { FaUserGraduate, FaUserPlus } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { TitleIconLink } from "../../molecules/titleIconLink"
import { CardsQuickAccesAdmin } from "./cardsQuickAccesAdmin"

function LeftContent () {
  const title = 'ACCESOS RÁPIDOS'

  const quickActionsAdmin = [
    {
      label: "REGISTRAR ESTUDIANTE",
      icon : <FaUserGraduate size={30}/>,
      href : '/admin/register-student'
    },
    {
      label: "REGISTRAR USUARIO",
      icon : <FaUserPlus size={30}/>,
      href : '/admin/register-user'
    },
    {
      label: "GESTIÓN ACADÉMICA",
      icon : <SiGoogleclassroom  size={30}/>,
      href : '/admin/generateQR'
    },
  ]

  return(
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-md border border-borderC
        p-6 shadow-sm w-full">
        <TitleIconLink
        title={title}
        icon={HiOutlineClipboardDocumentList}
        weight='bold'
      />
      <CardsQuickAccesAdmin
      quickActionsAdmin = {quickActionsAdmin}
    />
      </div>
    </section>
  )
}

export {LeftContent}