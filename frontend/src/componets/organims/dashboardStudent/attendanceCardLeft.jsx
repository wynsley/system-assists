import { Paragraph } from "../../atoms/paragraph"
import { Small } from "../../atoms/small"

function AttendanceClassCard ({ AttendancesClasses }) {
  return (
    <div className="flex flex-col gap-2 font-poppins">
      {AttendancesClasses.map((item, i) => (
        <div
          key={i}
          className="
            border border-gray-200 rounded-xl
            p-4 flex gap-4
            hover:shadow-md transition-all
          "
        >
          {/* ICONO */}
          <div
            className="
              min-w-[70px] flex items-center justify-center
              text-center border-r border-gray-200 pr-4"
          >
            {item.icon}
          </div>

          {/* FECHA */}
          <div className="flex justify-between items-center w-full ">
            <div>
              <Paragraph
                className=" mt-1"
                text={item.day}
                size="small"
                variant="danger"
              >
                <span>{item.date}</span>
              </Paragraph>
              <Small
                text={item.hour}
              />
            </div>
            <button className=" py w-[5em] border border-borderC/50 rounded-full text-[.9em]">
              {item.stats}
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}

export { AttendanceClassCard }