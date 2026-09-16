function FilterStudents ({
  students, 
  setSelectedStudent, 
  selectedStudent,
  variant = 'default',
  className = ''
}) {

  const variants = {
    default : `border-b border-borderC
      px-4 py-3 outline-none
      focus:ring-2 focus:ring-blue-400
      cursor-pointer `,
    primary : `border-b border-borderC 
      px-4 py-3 outline-none bg-white 
      focus:ring-2 focus:ring-blue-400
      cursor-pointer rounded-md` 
  }
  
  return(
    <div className="z-10">
          {students.length <= 1 ? (
            /* BOTONES */
            <>
            </>
          ) : (
            /* SELECT */
            <select
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(Number(e.target.value))
              }
              className ={`
                ${className}
                ${variants[variant] || variants.default}
              `}
            >
              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.name}
                </option>
              ))}
            </select>
          )}
        </div>
  )
}

export {FilterStudents}