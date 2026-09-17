import { HiOutlineBookOpen, HiOutlineClipboardDocumentList} from "react-icons/hi2";
import { QuickAccess } from "./quickAccess";
import { TitleIconLink } from "../../molecules/titleIconLink";
import { CoursesPorsentages } from "./coursesPorcentageRight"
import { useVisible } from "../../../hooks/hookGlobals/useVisible";

function RightOverview ({ averageAttendances   }) {
  const title = 'ACCESOS RÁPIDOS'
  const title3 = 'PROMEDIO ASISTENCIAS'

  const { visible } = useVisible(90)

  const quickAccess = [
    {
      title: "Asitencias",
      days: "Historial completo",
      href: '/attendance-student'
    },
    {
      title: "Comportamiento",
      days: "Calificaciones",
      href: '/behavior-student'
    },
    {
      title: "Institución ",
      days: "información",
      href: '/institution'
    },
  ];
  return(
    <div className="flex flex-col gap-6">

          {/* ACCESOS RÁPIDOS */}
          <div className={` bg-white rounded-md border border-borderC p-6 shadow-sm w-full
            `}>
            <TitleIconLink
              title={title}
              icon={HiOutlineClipboardDocumentList}
            />
            <QuickAccess
                visible={visible}
              quickAccess={quickAccess}
            />
          </div>

          {/* CURSOS */}
          <div 
            className={`bg-white rounded-md border border-borderC p-6 shadow-sm
              transition-all duration-500
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}>
              <TitleIconLink
                title={title3}
                icon={HiOutlineBookOpen}
                text={'Ver Todo'}
              />
              <CoursesPorsentages
                averageAttendances={averageAttendances}
              />
          </div>
        </div>
  )
}

export {RightOverview}