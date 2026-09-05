const classroomFields = {
  create: {
    idClassroom: true,
    year: true,
    section: {
      select: {
        name: true,
        grade: {
          select: {
            level: true,
          },
        },
      },
    },
  },

  update: ["year", "idSection"],
  select: {
    idClassroom: true,
    year: true,
    section: {
      select: {
        idSection: true,      
        name: true,
        grade: {
          select: {
            idGrade: true,   
            level: true,
          },
        },
      },
    },
  },
  sort: ["idSection", "year"],
  search: ["idClassroom", "year", "idSection", "section"],
  status: ["ACTIVO", "INACTIVO"],
};

export { classroomFields };

/*

model Classroom {
  idClassroom Int @id @default(autoincrement())
  year        Int
  idSection   Int

  section           Section            @relation(fields: [idSection], references: [idSection])
  classroomStudents ClassroomStudent[]
}



model Section {
  idSection  Int         @id @default(autoincrement())
  name       String      @db.VarChar(10)
  grade      Grade       @relation(fields: [idGrade], references: [idGrade])
  idGrade    Int
  classrooms Classroom[]
}
  model ClassroomStudent {
  idClassroomStudent Int @id @default(autoincrement())
  idClassroom        Int
  idStudent          Int

  classroom Classroom @relation(fields: [idClassroom], references: [idClassroom])
  student   Student   @relation(fields: [idStudent], references: [idStudent])
}

*/
