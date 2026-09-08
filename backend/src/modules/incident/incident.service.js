import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { behaviorUtils } from "../../utils/behavior.utils.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { incidentFields } from "./incident.fields.js";
import { academicPeriodService } from "../academicPeriod/academicPeriod.service.js";

const incidentService = {
  create: async (data) => {
    const { idStudent, idIncidentCatalog, idAuxiliar, date, note } = data;

    const catalog = await prisma.incidentCatalog.findUnique({ where: { idIncidentCatalog } });
    if (!catalog) {
      throw new AppError("Registro no encontrado", 404, [
        { field: "idIncidentCatalog", message: "No existe el tipo de incidente indicado" },
      ]);
    }

    const period = await academicPeriodService.getCurrent();
    const delta = catalog.type === "POSITIVO" ? catalog.points : -catalog.points;

    try {
      const queryResult = await prisma.$transaction(async (prisma) => {
        let behavior = await prisma.behavior.findUnique({
          where: { idStudent_idPeriod: { idStudent, idPeriod: period.idPeriod } },
        });
        const previousScore = behavior?.score ?? 0;

        if (delta > 0 && previousScore >= 20) {
          throw new AppError("El estudiante ya tiene la nota máxima (20).", 400, [
            { field: "idStudent", message: "El estudiante ya tiene la nota máxima (20)." },
          ]);
        }

        const newScore = Math.min(20, Math.max(0, previousScore + delta));

        behavior = behavior
          ? await prisma.behavior.update({ where: { idBehavior: behavior.idBehavior }, data: { score: newScore } })
          : await prisma.behavior.create({ data: { idStudent, idPeriod: period.idPeriod, score: newScore } });

        const incident = await prisma.incident.create({
          data: { idStudent, idAuxiliar, idIncidentCatalog, date, note },
          select: incidentFields.create,
        });

        await prisma.behaviorHistory.create({
          data: {
            idBehavior: behavior.idBehavior,
            previousScore,
            newScore,
            description: note ?? catalog.name,
            idAuxiliar,
            type: "INCIDENTE",
            idIncident: incident.idIncident,
          },
        });

        return { incident, behavior };
      });

      return {
        ...queryResult.incident,
        behaviorScore: queryResult.behavior.score,
        scale: behaviorUtils.getScale(queryResult.behavior.score),
        period,
      };
    } catch (error) {
      if (error.code === "P2002") {
        throw new AppError("Incidente duplicado", 400, [
          {
            field: "idIncidentCatalog",
            message: `Ya se registró "${catalog.name}" para este estudiante en la fecha indicada.`,
          },
        ]);
      }
      throw error;
    }
  },

  get: async ({ page, limit, sortOrder, sortBy, search, incidentCatalog, startDate, endDate }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idIncident"],
      relationStringFields: [
        { relation: "incidentCatalog", field: "name" },
        { relation: "incidentCatalog", field: "description" },
        { relation: "student", field: "firstname" },
        { relation: "student", field: "lastname" },
      ],
      filters: {
        incidentCatalog,
      },
    });

    if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }


    const [incidents, total] = await prisma.$transaction([
      prisma.incident.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
        select: incidentFields.select,
      }),
      prisma.incident.count({ where }),
    ]);
    return [incidents.map(mappersUtils.formatIncident), total];
  },

  getById: async ({ idIncident }) => {
    const incident = await prisma.incident.findUnique({
      where: { idIncident },
      select: incidentFields.select,
    });
    if (!incident) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idIncident",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }
    return incident;
  },

  update: async ({ idIncident, data }) => {
    const updatedIncident = await prisma.incident.update({
      where: {
        idIncident,
      },
      data,
      select: incidentFields.select,
    });

    if (!updatedIncident) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idIncident",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return updatedIncident;
  },

  delete: async ({ idIncident }) => {
    const deletedIncident = await prisma.incident.delete({
      where: { idIncident },
      select: incidentFields.select,
    });

    return deletedIncident;
  },

  getByIdStudent: async ({ idStudent }) => {
    const incidents = await prisma.incident.findMany({
      where: { idStudent },
      select: incidentFields.select,
    });

    if (!incidents || incidents.length === 0) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idStudent",
          message:
            "No existen incidentes para el estudiante con el ID proporcionado",
        },
      ]);
    }

    return incidents;
  },
};

export { incidentService };
