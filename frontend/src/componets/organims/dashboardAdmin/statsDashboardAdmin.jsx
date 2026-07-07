import { useVisible } from "../../../hooks/hookGlobals/useVisible"
import { Paragraph } from "../../atoms/paragraph"
import { Small } from "../../atoms/small"
import { getStatsAdmin } from "../../../config/dashborads/statsAdmin"


function CardsStatsAdmin ({
    loading =  false,
    totalStudents,
    presentStudents,
    lateStudents,
    averageAttendance,}) {

  const { visible } = useVisible()
  const statsAdmin = getStatsAdmin({
    totalStudents,
    presentStudents,
    lateStudents,
    averageAttendance,
  });

  return(
    <div className=" -mt-10 px-6 w-full mx-auto
      md:max-w-5xl"
    >
      <div className={` grid grid-cols-2 md:grid-cols-4 gap-3
        transition-all duration-500 
        ${ visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
        }`}
      >
        {
          statsAdmin.map((item, i) => {
            const Icon = item.icon
            return (
              <div 
                key={i}
                className=" flex items-center justify-between
                bg-white rounded-md p-4 
                shadow-md shadow-blue/20 border border-borderC
                transition-all duration-300 ease-in-out
                hover:-translate-y-1
              ">
                <div>
                  <Small
                  text={item.label}
                  size="large"
                />
                <Paragraph
                  text={loading ? "..." : item.value}
                  weight="bold"
                  size="slogan"
                />
                </div>
                  <Icon
                    size={40}
                    className={`${item.className} p-2 rounded-xl`}
                  />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export{CardsStatsAdmin}