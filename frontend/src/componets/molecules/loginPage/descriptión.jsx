import { Title } from "../../atoms/title"
import { Paragraph } from "../../atoms/paragraph"
import { Logo } from "../logo"

function DescriptionLogin() {
  const welcome = 'Le damos la bienvenida a '
  const title = '"CORONEL CORTEGANA"'
  const description = `"Donde la educación, la disciplina y el compromiso forman el  futuro de nuestros estudiantes"`

  return (
    <div className="z-10 text-center max-w-2xl flex flex-col sm:gap-3">
      <div className="flex sm-gap-3 items-center">
        <Logo
          variant="primary"
        />
        <div>
          <Paragraph
            text={welcome}
            variant="secondary"
            size="large"
          />
          <Title
            level="h2"
            align="left"
            weight="semibold"
            text={title}
            variant="primary"
          />
        </div>
      </div>
      <Paragraph
        text={description}
        size="large"
        variant="secondary"
      />
    </div>
  )
}

export { DescriptionLogin }