import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { validateUtils } from "../../utils/validate.utils.js";

const nonSchoolDayService = {
  create: async (data) => {
    return prisma.nonSchoolDay.create({ data });
  },

  get: async ({ page, limit, sortOrder, sortBy, year }) => {
    const where = {};
    if (year) {
      // cualquier rango que toque ese año
      where.startDate = { lte: new Date(`${year}-12-31`) };
      where.endDate = { gte: new Date(`${year}-01-01`) };
    }

    const [nonSchoolDays, total] = await Promise.all([
      prisma.nonSchoolDay.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.nonSchoolDay.count({ where }),
    ]);

    return [nonSchoolDays, total];
  },

  getById: async ({ idNonSchoolDay }) => {
    const nonSchoolDay = await prisma.nonSchoolDay.findUnique({
      where: { idNonSchoolDay },
    });
    if (!nonSchoolDay) {
      throw new AppError("Registro no encontrado", 404, [
        { field: "idNonSchoolDay", message: "No existe un registro con el ID proporcionado" },
      ]);
    }
    return nonSchoolDay;
  },

  update: async ({ idNonSchoolDay, data }) => {
    const existing = await prisma.nonSchoolDay.findUnique({ where: { idNonSchoolDay } });
    if (!existing) {
      throw new AppError("Registro no encontrado", 404, [
        { field: "idNonSchoolDay", message: "No existe un registro con el ID proporcionado" },
      ]);
    }

    const nextStart = data.startDate ?? existing.startDate;
    const nextEnd = data.endDate ?? existing.endDate;
    if (nextEnd < nextStart) {
      throw new AppError("Error de validación", 400, [
        { field: "endDate", message: "La fecha de fin no puede ser anterior a la fecha de inicio" },
      ]);
    }

    return prisma.nonSchoolDay.update({ where: { idNonSchoolDay }, data });
  },

  delete: async ({ idNonSchoolDay }) => {
    return prisma.nonSchoolDay.delete({ where: { idNonSchoolDay } });
  },
};

export { nonSchoolDayService };