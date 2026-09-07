import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { academicPeriodFields } from "./academicPeriod.fields.js";

const academicPeriodService = {
  create: async (data) => {
    return prisma.academicPeriod.create({ data, select: academicPeriodFields.create });
  },

  get: async ({ page, limit, sortOrder, sortBy, search, year }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["year", "bimester"],
      filters: { year },
    });
    const [periods, total] = await Promise.all([
      prisma.academicPeriod.findMany({
        where,
        select: academicPeriodFields.select,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
      }),
      prisma.academicPeriod.count({ where }),
    ]);
    return [periods, total];
  },

  getById: async ({ idPeriod }) => {
    const period = await prisma.academicPeriod.findUnique({
      where: { idPeriod },
      select: academicPeriodFields.select,
    });
    if (!period) {
      throw new AppError("Registro no encontrado", 404, [
        { field: "idPeriod", message: "No existe un registro con el ID proporcionado" },
      ]);
    }
    return period;
  },

  update: async ({ idPeriod, data }) => {
    const period = await prisma.academicPeriod.findUnique({ where: { idPeriod } });
    if (!period) {
      throw new AppError("Registro no encontrado", 404, [
        { field: "idPeriod", message: "No existe un registro con el ID proporcionado" },
      ]);
    }
    return prisma.academicPeriod.update({ where: { idPeriod }, data, select: academicPeriodFields.select });
  },

  delete: async ({ idPeriod }) => {
    return prisma.academicPeriod.delete({ where: { idPeriod }, select: academicPeriodFields.select });
  },

  // Resuelve el bimestre activo según la fecha de hoy
  getCurrent: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const period = await prisma.academicPeriod.findFirst({
      where: { startDate: { lte: today }, endDate: { gte: today } },
      select: academicPeriodFields.select,
    });

    if (!period) {
      throw new AppError("No hay un bimestre activo configurado", 400, [
        {
          field: "date",
          message: "No hay un bimestre activo para la fecha de hoy. Contacta al administrador para configurarlo.",
        },
      ]);
    }

    return period;
  },
};

export { academicPeriodService };