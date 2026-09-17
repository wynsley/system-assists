import { Title } from "../../atoms/title"
import { Paragraph } from "../../atoms/paragraph"
import { useVisible } from "../../../hooks/hookGlobals/useVisible"

const SCALE_COLOR = {
  AD: "text-green-300",
  A: "text-blue-300",
  B: "text-yellow-300",
  C: "text-red-300",
};

function ArticleBannerBehavior({ selectedStudentData, current }) {
  const title = 'COMPORTAMIENTO DE MI MENOR'
  const paragraph = 'Seguimiendo del comportamiendo escolar'

  const { visible } = useVisible(90)

  const scale = current?.scale ?? "-";
  const scaleColor = SCALE_COLOR[scale] ?? "text-white";

  return (
    <article className="mx-auto max-w-6xl 
      flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
      z-10
    ">
      <div className="relative flex flex-col gap-1">
        <span className="inline-block bg-white/10 text-cyan-200 text-xs 
            font-semibold tracking-widest uppercase px-3 py-1 rounded-full w-fit"
        >
          {title}
        </span>
        <Title
          text={`${selectedStudentData?.firstname ?? ""} ${selectedStudentData?.lastname ?? ""}`}
          weight="bold"
          variant="primary"
          className={`transition-all duration-500 font-poppins ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        />
        <Paragraph
          text={paragraph}
          variant="secondary"
          size="small"
        />
      </div>

      {/* NOTA ACTUAL — reemplaza al selector, que ya vive en el dashboard */}
      <div className="flex flex-col items-center sm:items-end">
        <span className="text-cyan-200 text-xs font-semibold tracking-widest uppercase">
          Nota actual
        </span>
        <Title
          text={scale}
          weight="bold"
          className={`font-poppins leading-none ${scaleColor} text-6xl sm:text-7xl md:text-8xl`}
        />
      </div>
    </article>
  )
}

export { ArticleBannerBehavior }