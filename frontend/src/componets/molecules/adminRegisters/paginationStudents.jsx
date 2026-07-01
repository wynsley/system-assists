import { Button } from "../../atoms/button"
import { Paragraph } from "../../atoms/paragraph"

function PaginationStudents({total, page, students, setPage}) {

  const totalStudents = `TOTAL: ${total}`
  return (
    <div className="flex justify-between items-center text-sm">
      <Paragraph
        text={totalStudents}
        weight="bold"
        variant="primary"
      />
      <div className="flex gap-2 items-center">
        <Button
          text='Anterior'
          variant="primary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        />
        <span className="text-md font-bold">Página {page}</span>
        <Button
          text='Siguiente'
          variant="primary"
          disabled={students.length < 10}
          onClick={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  )
}

export{PaginationStudents}