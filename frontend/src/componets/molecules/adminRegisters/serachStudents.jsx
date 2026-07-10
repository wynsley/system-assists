import { HiMagnifyingGlass } from "react-icons/hi2"

function StudentSearch () {
  return(
    <div className="relative mb-3">
        <HiMagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="
            w-full pl-9 pr-4 py-2.5
            rounded-md border border-borderC
            bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-blue/20
          "
        />
      </div>
  )
}

export{StudentSearch}