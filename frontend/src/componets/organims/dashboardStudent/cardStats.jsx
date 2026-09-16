import { Paragraph } from "../../atoms/paragraph"
import { Small } from "../../atoms/small"
import { CgClose } from "react-icons/cg";
import { GiCheckMark } from "react-icons/gi";
import { useVisible } from "../../../hooks/hookGlobals/useVisible";


function CardStats({ stats }) {

    const { visible } = useVisible(90)
    
  return (
    <div className="
      -mt-10  px-6
      w-full
      mx-auto
      md:max-w-4xl
    ">
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 
        transition-all duration-500 
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-md p-4 
              shadow-md shadow-blue/20 border border-borderC
              transition-all duration-300 ease-in-out
              hover:-translate-y-1
              md:w-40
              lg:w-50
            ">
            <Paragraph
              text={
                s.attended !== undefined
                  ? (
                    s.attended
                      ? <GiCheckMark className="text-green-500 size-7"/>
                      : <CgClose className="text-red-500 size-7"/>
                  )
                  : (
                    <span className="text-[1.1em] text-cyanO">{s.value}</span>
                  )
              }
              weight="bold"
              size="large"
              variant="danger"
            />
            <Small
              text={s.label}
              size="large"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { CardStats }