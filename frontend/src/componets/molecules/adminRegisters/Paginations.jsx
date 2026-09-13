import { Button } from "../../atoms/button";
import { Paragraph } from "../../atoms/paragraph"

function Paginations({
  total,
  page,
  amount,
  setPage,
  hasNextPage,
  label = "TOTAL"
}) {
  const totalUsers = `${label}: ${total}`;

  // si no viene hasNextPage, mantiene el comportamiento original (amount.length < 10)
  const canGoNext = typeof hasNextPage === "boolean" ? hasNextPage : amount.length >= 10;

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
          disabled={!canGoNext}
          onClick={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  )
}

export { Paginations }