import { Link } from "react-router-dom"
import { useVisible } from "../../../hooks/hookGlobals/useVisible"
import { Title } from "../../atoms/title"

function CardsQuickAccesAdmin ({quickActionsAdmin, href}) {

  const { visible } = useVisible(90)

  return(
    <div className="grid sm:grid-cols-3 gap-2">
      {
        quickActionsAdmin.map((item, i) => {
          return(
            <Link 
              key={i}
              to={item.href}
              className={` flex flex-col gap-2
                bg-blueT rounded-md p-3 shadow-md shadow-blue/50 
                border border-borderC  transition-all duration-300 ease-in-out
                hover:-translate-y-1  relative
                ${ visible
                  ? 'opacity-100 translate-0'
                  : 'opacity-0 translate-5'
                }
              `}
            >
              <span className="text-white absolute top-2 right-2">
                {item.icon}
              </span>
                <Title
                level="h5"
                weight="bold"
                variant="primary"
                text={item.label}
              />
            </Link>
          )
        })
      }
    </div>
  )
}

export {CardsQuickAccesAdmin}