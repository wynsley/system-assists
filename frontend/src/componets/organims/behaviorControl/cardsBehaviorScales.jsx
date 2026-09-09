import { useVisible } from "../../../hooks/hookGlobals/useVisible"
import { Small } from "../../atoms/small"
import { Title } from "../../atoms/title"

function CardsScales({ behaviorStatics, loading }) {

  const { visible } = useVisible(90)

  return (
    <div
      className=" mt-8  mx-auto w-[96%] md:max-w-6xl "
    >
      <div
        className={`
          grid grid-cols-2 md:grid-cols-4 gap-3
          transition-all duration-500
          ${visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
          }
        `}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 justify-between bg-white rounded-md p-4
                  shadow-md shadow-blue/20 border border-borderC animate-pulse w-full"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="h-6 w-10 rounded-md bg-gray-200" />
                  <div className="h-5 w-8 rounded bg-gray-200" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 rounded bg-gray-200" />
                  <div className="w-full h-2 rounded-full bg-gray-200" />
                </div>
              </div>
            ))
          : behaviorStatics.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 item-center justify-between bg-white rounded-md p-4
                shadow-md shadow-blue/20 border border-borderC
                transition-all duration-300 ease-in-out
                hover:-translate-y-1
                w-full"
              >
                <div className="flex items-start justify-between w-full">
                  <Title
                    text={item.name}
                    weight="bold"
                    level="h2"
                    className={`${item.className} px-3 rounded-md`}
                  />
                  <span className="text-blue font-bold">{item.progress}%</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Small text={item.description} />
                  <div className=" w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-cyanO to-cyan-500 flex items-center justify-center"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export { CardsScales }