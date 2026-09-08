import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { incidentCatalogFields } from "./incidentCatalog.fields.js";

const incidentCatalogService = {
  create: async (data) => {
    if(!Number.isInteger(data.points) || data.points <= 0) {
      throw new AppError("Puntos inválidos", 400, [
        {field : "points",
          message: "Los puntos deben ser un entero positivo"
        }
      ])
    }
    const queryResult = await prisma.$transaction(async (prisma) => {
      const incidentCatalog = await prisma.incidentCatalog.create({
        data,
        select: incidentCatalogFields.create,
      });

      return { incidentCatalog };
    });
    return queryResult.incidentCatalog;
  },

  get: async ({ page, limit, sortOrder, sortBy, search }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idIncidentCatalog", "points"],
      stringFields: ["name", "description"],
      enumFields: [
        {
          field: "type",
          values: ["POSITIVO", "NEGATIVO"],
        },
      ],
    });

    const [incidentCatalogs, total] = await Promise.all([
      prisma.incidentCatalog.findMany({
        where,
        select: incidentCatalogFields.select,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: validateUtils.buildOrderBy({ sortBy, sortOrder }),
      }),
      prisma.incidentCatalog.count({ where }),
    ]);

    return [incidentCatalogs, total];
  },

  getById: async ({ idIncidentCatalog }) => {
    const incidentCatalog = await prisma.incidentCatalog.findUnique({
      where: { idIncidentCatalog },
      select: incidentCatalogFields.select,
    });

    if (!incidentCatalog) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idIncidentCatalog",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return incidentCatalog;
  },

  update: async ({ idIncidentCatalog, data }) => {
    const incidentCatalog = await prisma.incidentCatalog.findUnique({
      where: { idIncidentCatalog },
    });

    if (!incidentCatalog) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idIncidentCatalog",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    const updatedIncidentCatalog = await prisma.incidentCatalog.update({
      where: { idIncidentCatalog },
      data,
      select: incidentCatalogFields.select,
    });

    return updatedIncidentCatalog;
  },

  delete: async ({ idIncidentCatalog }) => {
    const deletedIncidentCatalog = await prisma.incidentCatalog.delete({
      where: { idIncidentCatalog },
      select: incidentCatalogFields.select,
    });

    return deletedIncidentCatalog;
  },
};

export { incidentCatalogService };
