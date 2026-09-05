import { Button } from "../../atoms/button";
import { Paragraph } from "../../atoms/paragraph"

function Paginations({
  total,
  page,
  amount,
  setPage
}) {
  const totalUsers = `TOTAL: ${total}`;
  return (
    <div className="flex justify-between items-center text-sm">
      <Paragraph
        text={totalUsers}
        weight="bold"
        variant="primary"
      />
      <div className="flex gap-2 items-center">
        <Button
          text='Anterior'
          variant="primary"
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        />
        <span className="text-md font-bold ">Página {page}</span>
        <Button
          text='Siguiente'
          variant="primary"
          type="button"
          disabled={amount.length < 10}
          onClick={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  )
}

export { Paginations }