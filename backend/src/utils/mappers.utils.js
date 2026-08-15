const mappersUtils = {
  formatSection: (row) => ({
    idSection: row.idSection,
    idGrade: row.grade?.idGrade ?? null,
    grade: row.grade?.level ?? null,
    section: row.name,
  }),
  formatClassroom: (row) => {
    return {
      idClassroomStudent: row.idClassroomStudent,
      grade: row.classroom?.section?.grade?.level ?? null,
      section: row.classroom?.section?.name ?? null,
    };
  },
  formatClassroomOnly: (row) => ({
    idClassroom: row.idClassroom,
    year: row.year,
    grade: row.section?.grade?.level ?? null,
    section: row.section?.name ?? null,
  }),
  formatClassroomStudent: (row) => {
    return {
      idClassroomStudent: row.idClassroomStudent,
      idClassroom: row.classroom?.idClassroom ?? null,
      year: row.classroom?.year ?? null,
      grade: row.classroom?.section?.grade?.level ?? null,
      section: row.classroom?.section?.name ?? null,
      student: row.student,
    };
  },
  formatClassroomAuxiliar: (row) => ({
    idClassroomAuxiliar: row.idClassroomAuxiliar,
    classroom: {
      idClassroom: row.idClassroom,
      year: row.classroom?.year ?? null,
      grade: row.classroom?.section?.grade?.level ?? null,
      section: row.classroom?.section?.name ?? null,
    },
    auxiliar: {
      idUser: row.auxiliar?.idUser ?? null,
      fullname:
        `${row.auxiliar?.firstname ?? ""} ${row.auxiliar?.lastname ?? ""}`.trim(),
      firstname: row.auxiliar?.firstname ?? null,
      lastname: row.auxiliar?.lastname ?? null,
      email: row.auxiliar?.email ?? null,
      phone: row.auxiliar?.phone ?? null,
    },
  }),
  formatAttendance: (row) => ({
    idAttendance: row.idAttendance,
    date: row.date,
    status: row.status,
    note: row.note,
    student: {
      idStudent: row.student.idStudent,
      fullname: `${row.student.firstname} ${row.student.lastname}`,
      firstname: row.student.firstname,
      lastname: row.student.lastname,
      dni: row.student.dni,
      gender: row.student.gender,
      phone: row.student.phone,
      email: row.student.email,
      status: row.student.status,
      classroom: row.student.classroomStudents[0]
        ? {
            idClassroom: row.student.classroomStudents[0].idClassroom,
            year: row.student.classroomStudents[0].classroom?.year ?? null,
            grade:
              row.student.classroomStudents[0].classroom?.section?.grade
                ?.level ?? null,
            section:
              row.student.classroomStudents[0].classroom?.section?.name ?? null,
          }
        : null,
    },
  }),
};

export { mappersUtils };
