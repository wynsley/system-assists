const classroomAuxiliarFields = {
  create: {
    idClassroomAuxiliar: true,
    idClassroom: true,
    classroom: {
      select: {
        year: true,
        section: {
          select: {
            grade: {
              select: {
                level: true,
              },
            },
            name: true,
          },
        },
      },
    },
    auxiliar: {
      select: {
        idUser: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
      },
    },
  },
  update: ["idAuxiliar", "idClassroom"],
  select: {
    idClassroomAuxiliar: true,
    idClassroom: true,
    classroom: {
      select: {
        year: true,
        section: {
          select: {
            grade: {
              select: {
                level: true,
              },
            },
            name: true,
          },
        },
      },
    },
    auxiliar: {
      select: {
        idUser: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
      },
    },
  },
  sort: ["idClassroomAuxiliar", "idClassroom", "idAuxiliar"],
  search: ["idClassroom", "idAuxiliar"],
  status: ["ACTIVO", "INACTIVO"],
};

export { classroomAuxiliarFields };
