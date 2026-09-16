import { Paragraph } from "../../atoms/paragraph"
import { Title } from "../../atoms/title"

function Titlebanner({title, currentStudent}) {
  const fullName = `${currentStudent?.firstname ?? ""} ${currentStudent?.lastname ?? ""}`;
  return (
    <div>
      <Title
        level="h2"
        weight="bold"
        text={`${title} ${fullName}`}
      />
      <Paragraph
        text={` Historial de asistencias y estadísticas`}
      />
    </div>
  )
}

export { Titlebanner }