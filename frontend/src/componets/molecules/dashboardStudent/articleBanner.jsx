import { Title } from "../../atoms/title"
import { Paragraph } from "../../atoms/paragraph"
import { useVisible } from "../../../hooks/hookGlobals/useVisible"
import { useGreeting } from "../../../hooks/hookGlobals/useGreeting"
import { FilterStudents } from "../filterStudents"

function Article ({studentsOptions, selectedStudent, setSelectedStudent}) {

  const { visible } = useVisible(90)
  const {
    greetingLabel,
    greetingHour,
    name
  } = useGreeting()
  
  return(
    <article className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <span className="inline-block bg-white/10 text-cyan-200 text-xs 
            font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
          >
            {greetingLabel}
          </span>

          <Title
            weight="bold"
            variant="primary"
            className={`transition-all duration-500 font-poppins ${
            visible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-3'
          }`}>
            {greetingHour}, {name || 'bienvenido'}
          </Title>

          <Paragraph 
            className="mt-2"
            variant="secondary"
            size="small"
          >
            Sistema de control de asistencia — {new Date().toLocaleDateString('es-PE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Paragraph>
      </div>

      
        <FilterStudents
          students={studentsOptions}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          variant="primary"
        />
      </article>
  )
}

export {Article}