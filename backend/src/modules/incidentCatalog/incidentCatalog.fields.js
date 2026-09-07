const incidentCatalogFields = {
  create: {
    idIncidentCatalog: true,
    name: true,
    description: true,
    type: true,
    points: true,
  },
  update: ["name", "description", "type", "points"],
  select: {
    idIncidentCatalog: true,
    name: true,
    description: true,
    type: true,
    points: true,
  },
  sort: ["name", "type", "pointsDeducted"],
  search: [
    "idIncidentCatalog",
    "name",
    "description",
    "type",
    "points",
  ],
  type: ["POSITIVO", "NEGATIVO"],
};

export { incidentCatalogFields };
