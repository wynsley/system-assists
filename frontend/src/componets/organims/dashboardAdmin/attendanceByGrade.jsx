import { Title } from "../../atoms/title";

function AttendanceByGrade({attendanceByGrade}) {

  return (
    <div className="flex flex-col gap-2">
      {
        attendanceByGrade.map((attendance, a) => {
          return (
            <div 
              key={a}
              className="flex items-center justify-between p-3 border border-borderC/50
                rounded-md shadow-md
              "
            >
              <div className="flex flex-col gap-2">
                <Title
                  text={attendance.text}
                  level="h5"
                  weight="bold"
                />
                <div className="flex items-center gap-2">
                  <div className=" text-sm text-gray-900 flex items-center gap-2">
                    <div  
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: attendance.colors.present }}
                    />
                    <span>Presentes: {attendance.present}</span>
                  </div>

                  <div className=" text-sm text-gray-900 flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: attendance.colors.late}}
                    />
                    <span>Tardanzas: {attendance.late}</span>
                  </div>
                  <div 
                    className=" text-sm text-gray-900 flex items-center gap-2"
                    >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: attendance.colors.absent}}
                    />
                    <span>Ausentes: {attendance.absent}</span>
                  </div>
                </div>
              </div>
              <span >{attendance.totalStudents} estudiantes</span>
            </div>
          )
        })
      }
    </div>
  )
}

export { AttendanceByGrade }