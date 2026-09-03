const incidentFields = {
  create: {
    idIncident: true,
    date: true,
    note: true,
    incidentCatalog: {
      select: {
        idIncidentCatalog: true,
        name: true,
        description: true,
        type: true,
        pointsDeducted: true,
      },
    },
    student: {
      select: {
        idStudent: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        status: true,
        studentParents: {
          select: {
            relationship: true,
            parent: {
              select: {
                idUser: true,
                firstname: true,
                lastname: true,
                email: true,
                phone: true,
              },
            },
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
    createdAt: true,
    updatedAt: true,
  },
  update: [
    "date",
    "incidentCatalog",
    "note",
    "idStudent",
    "idAuxiliar",
    "idIncidentCatalog",
  ],
  
  select: {
    date: true,
    idIncident: true,
    note: true,
    incidentCatalog: {
      select: {
        idIncidentCatalog: true,
        name: true,
        description: true,
        type: true,
        pointsDeducted: true,
      },
    },
    student: {
      select: {
        idStudent: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        status: true,
        studentParents: {
          select: {
            relationship: true,
            parent: {
              select: {
                idUser: true,
                firstname: true,
                lastname: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    },
    auxiliar: {
      select: {
      idUser: true,
      firstname: true,
      lastname: true,
  }
}
  },
  sort: [
    "date",
    "incidentCatalog.name",
    "incidentCatalog.description",
    "student.firstname",
    "student.lastname",
  ],
  search: [
    "incidentCatalog.name",
    "incidentCatalog.description",
    "student.firstname",
    "student.lastname",
  ],
};

export { incidentFields };
