import { useVisible } from "../../../hooks/hookGlobals/useVisible";
import { Small } from "../../atoms/small"
import { Title } from "../../atoms/title";
import { grandingScale } from "../../../mocks/grandingScale";

// Mismos colores que usa la tabla (GRADE_STYLES en FilterBehavior)
const SCALE_COLORS = {
  AD: { icon: "text-green-600", text: "text-green-700", ring: "ring-green-500" },
  A: { icon: "text-blue-600", text: "text-blue-700", ring: "ring-blue-500" },
  B: { icon: "text-yellow-600", text: "text-yellow-700", ring: "ring-yellow-500" },
  C: { icon: "text-red-600", text: "text-red-700", ring: "ring-red-500" },
};

function CardGrandingScale({ current }) {
  const title = 'ESCALA DE CALIFICACIONES'

  const { visible } = useVisible(90)

  return (
    <div className="
      mt-6 px-2 py-5
      w-[96%] 
      mx-auto
      md:max-w-7xl
      font-poppins
      flex flex-col gap-5
      border border-borderC rounded-md
    ">
      <Title
        level="h3"
        text={title}
        variant="secondary"
        weight="bold"
      />
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6
        transition-all duration-500 
        ${visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'}
      `}>
        {grandingScale.map((item, i) => {
          const Icon = item.icon;
          const colors = SCALE_COLORS[item.value] ?? { icon: "text-blueT", text: "text-blueT", ring: "" };
          const isCurrent = current?.scale === item.value;

          return (
            <div
              key={i}
              className={`relative flex bg-white rounded-md p-4 
                shadow-md shadow-blue/20 border border-black/20
                transition-all duration-300 ease-in-out
                hover:-translate-y-1
                ${isCurrent ? `ring-2 ${colors.ring} border-transparent` : ""}
              `}
            >
              <Icon size={30} className={`${colors.icon} absolute right-2 top-2`} />
              <Title
                text={item.value}
                level="h2"
                weight="bold"
                className={`min-w-15 my-auto ${colors.text}`}
              />
              <div className="flex flex-col">
                <Title
                  level="h4"
                  text={item.title}
                  weight="bold"
                />
                <Small
                  text={item.description}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { CardGrandingScale }