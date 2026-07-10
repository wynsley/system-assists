const studentFields = {
  status: [
    "ACTIVO",
    "INACTIVO",
    "SUSPENDIDO",
    "EXPULSADO",
    "TRANSFERIDO",
    "GRADUADO",
    "RETIRADO",
  ],
  update: [
    "firstname",
    "lastname",
    "dni",
    "gender",
    "phone",
    "email",
    "status",
  ],
  select: {
    idStudent: true,
    firstname: true,
    lastname: true,
    dni: true,
    gender: true,
    phone: true,
    email: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    // nuevo — aula activa del estudiante
    classroomStudents: {
      where: {
        classroom: {
          status: "ACTIVO",
        },
      },
      select: {
        idClassroomStudent: true,
        classroom: {
          select: {
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
        },
      },
      take: 1, // solo el aula activa más reciente
    },
  },
  sort: [
    "firstname",
    "lastname",
    "gender",
    "dni",
    "phone",
    "email",
    "status",
    "createdAt",
    "updatedAt",
  ],
  search: [
    "firstname",
    "lastname",
    "dni",
    "gender",
    "phone",
    "email",
    "status",
  ],
  create: {
    firstname: true,
    lastname: true,
    dni: true,
    gender: true,
    phone: true,
    email: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  },
};

export { studentFields };
