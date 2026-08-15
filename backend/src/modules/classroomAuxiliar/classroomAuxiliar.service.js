import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { classroomAuxiliarFields } from "./classroomAuxiliar.fields.js";

const classroomAuxiliarService = {
  create: async (data) => {
    const queryResult = await prisma.$transaction(async (prisma) => {
      const userRole = await prisma.user.findUnique({
        where: { idUser: data.idAuxiliar },
        select: { role: true },
      });

      if (userRole?.role !== "AUXILIAR") {
        throw new AppError(
          "No existe un registro con el ID proporcionado",
          404,
          [
            {
              field: "idAuxiliar",
              message: "No existe un registro con el ID proporcionado",
            },
          ],
        );
      }

      const classroomAuxiliar = await prisma.classroomAuxiliar.create({
        data: { idClassroom: data.idClassroom, idAuxiliar: data.idAuxiliar },
        select: classroomAuxiliarFields.create,
      });
      return {
        classroomAuxiliar:
          mappersUtils.formatClassroomAuxiliar(classroomAuxiliar),
      };
    });
    return queryResult.classroomAuxiliar;
  },

  createByGrade: async (data) => {
    return prisma.$transaction(async (tx) => {
      // Validar que el usuario sea auxiliar
      const auxiliar = await tx.user.findUnique({
        where: { idUser: data.idAuxiliar },
        select: { idUser: true, role: true },
      });

      if (!auxiliar || auxiliar.role !== "AUXILIAR") {
        throw new AppError("El usuario no es un auxiliar válido", 400, [
          {
            field: "idAuxiliar",
            message: "El usuario no es un auxiliar válido",
          },
        ]);
      }

      const classrooms = await tx.classroom.findMany({
        where: {
          year: data.year,
          status: "ACTIVO",
          section: {
            grade: { level: data.grade },
          },
        },
        select: { idClassroom: true },
      });

      if (classrooms.length === 0) {
        throw new AppError(
          "No se encontraron salones de clase para el grado",
          404,
          [
            {
              field: "grade",
              message: "No se encontraron salones de clase para el grado",
            },
          ],
        );
      }

      const result = await tx.classroomAuxiliar.createMany({
        data: classrooms.map((c) => ({
          idClassroom: c.idClassroom,
          idAuxiliar: data.idAuxiliar,
        })),
        skipDuplicates: true,
      });

      return {
        requested: classrooms.length,
        created: result.count,
        alreadyAssigned: classrooms.length - result.count,
      };
    });
  },

  get: async ({
    page,
    limit,
    sortOrder,
    sortBy,
    search,
    idClassroom,
    idAuxiliar,
  }) => {
    const parsedIdClassroom =
      idClassroom !== undefined ? Number(idClassroom) : undefined;
    const parsedIdAuxiliar =
      idAuxiliar !== undefined ? Number(idAuxiliar) : undefined;

    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idClassroom", "idAuxiliar"],
      relationStringFields: [
        { relation: "auxiliar", field: "firstname" },
        { relation: "auxiliar", field: "lastname" },
      ],
      relationFields: [{ relation: "classroom", field: "year" }],
      relationNestedFields: [
        { relation: "classroom", nestedRelation: "section", field: "name" },
      ],
      filters: {
        idClassroom: parsedIdClassroom,
        idAuxiliar: parsedIdAuxiliar,
      },
    });

    const [classroomAuxiliar, total] = await Promise.all([
      prisma.classroomAuxiliar.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
        select: classroomAuxiliarFields.select,
      }),
      prisma.classroomAuxiliar.count({ where }),
    ]);

    return [classroomAuxiliar.map(mappersUtils.formatClassroomAuxiliar), total];
  },

  getById: async ({ idClassroomAuxiliar }) => {
    const classroomAuxiliar = await prisma.classroomAuxiliar.findUnique({
      where: { idClassroomAuxiliar },
      select: classroomAuxiliarFields.select,
    });
    if (classroomAuxiliar) {
      return mappersUtils.formatClassroomAuxiliar(classroomAuxiliar);
    }

    throw new AppError("No existe un registro con el ID proporcionado", 404, [
      {
        field: "idClassroomAuxiliar",
        message: "No existe un registro con el ID proporcionado",
      },
    ]);
  },

  update: async ({ idClassroomAuxiliar, data }) => {
    const queryResult = await prisma.classroomAuxiliar.update({
      where: { idClassroomAuxiliar: idClassroomAuxiliar },
      data,
      select: classroomAuxiliarFields.select,
    });

    return mappersUtils.formatClassroomAuxiliar(queryResult);
  },

  delete: async ({ idClassroomAuxiliar }) => {
    const queryResult = await prisma.classroomAuxiliar.delete({
      where: { idClassroomAuxiliar: idClassroomAuxiliar },
      select: classroomAuxiliarFields.select,
    });
    return mappersUtils.formatClassroomAuxiliar(queryResult);
  },
};

export { classroomAuxiliarService };
